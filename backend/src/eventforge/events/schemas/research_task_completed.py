from datetime import UTC, datetime
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field

from eventforge.events.schemas.constants import (
    DETAIL_TYPE_RESEARCH_TASK_COMPLETED,
    RESEARCH_TASK_COMPLETED_SCHEMA_VERSION,
)
from eventforge.events.schemas.envelope import EventEnvelope


class ResearchTaskCompletedPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    task_id: UUID
    note_id: UUID
    task_index: int = Field(ge=0)


class ResearchTaskCompletedEvent(EventEnvelope):
    detail_type: Literal["eventforge.research.task.completed"] = (
        DETAIL_TYPE_RESEARCH_TASK_COMPLETED
    )
    schema_version: Literal["1.0"] = RESEARCH_TASK_COMPLETED_SCHEMA_VERSION
    payload: ResearchTaskCompletedPayload


def build_research_task_completed_event(
    *,
    job_id: UUID,
    correlation_id: str,
    task_id: UUID,
    note_id: UUID,
    task_index: int,
    event_id: UUID | None = None,
    timestamp: datetime | None = None,
) -> ResearchTaskCompletedEvent:
    return ResearchTaskCompletedEvent(
        event_id=event_id or uuid4(),
        correlation_id=correlation_id,
        job_id=job_id,
        timestamp=timestamp or datetime.now(tz=UTC),
        payload=ResearchTaskCompletedPayload(
            task_id=task_id,
            note_id=note_id,
            task_index=task_index,
        ),
    )
