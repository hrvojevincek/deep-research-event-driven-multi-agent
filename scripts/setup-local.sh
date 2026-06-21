#!/usr/bin/env bash
# One-time local environment setup
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — review and update secrets."
fi

chmod +x scripts/*.sh infra/docker/localstack/init/*.sh 2>/dev/null || true

echo "Local setup complete. Run: make dev"
echo "See docs/LOCAL_DEV.md for next steps."
