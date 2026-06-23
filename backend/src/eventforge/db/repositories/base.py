from sqlalchemy.ext.asyncio import AsyncSession


class BaseRepository:
    """Base data-access layer bound to an async SQLAlchemy session."""
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
