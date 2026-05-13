import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { subscribeAuth, type AppUser } from "@/services/auth";
import { ensureUserProfile } from "@/services/firestore/usersRepo";

type AuthState = {
  user: AppUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    void ensureUserProfile(
      user.uid,
      user.email,
      user.displayName ?? user.email.split("@")[0] ?? "User",
    );
  }, [user]);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
