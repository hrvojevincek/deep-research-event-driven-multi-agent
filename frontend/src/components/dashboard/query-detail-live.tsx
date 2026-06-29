"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useJobStream } from "@/hooks/useJobStream";
import {
  PIPELINE_STAGES,
  type StageStatus,
  stageLabel,
} from "@/types/job-stream";

type QueryDetailLiveProps = {
  jobId: string;
};

function statusVariant(
  status: StageStatus | undefined,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "completed":
      return "secondary";
    case "running":
      return "default";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

function jobStatusLabel(status: string | null): string {
  if (!status) {
    return "connecting…";
  }
  return status.replaceAll("_", " ");
}

export function QueryDetailLive({ jobId }: QueryDetailLiveProps) {
  const stream = useJobStream(jobId);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6 md:p-10">
      <div className="space-y-2">
        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
          Job detail
        </Badge>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Query job</h1>
          <Badge variant="outline" className="font-mono text-xs">
            {jobId}
          </Badge>
          <Badge
            variant={stream.connected ? "secondary" : "outline"}
            className="font-mono text-[10px] uppercase"
          >
            {stream.connected ? "Live" : "Reconnecting"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Pipeline stages update in real time via SSE. React Flow visualization
          arrives in Phase 4.2.
        </p>
        {stream.correlationId ? (
          <p className="font-mono text-xs text-muted-foreground">
            correlation_id: {stream.correlationId}
          </p>
        ) : null}
        {stream.error ? (
          <p className="text-sm text-destructive">{stream.error}</p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="min-h-80">
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
            <CardDescription>
              Job status:{" "}
              <span className="font-mono uppercase">
                {jobStatusLabel(stream.jobStatus)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {PIPELINE_STAGES.map((stage, index) => {
                const live = stream.stages[stage.id];
                const status = (live?.status ?? "pending") as StageStatus;
                return (
                  <div key={stage.id} className="flex items-center gap-2">
                    <Badge
                      variant={statusVariant(status)}
                      className="font-mono text-xs"
                    >
                      {stageLabel(stage.id)}
                    </Badge>
                    {index < PIPELINE_STAGES.length - 1 ? (
                      <span className="text-muted-foreground">→</span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-2">
              {PIPELINE_STAGES.map((stage) => {
                const live = stream.stages[stage.id];
                const status = live?.status ?? "pending";
                return (
                  <div
                    key={`row-${stage.id}`}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{stageLabel(stage.id)}</span>
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                      <span className="uppercase">{status}</span>
                      {live?.duration_ms != null ? (
                        <span>{live.duration_ms} ms</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                React Flow canvas (Phase 4.2)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Synthesis</CardTitle>
              <CardDescription>
                Markdown report with citations appears when the job completes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="rounded-lg border border-dashed border-border p-4">
                {stream.jobStatus === "completed"
                  ? "Job complete — fetch full report via GET /queries/{id} in Phase 4.3."
                  : "Report preview placeholder…"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
              <CardDescription>
                Expandable snippets from ingested documents and web results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="rounded-lg border border-dashed border-border p-3">
                No sources loaded yet.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost</CardTitle>
              <CardDescription>
                Token usage and estimated spend from{" "}
                <code className="font-mono text-xs">llm_usage</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-3" />
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Tokens</dt>
                  <dd className="font-mono">—</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Est. cost</dt>
                  <dd className="font-mono">—</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
