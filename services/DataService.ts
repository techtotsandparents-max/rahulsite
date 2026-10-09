import { AzureCosmosClient } from '@/lib/azure/cosmos';

export type DataType = 'blogs' | 'adventures' | 'projects' | 'videos' | 'settings' | 'about';

const collectionMap: Record<DataType, string> = {
  blogs: 'posts',
  adventures: 'adventures',
  projects: 'projects',
  videos: 'videos',
  settings: 'settings',
  about: 'about',
};

/**
 * Service Layer: Data Access
 * Handles collection mapping, sorting, and business validations for database entities.
 */
export class DataService {
  public static isSupportedDataType(type: string): type is DataType {
    return Object.hasOwn(collectionMap, type);
  }

  public static isDatabaseConfigured() {
    return AzureCosmosClient.isDatabaseConfigured();
  }

  private static getCollectionName(type: DataType) {
    return collectionMap[type];
  }

  public static async listItems(type: DataType): Promise<Record<string, unknown>[]> {
    const db = await AzureCosmosClient.connect();
    if (!db) {
      throw new Error('Database not configured');
    }

    const collection = db.collection(this.getCollectionName(type));
    
    if (type === 'settings') {
      return collection.find({}).toArray() as Promise<Record<string, unknown>[]>;
    }

    const items = await collection.find({}).toArray();
    return items.sort((a, b) => {
      const dateA = new Date((a.publishedAt || a.visitedAt || a.createdAt) as string).getTime();
      const dateB = new Date((b.publishedAt || b.visitedAt || b.createdAt) as string).getTime();
      return dateB - dateA;
    }) as Record<string, unknown>[];
  }

  public static async createItem(type: DataType, item: Record<string, unknown>) {
    const db = await AzureCosmosClient.connect();
    if (!db) {
      throw new Error('Database not configured');
    }

    const collection = db.collection(this.getCollectionName(type));
    await collection.insertOne(item);
    return item;
  }

  public static async updateItem(type: DataType, id: string, item: Record<string, unknown>) {
    const db = await AzureCosmosClient.connect();
    if (!db) {
      throw new Error('Database not configured');
    }

    const collection = db.collection(this.getCollectionName(type));
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: item },
      { returnDocument: 'after' }
    );

    return result ?? null;
  }

  public static async deleteItem(type: DataType, id: string) {
    const db = await AzureCosmosClient.connect();
    if (!db) {
      throw new Error('Database not configured');
    }

    const collection = db.collection(this.getCollectionName(type));
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
