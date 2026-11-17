
import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";

if (!uri) {
  throw new Error("MongoDB connection string is missing");
}

const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;
