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
import { PipelineGraph } from "@/components/workflow/pipeline-graph";
import { useJobStream } from "@/hooks/useJobStream";

type QueryDetailLiveProps = {
  jobId: string;
};

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
          Pipeline graph updates in real time via SSE. Click a stage for
          details.
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
            <PipelineGraph stages={stream.stages} />
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
