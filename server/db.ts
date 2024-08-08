import { MongoClient, Db, Collection, FindCursor } from 'mongodb';

export async function StartDB(client: MongoClient) {
  try {
    await client.connect();
    console.log("Connected to MongoDB")
  } catch(e) {
    console.error(e)
  }

}

export async function FetchDB(client: MongoClient): Promise<any[]> {
  const db: Db = client.db("call");
  const collection: Collection = db.collection("users");
  const cursor: FindCursor = collection.find();
  const data = await cursor.toArray();
  return data;
}




