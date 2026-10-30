
"""add is_public to blogs

Revision ID: 9559e227207e
Revises:
Create Date: 2026-10-26 11:41:33.730808
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# Revision identifiers, used by Alembic.
revision: str = '9559e227207e'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add is_public column to blogs."""

    op.add_column(
        'blogs',
        sa.Column(
            'is_public',
            sa.Boolean(),
            server_default=sa.false(),
            nullable=False
        )
    )

    # Remove the database-level default after existing rows
    # have been populated with False.
    op.alter_column(
        'blogs',
        'is_public',
        server_default=None,
        existing_type=sa.Boolean(),
        existing_nullable=False
    )


def downgrade() -> None:
    """Remove is_public column from blogs."""

    op.drop_column('blogs', 'is_public')
