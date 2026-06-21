from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EventEnvelope(BaseModel):
    """Shared fields on every EventBridge event in the pipeline."""

    model_config = ConfigDict(extra="forbid")

    event_id: UUID
    correlation_id: str = Field(min_length=1, max_length=64)
    job_id: UUID
    timestamp: datetime
    schema_version: str
    detail_type: str = Field(pattern=r"^eventforge\.")
    payload: dict
