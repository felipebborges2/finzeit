import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST /api/expenses → adiciona nova despesa
export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("finance");

  const result = await db.collection("expenses").insertOne(body);

  return NextResponse.json({ insertedId: result.insertedId });
}

// GET /api/expenses → lista todas as despesas
export async function GET() {
  const client = await clientPromise;
  const db = client.db("finance");

  const expenses = await db.collection("expenses").find().toArray();
  return NextResponse.json(expenses);
}
