import mongoose from 'mongoose';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

/**
 * Infrastructure Layer: Cosmos DB (MongoDB API)
 * Handles KeyVault secrets, connection pooling, and establishing Mongoose instances.
 */
export class AzureCosmosClient {
  private static connectionString: string | undefined;
  private static connectPromise: Promise<typeof mongoose> | null = null;
  private static dbName = process.env.COSMOS_DB_NAME ?? 'rahultech_prod';

  public static isDatabaseConfigured() {
    return Boolean(process.env.COSMOS_DB_CONNECTION_STRING) || Boolean(process.env.AZURE_KEYVAULT_URI);
  }

  private static async getConnectionString(): Promise<string | undefined> {
    if (this.connectionString) return this.connectionString;
    
    const envConnStr = process.env.COSMOS_DB_CONNECTION_STRING;
    const keyVaultUri = process.env.AZURE_KEYVAULT_URI;

    if (envConnStr) {
      this.connectionString = envConnStr;
      return envConnStr;
    }
    
    if (!keyVaultUri) return undefined;

    try {
      const credential = new DefaultAzureCredential();
      const client = new SecretClient(keyVaultUri, credential);
      const secret = await client.getSecret('cosmos-db-connection-string');
      
      if (secret.value) {
        this.connectionString = secret.value;
        return this.connectionString;
      }
    } catch (error) {
      console.error('Failed to fetch Cosmos DB connection string from Key Vault:', error);
    }
    return undefined;
  }

  public static async connect() {
    const connStr = await this.getConnectionString();
    if (!connStr) {
      return null;
    }

    if (mongoose.connection?.db) {
      return mongoose.connection.db;
    }

    if (!this.connectPromise) {
      this.connectPromise = mongoose.connect(connStr, {
        dbName: this.dbName,
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
      });
    }

    await this.connectPromise;
    return mongoose.connection.db;
  }
}
