"""Add icon to challenges

Revision ID: b7f2a934c810
Revises: 8275865e5992
Create Date: 2026-09-14

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "b7f2a934c810"
down_revision = "f63a9205d72f"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "challenges", sa.Column("icon", sa.String(length=256), nullable=True)
    )


def downgrade():
    op.drop_column("challenges", "icon")