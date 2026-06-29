"use client";

import { useEffect, useState } from "react";

import { ApiError, getApiBaseUrl, getHealth } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HealthState =
  | { kind: "loading" }
  | { kind: "ok"; status: string }
  | { kind: "error"; message: string };

export function BackendHealthBadge({ className }: { className?: string }) {
  const [health, setHealth] = useState<HealthState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const result = await getHealth();
        if (!cancelled) {
          setHealth({ kind: "ok", status: result.status });
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof ApiError
              ? `API ${error.status}`
              : error instanceof Error
                ? error.message
                : "Unreachable";
          setHealth({ kind: "error", message });
        }
      }
    }

    void checkHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    health.kind === "loading"
      ? "API…"
      : health.kind === "ok"
        ? `API ${health.status}`
        : "API offline";

  const title =
    health.kind === "error"
      ? `${label} — ${health.message} (${getApiBaseUrl()})`
      : `${label} — ${getApiBaseUrl()}`;

  return (
    <Badge
      variant="outline"
      title={title}
      className={cn(
        "hidden font-mono text-[10px] uppercase tracking-wide sm:inline-flex",
        health.kind === "ok" && "border-secondary/40 text-secondary",
        health.kind === "error" && "border-destructive/40 text-destructive",
        className,
      )}
    >
      {label}
    </Badge>
  );
}
