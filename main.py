from fastapi import FastAPI
# from backend.src.utils.db import engine,Base
from backend.src.utils.db import engine,Base 
from backend.src.user.router import user_route
from backend.src.blogs import models
from backend.src.blogs.router import user_blogs
from backend.src.AI_Integration.session import sesssion
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app=FastAPI(title='ResearchFlow Ai',description="AI-Based Blogging Application", version="1.0.0")
app.include_router(user_route)
app.include_router(user_blogs)
app.include_router(sesssion)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://researchflowai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
