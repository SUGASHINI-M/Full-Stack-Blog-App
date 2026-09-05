import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
let database;
export let users;
export let posts;

export async function connectDB() {
  await client.connect();
  database = client.db(process.env.MONGODB_DB || "blog");
  users = database.collection("users");
  posts = database.collection("posts");
  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    users.createIndex({ username: 1 }, { unique: true }),
  ]);
  console.log(`Connected to MongoDB database: ${database.databaseName}`);
}
