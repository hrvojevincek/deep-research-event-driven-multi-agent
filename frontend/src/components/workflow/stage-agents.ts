/** Maps pipeline stage IDs to worker agent display names. */
export const STAGE_AGENT_NAMES: Record<string, string> = {
  ingestion: "Ingestion Agent",
  embedding: "Embedding Agent",
  knowledge_mining: "Knowledge Agent",
  research: "Research Agent",
  synthesis: "Synthesis Agent",
};

export function agentNameForStage(stageId: string): string {
  return STAGE_AGENT_NAMES[stageId] ?? stageId;
}
