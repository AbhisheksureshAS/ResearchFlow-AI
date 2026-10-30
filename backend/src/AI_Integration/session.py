import uuid
from fastapi import APIRouter,Depends
from backend.src.utils.db import get_db
from backend.src.user.models import User
from sqlalchemy.orm import Session
from fastapi import HTTPException,Request,status
from datetime import datetime,timedelta
from backend.src.utils import setting
from jwt.exceptions import InvalidTokenError,ExpiredSignatureError
import jwt
from langgraph.types import Command
from pwdlib import PasswordHash
from backend.src.blogs import dtos
from backend.src.blogs.models import Blog
from backend.src.user.router import get_auth
from backend.src.AI_Integration import models
from langgraph.checkpoint.postgres import PostgresSaver
from backend.src.AI_Integration.graph import get_graph

from backend.src.utils.setting import setting
from langgraph.checkpoint.memory import InMemorySaver
memory=InMemorySaver()

graph=get_graph(memory)

sesssion= APIRouter(prefix='/session')

@sesssion.post('/generate_response')
def start_session(body:models.BlogRequest,user:User=Depends(get_auth)):
    
    initial_state={
            "topic": body.topic,
            "blog_type": body.blog_type,
        
            "research": None,

            "draft": None,
            "final_blog": None,
            "approved": False,
            "status": "running",
            "review_stage": 'research',
            "human_feedback" : None,
            "revision_count": 0,
            "max_revisions": 6
    }
    id=str(uuid.uuid4())
    config={"configurable":{"thread_id":id}}
    result = graph.invoke(initial_state, config=config)
    interrupts = result.get("__interrupt__", [])
    if not interrupts:
        raise HTTPException(
            status_code=500,
            detail="Workflow did not pause for review."
        )


    review = interrupts[0].value

    return {
            "thread_id": id,
            "stage": review["stage"],
            "status":'awaiting_review',
            "content": review["content"],
        }


@sesssion.post("/{thread_id}/second_response")
def second_response(
    thread_id: str,
    body: models.ReviewRequest,
    user: User = Depends(get_auth),
):
    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }
    result = graph.invoke(
        Command(
            resume={
                "approval": body.approval,
                "feedback": body.feedback,
            }
        ),
        config=config,
    )
    interrupts = result.get("__interrupt__", [])

    if interrupts:
        review = interrupts[0].value

        return {
            "thread_id": thread_id,
            "stage": review["stage"],
            "status":'awaiting',
            "content": review["content"],
        }
    return {
        "thread_id": thread_id,
        "status": result.get("status", "completed"),
        "final_blog": result.get("final_blog"),
    }
