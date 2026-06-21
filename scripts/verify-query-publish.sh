#!/usr/bin/env bash
# Verify POST /api/v1/queries publishes to LocalStack EventBridge.
set -euo pipefail

API_URL="${API_URL:-http://localhost:8000}"
TOPIC="${TOPIC:-Event-driven architecture patterns}"

echo "Submitting query to ${API_URL}/api/v1/queries ..."
RESPONSE="$(curl -sf -X POST "${API_URL}/api/v1/queries" \
  -H "Content-Type: application/json" \
  -d "{\"topic\": \"${TOPIC}\", \"depth\": \"standard\", \"max_sources\": 5}")"

echo "Response: ${RESPONSE}"

JOB_ID="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["job_id"])' <<<"${RESPONSE}")"
CORR_ID="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["correlation_id"])' <<<"${RESPONSE}")"

echo "Created job_id=${JOB_ID} correlation_id=${CORR_ID}"
echo "Check API logs for 'Published query.submitted' or inspect LocalStack EventBridge metrics."
