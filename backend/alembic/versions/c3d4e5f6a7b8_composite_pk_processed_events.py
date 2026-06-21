"""composite pk on processed_events (event_id, worker_name)

Revision ID: c3d4e5f6a7b8
Revises: a1b2c3d4e5f6
Create Date: 2026-06-22 00:40:00.000000

"""

from collections.abc import Sequence

from alembic import op

revision: str = "c3d4e5f6a7b8"
down_revision: str | Sequence[str] | None = "a1b2c3d4e5f6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint("processed_events_pkey", "processed_events", type_="primary")
    op.create_primary_key(
        "processed_events_pkey",
        "processed_events",
        ["event_id", "worker_name"],
    )


def downgrade() -> None:
    op.drop_constraint("processed_events_pkey", "processed_events", type_="primary")
    op.create_primary_key(
        "processed_events_pkey",
        "processed_events",
        ["event_id"],
    )
