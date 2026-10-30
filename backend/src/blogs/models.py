from sqlalchemy import Column,Integer,DateTime,String,ForeignKey,Text,Boolean
from backend.src.utils.db import Base
from datetime import datetime

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer,primary_key=True)
    title=Column(String,nullable=False,)
    content =Column(Text,nullable=False)
    user_id=Column(Integer,ForeignKey('users.id'),nullable=False)
    created_at=Column(DateTime,default=datetime.now)
    is_public = Column(Boolean, default=False, nullable=False)