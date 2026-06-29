import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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

const depthOptions = [
  { value: "quick", label: "Quick", hint: "~1 min · fewer sources" },
  { value: "standard", label: "Standard", hint: "~3 min · balanced" },
  { value: "deep", label: "Deep", hint: "~5 min · thorough" },
];

export default function NewQueryPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 md:p-10">
      <div className="space-y-2">
        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
          New query
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">
          Submit a research topic
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure your investigation. API submission wiring lands in KRE-124.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query parameters</CardTitle>
          <CardDescription>
            Topic is required. Depth and source limits are optional constraints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g. Impact of event-driven architectures on agent orchestration"
              defaultValue=""
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Depth</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {depthOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer flex-col gap-1 rounded-lg border border-border p-3 has-checked:border-primary has-checked:bg-primary/5"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="radio"
                      name="depth"
                      value={option.value}
                      defaultChecked={option.value === "standard"}
                      className="accent-primary"
                    />
                    {option.label}
                  </span>
                  <span className="pl-5 text-xs text-muted-foreground">
                    {option.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="max_sources">Max sources (optional)</Label>
            <Input
              id="max_sources"
              name="max_sources"
              type="number"
              min={1}
              max={50}
              placeholder="20"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Requires Cognito sign-in once auth UI is wired (Phase 4.4).
          </p>
          <div className="flex gap-2">
            <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
              Cancel
            </Button>
            <Button disabled>Submit query</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
