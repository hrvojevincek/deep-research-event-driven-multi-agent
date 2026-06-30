"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/components/providers/auth-provider";

function LoginPageContent() {
  const { enabled, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      router.replace("/");
      return;
    }
    if (!loading && user) {
      router.replace("/");
    }
  }, [enabled, loading, user, router]);

  if (!enabled) {
    return (
      <p className="text-sm text-muted-foreground">
        Authentication is disabled in local dev.
      </p>
    );
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading sign in…</p>
        }
      >
        <LoginPageContent />
      </Suspense>
    </div>
  );
}
