import { MongoClient } from "mongodb";
const connectionString = process.env.DB_API || "";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db("weather");
export default db;