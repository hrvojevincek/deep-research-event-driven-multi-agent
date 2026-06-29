#!/usr/bin/env bash
# Fetch a Cognito ID token for local API testing.
# Usage:
#   export COGNITO_CLIENT_SECRET='your-secret-from-console'
#   ./scripts/get-cognito-token.sh
# Optional overrides:
#   COGNITO_REGION=eu-west-2 COGNITO_CLIENT_ID=... COGNITO_USERNAME=test COGNITO_PASSWORD=...

set -euo pipefail

CLIENT_ID="${COGNITO_CLIENT_ID:-41sl0urt1foo708avjeq1qa79o}"
CLIENT_SECRET="${COGNITO_CLIENT_SECRET:-}"
USERNAME="${COGNITO_USERNAME:-test}"
PASSWORD="${COGNITO_PASSWORD:-YourSecurePass123!}"
REGION="${COGNITO_REGION:-eu-west-2}"

if [[ -z "${CLIENT_SECRET}" ]]; then
  echo "Set COGNITO_CLIENT_SECRET (from Cognito console → App client → Show client secret)." >&2
  echo "  export COGNITO_CLIENT_SECRET='...'" >&2
  exit 1
fi

SECRET_HASH="$(
  printf '%s' "${USERNAME}${CLIENT_ID}" \
    | openssl dgst -sha256 -hmac "${CLIENT_SECRET}" -binary \
    | base64
)"

aws cognito-idp initiate-auth \
  --region "${REGION}" \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id "${CLIENT_ID}" \
  --auth-parameters "USERNAME=${USERNAME},PASSWORD=${PASSWORD},SECRET_HASH=${SECRET_HASH}" \
  --query 'AuthenticationResult.IdToken' \
  --output text
