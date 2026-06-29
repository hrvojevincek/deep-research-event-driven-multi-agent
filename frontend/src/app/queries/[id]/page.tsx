import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type QueryDetailPageProps = {
  params: Promise<{ id: string }>;
};

const pipelineStages = [
  { id: "ingestion", label: "Ingestion", status: "completed" },
  { id: "embedding", label: "Embedding", status: "completed" },
  { id: "knowledge", label: "Knowledge", status: "running" },
  { id: "research", label: "Research", status: "pending" },
  { id: "synthesis", label: "Synthesis", status: "pending" },
] as const;

function statusVariant(
  status: (typeof pipelineStages)[number]["status"],
): "default" | "secondary" | "outline" {
  switch (status) {
    case "completed":
      return "secondary";
    case "running":
      return "default";
    default:
      return "outline";
  }
}

export default async function QueryDetailPage({ params }: QueryDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6 md:p-10">
      <div className="space-y-2">
        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
          Job detail
        </Badge>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Query job</h1>
          <Badge variant="outline" className="font-mono text-xs">
            {id}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Placeholder layout for React Flow, synthesis, sources, and cost panels.
          Live SSE updates arrive in Phase 4.1.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="min-h-80">
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
            <CardDescription>
              React Flow graph will render here with stage nodes and animated
              edges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <Badge
                    variant={statusVariant(stage.status)}
                    className="font-mono text-xs"
                  >
                    {stage.label}
                  </Badge>
                  {index < pipelineStages.length - 1 ? (
                    <span className="text-muted-foreground">→</span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-8 flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                React Flow canvas
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
                Report preview placeholder…
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
