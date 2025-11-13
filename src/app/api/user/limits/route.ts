import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUserCollection } from "@/lib/user-collection";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });

  const users = await getUserCollection();
  const user = await users.findOne({ email: session.user.email });

  return NextResponse.json(user?.limits || {});
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });

  const body = await req.json();
  const users = await getUserCollection();

  await users.updateOne(
    { email: session.user.email },
    { $set: { limits: body } }
  );

  return NextResponse.json({ success: true });
}
