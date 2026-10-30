from fastapi import APIRouter,Depends,status,Request
from backend.src.utils.db import get_db
from sqlalchemy.orm import Session
from backend.src.blogs import controller
from backend.src.blogs.dtos import BlogResponse,BlogUpdate
from backend.src.blogs import dtos
from backend.src.user.models import User
from backend.src.user.router import get_auth
from typing import List


user_blogs=APIRouter(prefix='/blogs')

@user_blogs.post('/blog',response_model=BlogResponse ,status_code=status.HTTP_201_CREATED)
def blogg(blogSchema: dtos.BlogCreate,db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.blogs(blogSchema,db,user)

@user_blogs.get('/public_blog',response_model=list[BlogResponse] )
def pblog(db:Session=Depends(get_db)):
    return controller.publicBlog(db)

@user_blogs.get('/blog',response_model=list[BlogResponse] )
def blog(db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.allblog(db,user)

@user_blogs.get('/{blog_id}',response_model=BlogResponse)
def oneblog(blog_id:int,db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.oneblog(blog_id,db,user)

@user_blogs.put('/{blog_id}',response_model=BlogResponse)
def update(data:BlogUpdate,blog_id:int,db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.updateblog(data,blog_id,db,user)

@user_blogs.delete('/{blog_id}')
def deletee(blog_id:int,db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.deleteee(blog_id,db,user)

@user_blogs.patch('/{blog_id}/publish',response_model=BlogResponse)
def publish(blog_id:int,db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.pub(blog_id,db,user)

@user_blogs.patch('/{blog_id}/unpublish',response_model=BlogResponse)
def unpublish_blog(blog_id:int,db:Session=Depends(get_db),user:User=Depends(get_auth)):
    return controller.unpublish_blog(blog_id,db,user)

