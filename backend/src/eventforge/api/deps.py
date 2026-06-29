from collections.abc import AsyncGenerator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from eventforge.core.config import Settings, get_settings
from eventforge.db.models import User
from eventforge.db.repositories import UserRepository
from eventforge.db.session import get_session
from eventforge.services.auth.cognito import CognitoTokenValidationError, CognitoTokenValidator

__all__ = ["Settings", "get_current_user", "get_db",
           "get_settings", "resolve_current_user"]

_bearer = HTTPBearer(auto_error=False)


async def resolve_current_user(
    session: AsyncSession,
    credentials: HTTPAuthorizationCredentials | None,
    settings: Settings,
    validator: CognitoTokenValidator,
) -> User:
    """Resolve the authenticated user using an caller-owned DB session."""
    user_repo = UserRepository(session)

    if settings.auth_disabled:
        return await user_repo.get_or_create_mock_user()

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        claims = validator.validate(credentials.credentials)
    except CognitoTokenValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    email = claims.email or f"{claims.sub}@users.eventforge.local"
    return await user_repo.get_or_create_by_auth_subject(claims.sub, email=email)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session


def get_cognito_validator(
        settings: Settings = Depends(get_settings)) -> CognitoTokenValidator:
    return CognitoTokenValidator(settings)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    session: AsyncSession = Depends(get_db),
    settings: Settings = Depends(get_settings),
    validator: CognitoTokenValidator = Depends(get_cognito_validator),
) -> User:
    """Resolve the authenticated user from Cognito JWT or local dev bypass."""
    return await resolve_current_user(session, credentials, settings, validator)
