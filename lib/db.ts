import mongoose from 'mongoose';

type DataType = 'blogs' | 'adventures' | 'projects' | 'videos' | 'settings';

const collectionMap: Record<DataType, string> = {
  blogs: 'posts',
  adventures: 'adventures',
  projects: 'projects',
  videos: 'videos',
  settings: 'settings',
};

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const dbName = process.env.COSMOS_DB_NAME ?? 'rahultech_prod';

let connectPromise: Promise<typeof mongoose> | null = null;

function isConnectionReady() {
  return Boolean(mongoose.connection?.db);
}

export function isDatabaseConfigured() {
  return Boolean(connectionString);
}

export async function connectDb() {
  if (!connectionString) {
    return null;
  }

  if (isConnectionReady()) {
    return mongoose.connection.db;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(connectionString, {
      dbName,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
    });
  }

  await connectPromise;
  return mongoose.connection.db;
}

export function isSupportedDataType(type: string): type is DataType {
  return type in collectionMap;
}

function getCollectionName(type: DataType) {
  return collectionMap[type];
}

export async function listItems(type: DataType): Promise<Record<string, unknown>[]> {
  const db = await connectDb();
  if (!db) {
    throw new Error('Database not configured');
  }

  const collection = db.collection(getCollectionName(type));
  if (type === 'settings') {
    return collection.find({}).toArray() as Promise<Record<string, unknown>[]>;
  }

  return collection
    .find({})
    .sort({ publishedAt: -1, visitedAt: -1, createdAt: -1 })
    .toArray() as Promise<Record<string, unknown>[]>;
}

export async function createItem(type: DataType, item: Record<string, unknown>) {
  const db = await connectDb();
  if (!db) {
    throw new Error('Database not configured');
  }

  const collection = db.collection(getCollectionName(type));
  await collection.insertOne(item);
  return item;
}

export async function updateItem(
  type: DataType,
  id: string,
  item: Record<string, unknown>
) {
  const db = await connectDb();
  if (!db) {
    throw new Error('Database not configured');
  }

  const collection = db.collection(getCollectionName(type));
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: item },
    { returnDocument: 'after' }
  );

  return result ?? null;
}

export async function deleteItem(type: DataType, id: string) {
  const db = await connectDb();
  if (!db) {
    throw new Error('Database not configured');
  }

  const collection = db.collection(getCollectionName(type));
  const result = await collection.deleteOne({ id });
  return result.deletedCount > 0;
}
