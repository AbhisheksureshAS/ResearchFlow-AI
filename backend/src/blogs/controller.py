
from backend.src.utils.db import get_db
from backend.src.user.models import User
from sqlalchemy.orm import Session
from fastapi import HTTPException,Request,status
from datetime import datetime,timedelta
from backend.src.utils import setting
from jwt.exceptions import InvalidTokenError,ExpiredSignatureError
import jwt
from pwdlib import PasswordHash
from backend.src.blogs import dtos
from backend.src.blogs.models import Blog

def blogs(blogSchema: dtos.BlogCreate,db:Session,user:User):
    title=blogSchema.title
    content=blogSchema.content
    blog=Blog(
        title=title,
        content=content,
        user_id=user.id,
        is_public=False

    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog

def allblog(db:Session,user:User):
    all_blog=db.query(Blog).filter(Blog.user_id==user.id).all()
    return all_blog

def publicBlog(db:Session):
    all_blog=db.query(Blog).filter(Blog.is_public==True).all()
    return all_blog

def oneblog(blog_id:int,db:Session,user:User):
    blog=db.query(Blog).filter(Blog.user_id==user.id,blog_id==Blog.id).first()
    if not blog:
        raise HTTPException(status_code=404,detail='blog not found')
    return blog

def updateblog(data:dtos.BlogUpdate,blog_id:int,db:Session,user:User):
    blog=db.query(Blog).filter(Blog.user_id==user.id,blog_id==Blog.id).first()
    if not blog:
        raise HTTPException(status_code=404,detail='blog not found')
    if data.title:
        blog.title=data.title

    if data.content:
        blog.content=data.content

    db.commit()
    db.refresh(blog)   
    return blog

def deleteee(blog_id:int,db:Session,user:User):
    blog=db.query(Blog).filter(Blog.user_id==user.id,blog_id==Blog.id).first()
    if not blog:
        raise HTTPException(status_code=404,detail='blog not found')
    db.delete(blog)
    db.commit()
    return {"message":"blog deleted successfully"}

def pub(blog_id:int,db:Session,user:User):
    blog=db.query(Blog).filter(Blog.user_id==user.id,blog_id==Blog.id).first()
    if not blog:
        raise HTTPException(status_code=404,detail='blog not found')
    blog.is_public=True
    db.commit()
    db.refresh(blog)
    return blog

def unpublish_blog(blog_id: int, db: Session, user: User):
    blog = db.query(Blog).filter(
        Blog.id == blog_id,
        Blog.user_id == user.id
    ).first()

    if not blog:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    blog.is_public = False

    db.commit()
    db.refresh(blog)

    return blog