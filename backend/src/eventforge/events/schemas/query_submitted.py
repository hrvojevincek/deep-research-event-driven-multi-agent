from datetime import UTC, datetime
from enum import StrEnum
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field

from eventforge.events.schemas.constants import (
    DETAIL_TYPE_QUERY_SUBMITTED,
    QUERY_SUBMITTED_SCHEMA_VERSION,
)
from eventforge.events.schemas.envelope import EventEnvelope


class QueryDepth(StrEnum):
    """Research depth preset controlling source count and thoroughness."""

    QUICK = "quick"
    STANDARD = "standard"
    DEEP = "deep"


class QuerySubmittedPayload(BaseModel):
    """Business data for the first pipeline stage — mirrors jobs.topic / depth / max_sources."""

    model_config = ConfigDict(extra="forbid")

    topic: str = Field(min_length=1)
    depth: QueryDepth = QueryDepth.STANDARD
    max_sources: int | None = Field(default=None, ge=1, le=100)


class QuerySubmittedEvent(EventEnvelope):
    """Emitted when the API accepts a new research query (eventforge.query.submitted)."""

    detail_type: Literal["eventforge.query.submitted"] = DETAIL_TYPE_QUERY_SUBMITTED
    schema_version: Literal["1.0"] = QUERY_SUBMITTED_SCHEMA_VERSION
    payload: QuerySubmittedPayload


def build_query_submitted_event(
    *,
    job_id: UUID,
    correlation_id: str,
    topic: str,
    depth: QueryDepth = QueryDepth.STANDARD,
    max_sources: int | None = None,
    event_id: UUID | None = None,
    timestamp: datetime | None = None,
) -> QuerySubmittedEvent:
    """Factory for the API publisher in KRE-129 — fills envelope + payload in one call."""
    return QuerySubmittedEvent(
        event_id=event_id or uuid4(),
        correlation_id=correlation_id,
        job_id=job_id,
        timestamp=timestamp or datetime.now(tz=UTC),
        payload=QuerySubmittedPayload(topic=topic, depth=depth, max_sources=max_sources),
    )
