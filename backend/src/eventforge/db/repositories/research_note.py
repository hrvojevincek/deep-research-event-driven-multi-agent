import uuid

from sqlalchemy import func, select

from eventforge.db.models import ResearchNote
from eventforge.db.repositories.base import BaseRepository


class ResearchNoteRepository(BaseRepository):
    async def list_by_job_id(self, job_id: uuid.UUID) -> list[ResearchNote]:
        result = await self.session.execute(
            select(ResearchNote)
            .where(ResearchNote.job_id == job_id)
            .order_by(ResearchNote.task_index)
        )
        return list(result.scalars().all())

    async def get_by_task_id(self, task_id: uuid.UUID) -> ResearchNote | None:
        result = await self.session.execute(
            select(ResearchNote).where(ResearchNote.task_id == task_id)
        )
        return result.scalar_one_or_none()

    async def count_by_job_id(self, job_id: uuid.UUID) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(ResearchNote).where(ResearchNote.job_id == job_id)
        )
        return int(result.scalar_one())
