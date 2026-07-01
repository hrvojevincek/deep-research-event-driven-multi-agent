import uuid
from unittest.mock import MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from eventforge.api.deps import get_cognito_validator, get_db, get_settings
from eventforge.api.routes.queries import get_publisher
from eventforge.core.config import Settings
from eventforge.db.models import Job, JobStatus, User
from eventforge.db.repositories import UserRepository
from eventforge.db.session import reset_engine
from eventforge.events.publisher import EventPublisher
from eventforge.main import app
from eventforge.services.auth.cognito import (
    CognitoClaims,
    CognitoTokenValidationError,
    CognitoTokenValidator,
)


@pytest.fixture
def auth_enabled_settings(monkeypatch: pytest.MonkeyPatch) -> Settings:
    monkeypatch.setenv("AUTH_DISABLED", "false")
    monkeypatch.setenv("COGNITO_USER_POOL_ID", "eu-west-2_TestPool")
    monkeypatch.setenv("COGNITO_REGION", "eu-west-2")
    monkeypatch.setenv("COGNITO_APP_CLIENT_ID", "test-app-client-id")
    get_settings.cache_clear()
    settings = get_settings()
    yield settings
    get_settings.cache_clear()


@pytest.fixture
async def db_session(auth_enabled_settings: Settings) -> AsyncSession:
    reset_engine()
    engine = create_async_engine(
        auth_enabled_settings.async_database_url, pool_pre_ping=True)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session
        await session.rollback()
    await engine.dispose()
    reset_engine()


@pytest.fixture
async def auth_client(db_session: AsyncSession) -> AsyncClient:
    mock_validator = MagicMock(spec=CognitoTokenValidator)
    mock_validator.validate.return_value = CognitoClaims(
        sub="cognito-sub-123",
        email="auth-user@example.com",
    )

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_publisher] = lambda: MagicMock(
        spec=EventPublisher)
    app.dependency_overrides[get_cognito_validator] = lambda: mock_validator

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        ac.mock_validator = mock_validator  # type: ignore[attr-defined]
        yield ac

    app.dependency_overrides.clear()


def test_cognito_validator_rejects_access_token() -> None:
    get_settings.cache_clear()
    try:
        cfg = Settings(
            auth_disabled=False,
            cognito_user_pool_id="eu-west-2_TestPool",
            cognito_region="eu-west-2",
            cognito_app_client_id="client-id",
        )
        validator = CognitoTokenValidator(cfg)

        with patch.object(validator._jwks_client, "get_signing_key_from_jwt") as mock_key:
            mock_key.return_value = MagicMock(key="secret")
            with patch(
                "eventforge.services.auth.cognito.jwt.decode",
                return_value={"sub": "abc", "token_use": "access"},
            ):
                with pytest.raises(CognitoTokenValidationError, match="ID token"):
                    validator.validate("token")
    finally:
        get_settings.cache_clear()


async def test_queries_require_bearer_when_auth_enabled(
        auth_client: AsyncClient) -> None:
    response = await auth_client.post(
        "/api/v1/queries",
        json={"topic": "Should fail", "depth": "standard"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


async def test_queries_accept_valid_cognito_token(
        auth_client: AsyncClient) -> None:
    response = await auth_client.post(
        "/api/v1/queries",
        json={"topic": "Authenticated query", "depth": "standard"},
        headers={"Authorization": "Bearer fake-id-token"},
    )
    assert response.status_code == 201
    auth_client.mock_validator.validate.assert_called_once_with(
        "fake-id-token")  # type: ignore[attr-defined]


async def test_get_query_returns_404_for_other_users_job(
    auth_client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    owner = User(auth_subject_id="owner-sub", email="owner@example.com")
    db_session.add(owner)
    await db_session.flush()

    job = Job(
        user_id=owner.id,
        correlation_id=uuid.uuid4().hex,
        topic="Private job",
        depth="standard",
        status=JobStatus.PENDING.value,
    )
    db_session.add(job)
    await db_session.flush()

    auth_client.mock_validator.validate.return_value = CognitoClaims(  # type: ignore[attr-defined]
        sub="other-sub",
        email="other@example.com",
    )

    response = await auth_client.get(
        f"/api/v1/queries/{job.id}",
        headers={"Authorization": "Bearer fake-id-token"},
    )
    assert response.status_code == 404

    auth_client.mock_validator.validate.return_value = CognitoClaims(  # type: ignore[attr-defined]
        sub="owner-sub",
        email="owner@example.com",
    )
    response = await auth_client.get(
        f"/api/v1/queries/{job.id}",
        headers={"Authorization": "Bearer fake-id-token"},
    )
    assert response.status_code == 200
    assert response.json()["topic"] == "Private job"


async def test_list_queries_scoped_to_authenticated_user(
    auth_client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    auth_client.mock_validator.validate.return_value = CognitoClaims(  # type: ignore[attr-defined]
        sub="list-scope-owner",
        email="list-owner@example.com",
    )
    owner = await UserRepository(db_session).get_or_create_by_auth_subject(
        "list-scope-owner",
        email="list-owner@example.com",
    )
    other = await UserRepository(db_session).get_or_create_by_auth_subject(
        "other-sub",
        email="other@example.com",
    )

    db_session.add_all(
        [
            Job(
                user_id=owner.id,
                correlation_id=uuid.uuid4().hex,
                topic="Mine",
                depth="standard",
                status=JobStatus.PENDING.value,
            ),
            Job(
                user_id=other.id,
                correlation_id=uuid.uuid4().hex,
                topic="Theirs",
                depth="standard",
                status=JobStatus.PENDING.value,
            ),
        ]
    )
    await db_session.flush()

    response = await auth_client.get(
        "/api/v1/queries",
        headers={"Authorization": "Bearer fake-id-token"},
    )
    assert response.status_code == 200
    topics = {item["topic"] for item in response.json()}
    assert topics == {"Mine"}
