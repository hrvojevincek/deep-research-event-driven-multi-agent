"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";

function AuthCallbackHandler() {
  const { refreshSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nextPath = searchParams.get("next") ?? "/";

    void refreshSession()
      .then(() => router.replace(nextPath))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Authentication failed");
      });
  }, [refreshSession, router, searchParams]);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return <p className="text-sm text-muted-foreground">Completing sign in…</p>;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Completing sign in…</p>
        }
      >
        <AuthCallbackHandler />
      </Suspense>
    </div>
  );
}
