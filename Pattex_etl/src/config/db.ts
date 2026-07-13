import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
import { log } from '../utils/logger';

dotenv.config();

const mongoUri = process.env.MONGO_URI ?? '';
const defaultDbName = process.env.MONGO_DB_NAME ?? '';

if (!mongoUri || !defaultDbName) {
  throw new Error('Please define MONGO_URI and MONGO_DB_NAME in .env file');
}

let client: MongoClient | undefined;
const dbCache = new Map<string, Db>();
const connectedDbs = new Set<string>();

export async function connectToDatabase(dbName: string = defaultDbName): Promise<Db> {
  const cached = dbCache.get(dbName);
  if (cached) return cached;

  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
    log.connected('Connected to MongoDB');
  }

  const db = client.db(dbName);
  dbCache.set(dbName, db);

  if (!connectedDbs.has(dbName)) {
    connectedDbs.add(dbName);
    log.connected(`Using database (${dbName})`);
  }

  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
    dbCache.clear();
    connectedDbs.clear();
    log.closed('MongoDB connection closed');
  }
}
