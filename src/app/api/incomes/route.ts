import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

// GET /api/incomes → lista todas as receitas do usuário logado
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("finance");

  const incomes = await db
    .collection("incomes")
    .find({ userId: session.user.email })
    .toArray();

  return NextResponse.json(incomes);
}

// POST /api/incomes → salva uma nova receita para o usuário logado
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("finance");

  const incomeWithOwner = { ...body, userId: session.user.email };

  const result = await db.collection("incomes").insertOne(incomeWithOwner);

  return NextResponse.json({ insertedId: result.insertedId });
}
