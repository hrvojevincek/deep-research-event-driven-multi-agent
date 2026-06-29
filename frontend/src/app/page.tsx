import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-lg space-y-3 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          EventForge
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Multi-agent research, event-driven
        </h1>
        <p className="text-muted-foreground">
          Teal secondary · copper primary · monospace UI
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>New query</Button>
        <Button variant="secondary">Recent jobs</Button>
        <Button variant="outline">Docs</Button>
      </div>
    </main>
  );
}
