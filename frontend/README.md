# EventForge Frontend

Next.js 16 App Router dashboard for the EventForge research pipeline.

## Stack

- Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- TanStack Query — query list, detail, submit
- React Flow — live pipeline graph on `/queries/[id]`
- SSE (`useJobStream`) — real-time stage updates (fetch + Bearer auth)
- AWS Amplify Auth — Cognito sign-in (Phase 4.4)
- OpenAPI codegen — `npm run codegen` → `src/types/api.ts`

## Pages

| Route | Purpose |
| ----- | ------- |
| `/` | Landing + recent job history |
| `/queries/new` | Submit research query |
| `/login` | Cognito sign-in (when auth enabled) |
| `/auth/callback` | OAuth redirect handler |
| `/queries/[id]` | Live pipeline, synthesis, sources, cost |

## Local dev

```bash
cp .env.example .env.local   # NEXT_PUBLIC_AUTH_DISABLED=true by default
npm install
npm run dev                  # http://localhost:3000
```

Default local dev uses `NEXT_PUBLIC_AUTH_DISABLED=true` (matches backend `AUTH_DISABLED=true`). For real Cognito, see [`docs/LOCAL_DEV.md`](../docs/LOCAL_DEV.md) § Authentication.

```bash
# repo root
make dev               # full stack via Docker Compose
# or hybrid: infra + backend + frontend natively (see docs/LOCAL_DEV.md)
make workers           # required for pipeline to complete
```

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # ESLint
npm run codegen   # regenerate types from backend OpenAPI
```

From repo root: `make openapi` exports OpenAPI + runs codegen.

## Structure

```
src/
├── app/                    # App Router pages
├── components/
│   ├── dashboard/          # submit form, history, synthesis, sources, cost
│   ├── workflow/           # React Flow pipeline graph
│   ├── layout/             # shell, sidebar, header
│   ├── auth/               # login form, route guard
│   └── ui/                 # shadcn/ui
├── hooks/
│   ├── useJobStream.ts     # SSE subscription
│   └── use-queries.ts      # TanStack Query hooks
└── lib/
    ├── api-client.ts       # typed fetch wrapper
    ├── auth-config.ts      # Amplify / Cognito config
    └── auth-token.ts       # ID token for API + SSE
```

Docs: [`docs/LOCAL_DEV.md`](../docs/LOCAL_DEV.md) · [KRE-154](https://linear.app/kreativbiro/issue/KRE-154) (Phase 4.4)
