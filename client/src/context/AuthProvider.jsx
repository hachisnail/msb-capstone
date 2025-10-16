import { createContext, useContext, useEffect, useState } from "react";
import { loginCredentials, logout, me } from "../lib/authApi";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { session } = await me();
      setSession(session);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function signIn(identifier, password) {
    await loginCredentials(identifier, password);
    await refresh();
  }

  async function signOut() {
    await logout();
    setSession(null);
  }

  const hasRole = (role) => !!session?.user?.roles?.includes(role);
  const hasPerm = (perm) => !!session?.user?.perms?.includes(perm);

  return (
    <AuthCtx.Provider
      value={{ session, loading, signIn, signOut, refresh, hasRole, hasPerm }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
