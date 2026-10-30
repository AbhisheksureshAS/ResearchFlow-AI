from pydantic import BaseModel
from typing import Literal

class BlogRequest(BaseModel):
    topic: str
    blog_type: Literal[
        "tutorial",
        "research",
        "comparison",
        "listicle",
        "opinion",
        "how_to"
    ] = "research"

class ReviewRequest(BaseModel):
    feedback:str
    approval: bool    