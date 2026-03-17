import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// DELETE /api/incomes/[id] → remove uma receita do banco
// Receitas não têm recorrência, então sempre é hard delete
// No Next.js 15, params é uma Promise — precisa de await antes de acessar o id
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("finance");

  // Verifica _id E userId juntos: o usuário só pode deletar receitas que são dele
  const result = await db.collection("incomes").deleteOne({
    _id: objectId,
    userId: session.user.email,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: "Receita não encontrada ou sem permissão" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
