#!/bin/bash
# Bootstrap EventForge AWS resources in LocalStack
set -euo pipefail

awslocal events create-event-bus --name eventforge-bus || true

for queue in ingestion embedding knowledge-mining research synthesis dlq; do
  awslocal sqs create-queue --queue-name "eventforge-${queue}" || true
done

# Wire DLQ redrive policy (configure in Phase 2)
echo "EventForge LocalStack resources initialized."
