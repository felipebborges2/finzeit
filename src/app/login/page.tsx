"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-10 w-full max-w-md text-center">
        
        {/* LOGO DO FINZEIT */}
        <div className="flex justify-center mb-4">
          <Image
            src="/finzeit-logo.png"
            alt="FinZeit Logo"
            width={150}
            height={150}
            priority
          />
        </div>

        <p className="text-gray-600 mb-6">
          Faça login para acessar seu painel financeiro
        </p>

        <button
          onClick={() => signIn("google")}
          className="
            w-full 
            flex items-center justify-center gap-3 
            bg-blue-600 hover:bg-blue-500 
            text-white py-3 rounded-md 
            transition duration-200
            font-semibold
          "
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
