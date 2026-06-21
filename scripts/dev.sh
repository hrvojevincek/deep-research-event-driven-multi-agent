#!/usr/bin/env bash
# Convenience wrapper for local development
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

docker compose up --build "$@"
