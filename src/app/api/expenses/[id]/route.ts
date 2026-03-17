import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Utilitário: converte a string da URL em ObjectId do MongoDB
// O MongoDB usa ObjectId como tipo de _id por padrão (não é uma string simples)
function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// DELETE /api/expenses/[id] → remove uma despesa normal (não fixa) do banco
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

  // deleteOne com dois critérios: _id E userId
  // Isso garante que o usuário só consegue deletar despesas que são dele
  const result = await db.collection("expenses").deleteOne({
    _id: objectId,
    userId: session.user.email,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: "Despesa não encontrada ou sem permissão" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

// PATCH /api/expenses/[id] → atualiza campos de uma despesa (usado para cancelar despesas fixas)
// "Soft delete": em vez de apagar, marca com canceledAt para preservar o histórico
export async function PATCH(
  req: Request,
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

  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("finance");

  // $set é o operador do MongoDB para atualizar campos específicos
  // sem $set, o documento inteiro seria substituído pelo body
  const result = await db.collection("expenses").updateOne(
    { _id: objectId, userId: session.user.email },
    { $set: body }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { error: "Despesa não encontrada ou sem permissão" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
