from pydantic import BaseModel,ConfigDict
from datetime import datetime



class BlogCreate(BaseModel):
    title: str
    content: str


class BlogUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class BlogResponse(BaseModel):
    id: int
    title: str
    content: str
    user_id: int
    created_at: datetime
    is_public :bool

    model_config = ConfigDict(from_attributes=True)