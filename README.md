# EventForge

**Event-Driven Multi-Agent Research & Synthesis Platform**

Users submit research queries; events trigger a decoupled pipeline of specialized AI agents. Results appear in an interactive dashboard with live React Flow workflow visualization.

## Quick Start

```bash
cp .env.example .env
# See docs/LOCAL_DEV.md for full setup
make dev
```

## Documentation

### Cursor IDE (agent context)

| Source | Purpose |
|--------|---------|
| [`.cursor/rules/`](./.cursor/rules/) | **Auto-loaded rules** — primary agent context |
| [AGENTS.md](./AGENTS.md) | Cursor agent entry point |
| [CLAUDE.md](./CLAUDE.md) | Concise agent summary |

### Deep reference

| Document | Purpose |
|----------|---------|
| [docs/PRD.md](./docs/PRD.md) | Product requirements & user stories |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, event flows, diagrams |
| [docs/TECH_DECISIONS.md](./docs/TECH_DECISIONS.md) | Architecture Decision Records (ADRs) |
| [docs/LINEAR.md](./docs/LINEAR.md) | Linear issue index + MCP workflow |
| [docs/TASKS.md](./docs/TASKS.md) | Prioritized roadmap (mirror) |
| [docs/LOCAL_DEV.md](./docs/LOCAL_DEV.md) | Local development with Docker Compose |

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind, shadcn/ui, React Flow
- **Backend:** Python FastAPI, async workers, agent orchestration
- **Events:** AWS EventBridge + SQS + Step Functions
- **Data:** Postgres (RDS) + Qdrant (vectors)
- **Cloud:** AWS (Terraform IaC)
- **Observability:** OpenTelemetry

## Project Structure

```
event-driven/
├── frontend/          # Next.js app
├── backend/           # FastAPI + agents + workers
├── infra/             # Terraform / IaC
├── shared/            # Event schemas, API contracts
├── docs/              # Project documentation
└── scripts/           # Dev & ops helpers
```

## License

MIT (portfolio project)
