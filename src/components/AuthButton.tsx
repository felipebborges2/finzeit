"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const AuthButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4 bg-white p-2 rounded-md shadow border border-gray-300">
        <span className="text-black max-w-[200px] truncate">
          Olá, {session.user?.name}
        </span>
        <button
          onClick={() => signOut()}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
    >
      Entrar com Google
    </button>
  );
};
