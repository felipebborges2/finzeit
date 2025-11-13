'use client';

import { useSession } from 'next-auth/react';

export const UserCard = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { email, displayName, customImage, image } = session.user;

  return (
    <div className="flex items-center gap-4 bg-white border p-4 rounded shadow-md max-w-md">
      <img
        src={customImage || image || '/default.png'}
        alt="Foto de perfil"
        className="w-16 h-16 rounded-full object-cover border"
      />
      <div>
        <h2 className="text-lg font-semibold">
          Olá, {displayName ?? session.user.name ?? "Usuário"}!
        </h2>
        <p className="text-sm text-gray-600">{email}</p>
      </div>
    </div>
  );
};
