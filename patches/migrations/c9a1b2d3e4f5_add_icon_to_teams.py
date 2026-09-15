"""Add icon to teams

Revision ID: c9a1b2d3e4f5
Revises: b7f2a934c810
Create Date: 2026-09-14

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "c9a1b2d3e4f5"
down_revision = "b7f2a934c810"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("teams", sa.Column("icon", sa.String(length=256), nullable=True))


def downgrade():
    op.drop_column("teams", "icon")
