#!/usr/bin/env bash
# Verify GitHub OIDC role trust policy matches this repo (run after terraform apply).
set -euo pipefail

ROLE_NAME="${1:-eventforge-dev-github-actions}"
GITHUB_ORG="${2:-hrvojevincek}"
GITHUB_REPO="${3:-deep-research-event-driven-multi-agent}"
EXPECTED_SUB="repo:${GITHUB_ORG}/${GITHUB_REPO}:*"

echo "Checking IAM role: ${ROLE_NAME}"
echo "Expected OIDC sub pattern: ${EXPECTED_SUB}"
echo

aws iam get-role --role-name "${ROLE_NAME}" --query 'Role.AssumeRolePolicyDocument' --output json

echo
echo "OIDC provider thumbprints:"
aws iam list-open-id-connect-providers --output table
PROVIDER_ARN="$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn | [0]" --output text)"
if [ -n "${PROVIDER_ARN}" ] && [ "${PROVIDER_ARN}" != "None" ]; then
  aws iam get-open-id-connect-provider --open-id-connect-provider-arn "${PROVIDER_ARN}" \
    --query '{Url:Url,ClientIDs:ClientIDList,Thumbprints:ThumbprintList}' --output json
else
  echo "No GitHub OIDC provider found in this account."
fi

echo
echo "Terraform output (if in environments/dev):"
if command -v terraform >/dev/null 2>&1 && [ -f infra/terraform/environments/dev/terraform.tfvars ]; then
  (cd infra/terraform/environments/dev && terraform output -raw github_actions_role_arn 2>/dev/null) || true
fi
