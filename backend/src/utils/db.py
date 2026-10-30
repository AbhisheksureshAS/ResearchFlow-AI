from backend.src.utils.setting import setting
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

# create_engine is used to establish connection with data base whenever needed
# declarative_base for defining the models or simpluy the table
# sessionmaker create the session

Base = declarative_base()
engine = create_engine(setting.DB_CONNECTION)
LocalSession = sessionmaker(bind=engine)

def get_db():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()