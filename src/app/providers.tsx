"use client";

import { Sidebar } from "@/components/Sidebar";
import { SessionWrapper } from "@/components/SessionWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      <div className="flex min-h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-x-hidden bg-gray-100">{children}</main>
      </div>
    </SessionWrapper>
  );
}
