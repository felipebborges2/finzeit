import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LimitsForm } from "@/components/LimitsForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LimitesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
  redirect("/login");
}


  const cookie = cookies().toString();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/expenses`, {
    headers: { Cookie: cookie },
  });

  const expenses: { type: string }[] = await res.json();
  const types = Array.from(new Set(expenses.map((e) => e.type)));

  return (
    <div className="bg-gray-200 text-black min-h-screen w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Configurar Limites</h1>
      <LimitsForm existingTypes={types} />
    </div>
  );
}
