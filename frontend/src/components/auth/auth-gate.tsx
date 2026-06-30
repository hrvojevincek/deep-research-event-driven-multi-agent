"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";

const PUBLIC_PATHS = new Set(["/login", "/auth/callback"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { enabled, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!enabled || loading) {
      return;
    }
    if (user || PUBLIC_PATHS.has(pathname)) {
      return;
    }
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [enabled, loading, user, pathname, router]);

  if (!enabled) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }

  if (!user && !PUBLIC_PATHS.has(pathname)) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  return children;
}
