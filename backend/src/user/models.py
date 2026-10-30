from sqlalchemy import Column,Integer,DateTime,String,Boolean
from backend.src.utils.db import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)


    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )