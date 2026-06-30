"use client";

import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  configureAmplifyAuth,
  hasHostedUi,
  isAuthEnabled,
} from "@/lib/auth-config";

type AuthUser = {
  email: string;
  sub: string;
};

type AuthContextValue = {
  enabled: boolean;
  loading: boolean;
  user: AuthUser | null;
  hostedUiAvailable: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithHostedUi: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchAuthUser(): Promise<AuthUser | null> {
  configureAmplifyAuth();

  try {
    const session = await fetchAuthSession();
    if (!session.tokens?.idToken) {
      return null;
    }

    const current = await getCurrentUser();
    const email =
      (session.tokens.idToken.payload.email as string | undefined) ??
      current.signInDetails?.loginId ??
      current.username;

    return { email, sub: current.userId };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const enabled = isAuthEnabled();
  const [loading, setLoading] = useState(enabled);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshSession = useCallback(async () => {
    if (!enabled) {
      return;
    }
    const nextUser = await fetchAuthUser();
    setUser(nextUser);
    setLoading(false);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    void fetchAuthUser().then((nextUser) => {
      if (cancelled) {
        return;
      }
      setUser(nextUser);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    configureAmplifyAuth();
    await signIn({ username: email, password });
    await refreshSession();
  }, [refreshSession]);

  const signInWithHostedUi = useCallback(async () => {
    configureAmplifyAuth();
    await signInWithRedirect();
  }, []);

  const signOutUser = useCallback(async () => {
    if (!enabled) {
      return;
    }
    configureAmplifyAuth();
    await signOut();
    setUser(null);
  }, [enabled]);

  const value = useMemo<AuthContextValue>(
    () => ({
      enabled,
      loading,
      user,
      hostedUiAvailable: hasHostedUi(),
      signInWithEmail,
      signInWithHostedUi,
      signOutUser,
      refreshSession,
    }),
    [
      enabled,
      loading,
      user,
      signInWithEmail,
      signInWithHostedUi,
      signOutUser,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
