from fastapi import APIRouter,Depends,status,Request
from backend.src.utils.db import get_db
from sqlalchemy.orm import Session
from backend.src.user import controller
from backend.src.user import dtos


user_route=APIRouter(prefix='/user')

@user_route.post('/registration',response_model= dtos.UserResponse,status_code=status.HTTP_202_ACCEPTED)
def user_register(userSchema: dtos.UserSchema,db:Session=Depends(get_db)):
    return controller.user_registration(userSchema,db)

@user_route.post('/login',status_code=status.HTTP_202_ACCEPTED)
def user_login(userSchema: dtos.UserLogin,db:Session=Depends(get_db)):
    return controller.user_login(userSchema,db)

@user_route.post('/get_auth',status_code=status.HTTP_202_ACCEPTED)
def get_auth(request:Request,db:Session=Depends(get_db)):
    return controller.auth(request,db)
