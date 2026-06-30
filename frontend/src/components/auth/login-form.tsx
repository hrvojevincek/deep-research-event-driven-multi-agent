"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const { hostedUiAvailable, signInWithEmail, signInWithHostedUi } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleEmailSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await signInWithEmail(email.trim(), password);
      router.replace(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setPending(false);
    }
  }

  async function handleHostedUiSignIn() {
    setError(null);
    setPending(true);
    try {
      await signInWithHostedUi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redirect failed");
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Authenticate with your Cognito user pool to access EventForge.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleEmailSignIn}>
        <CardContent className="space-y-4">
          {hostedUiAvailable ? (
            <Button
              type="button"
              className="w-full"
              disabled={pending}
              onClick={() => void handleHostedUiSignIn()}
            >
              Continue with Cognito Hosted UI
            </Button>
          ) : null}

          {hostedUiAvailable ? (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or email
                </span>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
