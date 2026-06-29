"""rename users.clerk_id to auth_subject_id

Revision ID: j0e1f2a3b4c5
Revises: i9d0e1f2a3b4
Create Date: 2026-06-29 14:45:00.000000

"""

from collections.abc import Sequence

from alembic import op

revision: str = "j0e1f2a3b4c5"
down_revision: str | Sequence[str] | None = "i9d0e1f2a3b4"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("users", "clerk_id", new_column_name="auth_subject_id")


def downgrade() -> None:
    op.alter_column("users", "auth_subject_id", new_column_name="clerk_id")
