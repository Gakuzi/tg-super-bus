import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ensureFirebase } from '../setup/firebase';

interface AuthContextValue {
  user: User | null | undefined;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const { auth } = ensureFirebase();
      unsub = onAuthStateChanged(auth, (u) => setUser(u));
    } catch (e) {
      // Если Firebase не настроен — сразу показываем неавторизованного пользователя,
      // чтобы отобразить лендинг и инструкции вместо вечной «Загрузка…»
      setUser(null);
    }
    return () => { if (unsub) unsub(); };
  }, []);

  const value = useMemo(() => ({ user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

