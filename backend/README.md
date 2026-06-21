# EventForge Backend

FastAPI application, SQS workers, and agent pipeline.

## Setup

```bash
cd backend
cp .env.example .env   # or use repo-root .env
uv sync
```

## Run (Phase 1+)

```bash
uv run uvicorn eventforge.main:app --reload --port 8000
```

See `docs/LOCAL_DEV.md` for full stack development.
