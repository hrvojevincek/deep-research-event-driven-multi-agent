# Event Schemas

> **Cursor agents:** Pipeline rules in `.cursor/rules/event-pipeline.mdc`. Define schemas here before backend Pydantic models.

Canonical event contracts shared between backend publishers, workers, and Step Functions.

## Conventions

- Event names: `eventforge.<domain>.<action>` (e.g. `eventforge.research.query_submitted`)
- All events include: `event_id`, `correlation_id`, `timestamp`, `schema_version`, `payload`
- Schemas defined as JSON Schema in this directory; mirrored as Pydantic models in `backend/src/eventforge/events/schemas/`

## Planned Events (MVP)

| Event | Producer | Consumer(s) |
|-------|----------|-------------|
| `query.submitted` | API | Ingestion worker |
| `ingestion.completed` | Ingestion agent | Embedding worker |
| `embedding.completed` | Embedding agent | Knowledge mining worker |
| `knowledge.mined` | Knowledge agent | Research orchestrator |
| `research.task.dispatched` | Orchestrator | Research workers (parallel) |
| `research.task.completed` | Research worker | Synthesis agent |
| `synthesis.completed` | Synthesis agent | API / WebSocket notifier |
| `pipeline.failed` | Any stage | DLQ + alerting |

Schema files will be added in Phase 2.
