"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobStageSnapshot } from "@/types/job-stream";
import { stageLabel } from "@/types/job-stream";

import { agentNameForStage } from "./stage-agents";

type StageDetailPanelProps = {
  stageId: string | null;
  snapshot: JobStageSnapshot | null;
};

function formatTimestamp(value: string | null): string {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString();
}

function formatDuration(ms: number | null): string {
  if (ms == null) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms} ms`;
  }
  return `${(ms / 1000).toFixed(2)} s`;
}

export function StageDetailPanel({ stageId, snapshot }: StageDetailPanelProps) {
  if (!stageId) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Stage details</CardTitle>
          <CardDescription>
            Click a pipeline node to inspect status, timing, and errors.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const status = snapshot?.status ?? "pending";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{stageLabel(stageId)}</CardTitle>
        <CardDescription>{agentNameForStage(stageId)}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-mono text-xs uppercase">{status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="font-mono text-xs">
              {formatDuration(snapshot?.duration_ms ?? null)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Started</dt>
            <dd className="font-mono text-xs">
              {formatTimestamp(snapshot?.started_at ?? null)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Completed</dt>
            <dd className="font-mono text-xs">
              {formatTimestamp(snapshot?.completed_at ?? null)}
            </dd>
          </div>
        </dl>
        {snapshot?.error_detail ? (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {snapshot.error_detail}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
