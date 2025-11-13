import clientPromise from "./mongodb";

export async function getUserCollection() {
  const client = await clientPromise;
  const db = client.db(); // usa o nome do banco do URI, ou pode passar manualmente
  return db.collection("users");
}
