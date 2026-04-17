import React, { createContext, useContext, useMemo, useState } from 'react';

import { mockUsers } from '../data/mockSchoolChatData';
import { AppUser } from '../types/chat';

interface AuthContextValue {
  session: { userId: string } | null;
  profile: AppUser | null;
  loading: boolean;
  users: AppUser[];
  signInAs: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AppUser | null>(null);

  const signInAs = async (userId: string) => {
    const selected = mockUsers.find((user) => user.id === userId);
    if (!selected) {
      throw new Error('Usuario no encontrado');
    }

    setProfile(selected);
  };

  const signOut = async () => {
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      session: profile ? { userId: profile.id } : null,
      profile,
      loading: false,
      users: mockUsers,
      signInAs,
      signOut,
    }),
    [profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
