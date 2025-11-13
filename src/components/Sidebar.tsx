"use client";

import { useState } from "react";
import Link from "next/link";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`
        bg-white
        shadow-md
        border-r border-gray-300
        h-screen flex flex-col items-center
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-48" : "w-14"}
        /* Nenhum rounded aqui */
      `}
    >
      {/* Botão de abrir/fechar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-4 mb-6 text-2xl hover:scale-110 transition-transform"
        title={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        ☰
      </button>

      {isOpen && (
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-gray-700">FinZeit</h1>
        </div>
      )}

      <nav className="flex flex-col gap-4 w-full mt-2">
        <SidebarLink href="/" icon="🏠" label="Página Principal" isOpen={isOpen} />
        <SidebarLink href="/despesas" icon="📝" label="Despesas" isOpen={isOpen} />
        <SidebarLink href="/receitas" icon="💰" label="Receitas" isOpen={isOpen} />
        <SidebarLink href="/limites" icon="📊" label="Limites" isOpen={isOpen} />
        <SidebarLink href="/config" icon="⚙️" label="Configurações" isOpen={isOpen} />
      </nav>
    </aside>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: string;
  label: string;
  isOpen: boolean;
}

const SidebarLink = ({ href, icon, label, isOpen }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className="
        flex items-center gap-2 
        w-full px-3 py-2 
        text-gray-700 hover:bg-gray-100 hover:text-blue-600
        transition-all duration-200
      "
    >
      <span className="text-lg">{icon}</span>

      {isOpen && (
        <span className="text-sm font-medium truncate">
          {label}
        </span>
      )}
    </Link>
  );
};
