"use client";

import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { BackendHealthBadge } from "@/components/layout/backend-health-badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  onMenuClick?: () => void;
};

export function SiteHeader({ onMenuClick }: SiteHeaderProps) {
  const { enabled, loading, user, signOutUser } = useAuth();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="size-4" />
        </Button>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:hidden">
          EventForge
        </p>
      </div>

      <div className="flex items-center gap-2">
        <BackendHealthBadge />
        <ThemeToggle />
        {!enabled ? (
          <Button variant="outline" size="sm" disabled title="Auth disabled locally">
            Dev mode
          </Button>
        ) : loading ? (
          <Button variant="outline" size="sm" disabled>
            …
          </Button>
        ) : user ? (
          <>
            <span className="hidden max-w-[12rem] truncate text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-1">
              <User className="size-3.5 shrink-0" />
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void signOutUser()}
            >
              <LogOut className="size-3.5" data-icon="inline-start" />
              Sign out
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
