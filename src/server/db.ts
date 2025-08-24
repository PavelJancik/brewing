import { MongoClient } from "mongodb";
import { MONGODB_URI, DATABASE_NAME } from "./config";

let connected_client;

export const connect_client = async () => {
  if (connected_client) {
    return connected_client.db(DATABASE_NAME);
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  await client.db(DATABASE_NAME).command({ ping: 1 });
  console.log("Connected successfully to MongoDB server");
  connected_client = client;
  return client.db(DATABASE_NAME);
};

export const stop_client = async () => {
  await connected_client?.close();
};
