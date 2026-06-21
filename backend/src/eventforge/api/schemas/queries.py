from uuid import UUID

from pydantic import BaseModel, Field

from eventforge.events.schemas import QueryDepth


class SubmitQueryRequest(BaseModel):
    topic: str = Field(min_length=1)
    depth: QueryDepth = QueryDepth.STANDARD
    max_sources: int | None = Field(default=None, ge=1, le=100)


class SubmitQueryResponse(BaseModel):
    job_id: UUID
    correlation_id: str
