import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const connectionString = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  return uri;
};

export const closeDatabase = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};
