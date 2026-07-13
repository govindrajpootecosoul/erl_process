import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { parse } from 'csv-parse';
import * as dotenv from 'dotenv';
import { Db } from 'mongodb';
import { connectToDatabase, closeDatabase } from './config/db';
import { etlConfigs, EtlConfig } from './utils/mapping';
import { normalizeColumnName, validateColumns } from './utils/columnSchemas';
import { log, ProcessResult } from './utils/logger';
import { makeRowFingerprint, validateDateValue } from './utils/validators';

dotenv.config();

const azureConnectionString = process.env.AZURE_CONNECTION_STRING ?? '';
const defaultContainerName = process.env.AZURE_CONTAINER_NAME ?? '';
const defaultDbName = process.env.MONGO_DB_NAME ?? '';

if (!azureConnectionString || !defaultContainerName) {
  throw new Error('Please define AZURE_CONNECTION_STRING and AZURE_CONTAINER_NAME in .env file');
}

function getContainerClient(
  blobServiceClient: BlobServiceClient,
  cache: Map<string, ContainerClient>,
  containerName: string
): ContainerClient {
  const cached = cache.get(containerName);
  if (cached) return cached;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  cache.set(containerName, containerClient);
  return containerClient;
}

function getFileLabel(blobName: string): string {
  return blobName.split('/').pop()!.replace(/\.csv$/, '');
}

type PreparedFile = {
  config: EtlConfig;
  fileLabel: string;
  records: Record<string, string>[];
};

async function validateAndPrepareFile(
  config: EtlConfig,
  containerClient: ContainerClient
): Promise<{ result: ProcessResult; prepared?: PreparedFile }> {
  const { blobName, collectionName, requiredColumns } = config;
  const fileLabel = getFileLabel(blobName);
  log.processing(`${fileLabel} (validate)`, collectionName);

  try {
    const blobClient = containerClient.getBlobClient(blobName);

    if (!(await blobClient.exists())) {
      log.notFound(blobName);
      return { result: 'skipped' };
    }

    const downloadResponse = await blobClient.download(0);
    const parser = downloadResponse.readableStreamBody!.pipe(
      parse({ columns: true, skip_empty_lines: true, trim: true, bom: true })
    );

    const requiredSet = new Set(requiredColumns);
    const records: Record<string, string>[] = [];
    let headersValidated = false;
    const dateErrors: string[] = [];
    const seenRows = new Map<string, number>();
    const duplicateSamples: string[] = [];
    let rowNumber = 0;

    for await (const record of parser) {
      rowNumber++;
      if (!headersValidated) {
        const validation = validateColumns(Object.keys(record), requiredColumns);

        if (validation.extraColumns.length > 0) {
          log.warn(`Extra columns in ${fileLabel} (skipped):`);
          validation.extraColumns.forEach((col) => log.warnItem(col));
        }

        if (!validation.valid) {
          log.error(`Stopped ${fileLabel} — missing required columns:`);
          validation.missingColumns.forEach((col) => log.errorItem(col));
          return { result: 'failed' };
        }

        headersValidated = true;
      }

      const cleanRecord: Record<string, string> = {};
      for (const key in record) {
        const cleanKey = normalizeColumnName(key);
        if (requiredSet.has(cleanKey)) {
          cleanRecord[cleanKey] = record[key];
        }
      }

      for (const dc of config.dateColumns) {
        const val = cleanRecord[dc.name];
        const res = validateDateValue(val, dc.formats);
        if (!res.ok) {
          if (dateErrors.length < 20) {
            dateErrors.push(
              `${dc.name}="${String(val ?? '').trim()}" (expected: ${res.expected})`
            );
          }
        }
      }

      const fp = makeRowFingerprint(cleanRecord, requiredColumns);
      const firstSeen = seenRows.get(fp);
      if (firstSeen !== undefined) {
        if (duplicateSamples.length < 10) {
          const hintCols = ['campaign_name', 'campaign', 'asin', 'sku', 'fnsku', 'date', 'country', 'year_month']
            .filter((c) => c in cleanRecord)
            .slice(0, 5)
            .map((c) => `${c}="${String(cleanRecord[c] ?? '').trim()}"`)
            .join(', ');
          duplicateSamples.push(`row ${rowNumber} duplicates row ${firstSeen}${hintCols ? ` (${hintCols})` : ''}`);
        }
      } else {
        seenRows.set(fp, rowNumber);
      }

      records.push(cleanRecord);
    }

    if (!headersValidated) {
      log.error(`Stopped ${fileLabel} — file has no data rows to validate columns`);
      return { result: 'failed' };
    }

    if (records.length === 0) {
      log.info(`No data in ${fileLabel}`);
      return { result: 'skipped' };
    }

    if (duplicateSamples.length > 0) {
      log.error(`Stopped ${fileLabel} — duplicate rows found`);
      duplicateSamples.forEach((s) => log.errorItem(s));
      log.errorItem('Fix duplicates in source file then re-run ETL');
      return { result: 'failed' };
    }

    if (dateErrors.length > 0) {
      log.error(`Stopped ${fileLabel} — invalid date format(s) found:`);
      dateErrors.forEach((e) => log.errorItem(e));
      log.errorItem('Fix date values to the expected formats and re-run ETL');
      return { result: 'failed' };
    }

    log.info(`Validated ${fileLabel}: ${records.length.toLocaleString()} rows OK`);
    return { result: 'success', prepared: { config, fileLabel, records } };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error(`Error with ${fileLabel}: ${message}`);
    return { result: 'failed' };
  }
}

async function uploadAtomic(db: Db, prepared: PreparedFile): Promise<ProcessResult> {
  const { config, fileLabel, records } = prepared;
  const { collectionName } = config;
  log.processing(`${fileLabel} (upload)`, collectionName);

  const tmpName = `${collectionName}__tmp_${Date.now()}`;
  try {
    const tmp = db.collection(tmpName);
    await tmp.insertMany(records);

    await tmp.rename(collectionName, { dropTarget: true });
    log.success(collectionName, records.length);
    return 'success';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error(`Upload failed for ${fileLabel}: ${message}`);
    log.warn(`Old data kept unchanged for [${collectionName}]`);
    return 'failed';
  }
}

async function start(): Promise<void> {
  log.init();
  log.banner();
  log.start(`Starting Pattex ETL — ${etlConfigs.length} files configured`);

  const blobServiceClient = BlobServiceClient.fromConnectionString(azureConnectionString);
  const containerCache = new Map<string, ContainerClient>();

  const validation = { success: 0, failed: 0, skipped: 0 };
  const upload = { success: 0, failed: 0, skipped: 0 };

  try {
    const preparedFiles: PreparedFile[] = [];
    for (const config of etlConfigs) {
      const containerName = config.azureContainer ?? defaultContainerName;
      const containerClient = getContainerClient(blobServiceClient, containerCache, containerName);
      const r = await validateAndPrepareFile(config, containerClient);
      validation[r.result]++;
      if (r.prepared) preparedFiles.push(r.prepared);
    }

    if (preparedFiles.length > 0) {
      log.start(`Uploading ${preparedFiles.length} validated file(s)`);
    }

    for (const prepared of preparedFiles) {
      const dbName = prepared.config.mongoDbName ?? defaultDbName;
      const db = await connectToDatabase(dbName);
      const r = await uploadAtomic(db, prepared);
      upload[r]++;
    }

    log.summary('✅ Validation Summary', validation.success, validation.failed, validation.skipped);
    const totalNotUploaded = validation.failed + validation.skipped + upload.failed + upload.skipped;
    const skippedNotUploaded = validation.failed + validation.skipped + upload.skipped;
    if (totalNotUploaded > 0) {
      log.info(
        `Not uploaded — Validation failed: ${validation.failed}, Validation skipped: ${validation.skipped}, Upload failed: ${upload.failed}, Upload skipped: ${upload.skipped}`
      );
    }
    log.summary('📦 Upload Summary', upload.success, upload.failed, skippedNotUploaded);
    log.complete(upload.success, upload.failed, skippedNotUploaded);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error(`Critical error: ${message}`);
  } finally {
    await closeDatabase();
  }
}

start();
