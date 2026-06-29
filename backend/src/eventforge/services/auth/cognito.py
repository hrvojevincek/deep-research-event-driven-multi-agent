import logging
from dataclasses import dataclass

import jwt
from jwt import PyJWKClient

from eventforge.core.config import Settings

logger = logging.getLogger(__name__)


class CognitoTokenValidationError(Exception):
    """Raised when a Cognito JWT fails validation."""


@dataclass(frozen=True)
class CognitoClaims:
    """Identity extracted from a validated Cognito ID token."""

    sub: str
    email: str | None


class CognitoTokenValidator:
    """Validates Cognito ID tokens against the user pool JWKS endpoint."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._jwks_client = PyJWKClient(
            settings.cognito_jwks_url,
            cache_keys=True,
            max_cached_keys=16,
        )

    def validate(self, token: str) -> CognitoClaims:
        try:
            signing_key = self._jwks_client.get_signing_key_from_jwt(token)
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=self._settings.cognito_app_client_id,
                issuer=self._settings.cognito_issuer,
                options={"require": ["exp", "iss", "sub"]},
            )
        except jwt.PyJWTError as exc:
            logger.debug("Cognito token validation failed", exc_info=exc)
            msg = "Invalid or expired token"
            raise CognitoTokenValidationError(msg) from exc

        token_use = claims.get("token_use")
        if token_use is not None and token_use != "id":
            msg = "Expected Cognito ID token"
            raise CognitoTokenValidationError(msg)

        sub = claims["sub"]
        if not isinstance(sub, str) or not sub:
            msg = "Token missing subject"
            raise CognitoTokenValidationError(msg)

        email = claims.get("email")
        if email is not None and not isinstance(email, str):
            email = None

        return CognitoClaims(sub=sub, email=email)
