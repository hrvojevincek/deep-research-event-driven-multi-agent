# EventForge — Linear Integration

> **Source of truth for active work:** [Linear EventForge project](https://linear.app/kreativbiro/project/eventforge-f35070f0931e)  
> **Mirror:** `docs/TASKS.md` checkboxes + `KRE-xxx` links (update when issues close)

## Workspace

| Item | Value |
|------|-------|
| Team | `Kreativbiro` (key: `KRE`) |
| Project | [EventForge](https://linear.app/kreativbiro/project/eventforge-f35070f0931e) |
| Target | Phase 1 by 2026-07-15 |

## Agent workflow (Cursor + Linear MCP)

1. **Start session:** `list_issues` with `project: EventForge` (or `get_issue` for a specific `KRE-xxx`)
2. **Pick work:** Prefer unblocked issues in current milestone; respect `blockedBy`
3. **Implement:** Use acceptance criteria from issue description + `.cursor/rules/`
4. **On complete:** Mark issue Done in Linear + check box in `docs/TASKS.md`

### MCP commands

```
list_issues(project: "EventForge")
get_issue(id: "KRE-117")
save_issue(id: "KRE-117", state: "Done")
```

## Milestones

| Milestone | Status |
|-----------|--------|
| Phase 0 — Foundation | In progress |
| Phase 1 — Scaffolding | Backlog |

## Issue index (Phase 0 + 1)

| ID | Linear | Title | Estimate | Blocked by |
|----|--------|-------|----------|------------|
| EF-001 | [KRE-117](https://linear.app/kreativbiro/issue/KRE-117) | Close Phase 0 — git init + docker verify | 2 | — |
| EF-002 | [KRE-118](https://linear.app/kreativbiro/issue/KRE-118) | Backend project init — uv + package layout | 2 | KRE-117 |
| EF-003 | [KRE-120](https://linear.app/kreativbiro/issue/KRE-120) | FastAPI app + health endpoints | 2 | KRE-118 |
| EF-004 | [KRE-123](https://linear.app/kreativbiro/issue/KRE-123) | DB layer — SQLAlchemy, Alembic, core models | 3 | KRE-120 |
| EF-005 | [KRE-125](https://linear.app/kreativbiro/issue/KRE-125) | Config, logging, Dockerfile, compose wiring | 3 | KRE-123 |
| EF-006 | [KRE-119](https://linear.app/kreativbiro/issue/KRE-119) | Frontend init — Next.js 15, Tailwind, shadcn | 3 | KRE-117 |
| EF-007 | [KRE-121](https://linear.app/kreativbiro/issue/KRE-121) | Frontend layout + placeholder pages | 3 | KRE-119 |
| EF-008 | [KRE-124](https://linear.app/kreativbiro/issue/KRE-124) | Frontend API client + Dockerfile + compose | 2 | KRE-121 |
| EF-009 | [KRE-126](https://linear.app/kreativbiro/issue/KRE-126) | OpenAPI generation + TypeScript codegen | 2 | KRE-120, KRE-124 |
| EF-010 | [KRE-122](https://linear.app/kreativbiro/issue/KRE-122) | Initial event JSON schemas | 2 | KRE-118 |
| EF-011 | [KRE-127](https://linear.app/kreativbiro/issue/KRE-127) | CI stub — lint workflow | 1 | KRE-125, KRE-124 |
| EF-012 | [KRE-128](https://linear.app/kreativbiro/issue/KRE-128) | Phase 1 integration smoke test | 2 | KRE-125, KRE-124, KRE-126, KRE-122, KRE-127 |

**Total estimate:** 27 points

## Parallel tracks (after KRE-117)

```
Track A (backend): KRE-118 → KRE-120 → KRE-123 → KRE-125 → KRE-127
Track B (frontend): KRE-119 → KRE-121 → KRE-124 → KRE-127
Parallel: KRE-122 (after KRE-118), KRE-126 (after KRE-120 + KRE-124)
Finish: KRE-128
```

## Labels

`phase-0`, `phase-1`, `backend`, `frontend`, `infra`, `docs`, `workflows`, `agents`, `observability`, `Feature`

## User shortcuts

| Say this | Agent does |
|----------|------------|
| "What's next in EventForge?" | `list_issues` → suggest unblocked work |
| "Implement KRE-118" | `get_issue` → implement acceptance criteria |
| "Mark KRE-117 done" | Close in Linear + update TASKS.md |

## Grill-me decisions (2025-06-20)

- Scope: Phase 0 + Phase 1 only (~12 grouped issues)
- Linear = active source; TASKS.md = mirror
- New EventForge project on Kreativbiro
- Backend: `uv`
- Phase 1 includes lint-only CI stub
