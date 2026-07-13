import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
import { log } from '../utils/logger';

dotenv.config();

const mongoUri = process.env.MONGO_URI ?? '';
const dbName = process.env.MONGO_DB_NAME ?? '';

if (!mongoUri || !dbName) {
  throw new Error('Please define MONGO_URI and MONGO_DB_NAME in .env file');
}

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(mongoUri);
  await client.connect();
  log.connected(`Connected to MongoDB (${dbName})`);
  db = client.db(dbName);
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
    log.closed('MongoDB connection closed');
  }
}
