from typing import TypedDict


class ResearchState(TypedDict):
    topic: str
    blog_type: str

    research: str | None
    # research_approved : bool
    draft: str | None
    # draft_approved : bool
    final_blog: str | None
    # editor_approved : bool

    review_stage: str
    status: str
    approved: bool
    human_feedback: str | None
    revision_count: int
    max_revisions: int