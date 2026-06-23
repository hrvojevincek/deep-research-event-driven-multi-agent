from datetime import UTC, datetime
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field

from eventforge.events.schemas.constants import (
    DETAIL_TYPE_RESEARCH_TASK_DISPATCHED,
    RESEARCH_TASK_DISPATCHED_SCHEMA_VERSION,
)
from eventforge.events.schemas.envelope import EventEnvelope


class ResearchTaskDispatchedPayload(BaseModel):
    """One parallel research sub-task dispatched to the research worker."""

    model_config = ConfigDict(extra="forbid")

    task_id: UUID
    task_index: int = Field(ge=0)
    sub_query: str = Field(min_length=1)
    entity_ids: list[UUID] = Field(min_length=1)


class ResearchTaskDispatchedEvent(EventEnvelope):
    """Emitted to fan out a research sub-task (eventforge.research.task.dispatched)."""

    detail_type: Literal["eventforge.research.task.dispatched"] = (
        DETAIL_TYPE_RESEARCH_TASK_DISPATCHED
    )
    schema_version: Literal["1.0"] = RESEARCH_TASK_DISPATCHED_SCHEMA_VERSION
    payload: ResearchTaskDispatchedPayload


def build_research_task_dispatched_event(
    *,
    job_id: UUID,
    correlation_id: str,
    task_id: UUID,
    task_index: int,
    sub_query: str,
    entity_ids: list[UUID],
    event_id: UUID | None = None,
    timestamp: datetime | None = None,
) -> ResearchTaskDispatchedEvent:
    return ResearchTaskDispatchedEvent(
        event_id=event_id or uuid4(),
        correlation_id=correlation_id,
        job_id=job_id,
        timestamp=timestamp or datetime.now(tz=UTC),
        payload=ResearchTaskDispatchedPayload(
            task_id=task_id,
            task_index=task_index,
            sub_query=sub_query,
            entity_ids=entity_ids,
        ),
    )
