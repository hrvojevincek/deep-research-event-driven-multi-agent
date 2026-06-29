"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type SiteHeaderProps = {
  onMenuClick?: () => void;
};

export function SiteHeader({ onMenuClick }: SiteHeaderProps) {
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

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button variant="outline" size="sm" disabled>
          Sign in
        </Button>
      </div>
    </header>
  );
}
