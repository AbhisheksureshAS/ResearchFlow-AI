
from backend.src.utils.db import get_db
from backend.src.user.models import User
from sqlalchemy.orm import Session
from backend.src.user import dtos
from fastapi import HTTPException,Request
from datetime import datetime,timedelta,timezone
from backend.src.utils import setting
from jwt.exceptions import InvalidTokenError,ExpiredSignatureError
import jwt
from pwdlib import PasswordHash

hashing=PasswordHash.recommended()

def make_hash(password:str):
    return hashing.hash(password)

def verify_password(plain_password,hashed_password):
    return hashing.verify(plain_password,hashed_password)

def user_registration(schema: dtos.UserSchema,db:Session):
    # first we will check whether the user is already registered or not
    is_user= db.query(User).filter(User.username==schema.username).first()
    if is_user:
        raise HTTPException(409,detail="username already exist")
    is_email=db.query(User).filter(User.email==schema.email).first()
    if is_email:
        raise HTTPException(409,detail="email already exist")

    user=User(
        username=schema.username,
        email=schema.email,
        password_hash=make_hash(schema.password_hash),
        created_at=datetime.now()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {'username': user.username,'email': user.email}

    
def user_login(schema: dtos.UserLogin,db:Session):
    # here we will first cheeck if user exist or not 
    is_email=db.query(User).filter(User.email==schema.email).first()
    if not is_email:
        raise HTTPException(401,detail="account dont exist")
    if not verify_password(schema.password_hash,is_email.password_hash):
        raise HTTPException(401,detail='wrong password')
    ex_time =datetime.now(timezone.utc) + timedelta(minutes=setting.setting.EXP_TIME)
    # ex_time = datetime.now(timezone.utc) + timedelta(seconds=10)
    print("Expiration time:", ex_time)
    token =jwt.encode({"email":schema.email,"exp":ex_time},setting.setting.SECRET_KEY,setting.setting.ALGORITHM)
    return {'token':token}


def auth(request:Request,db:Session):
    token=request.headers.get('Authorization')
    if not token:
        raise HTTPException(status_code=402,detail='unauthorized token')
    if token.split(' ')[0]!= 'jwt':
        raise HTTPException(status_code=401,detail='wrong bearer')
    token=token.split(' ')[-1]
    try:
        data=jwt.decode(token,setting.setting.SECRET_KEY,setting.setting.ALGORITHM)
        print('valid token')
        print("Token expiration:", data["exp"])
        print("Current UTC time:", datetime.now()+ timedelta(minutes=setting.setting.EXP_TIME))
    except ExpiredSignatureError:
        print('token expired')
        raise HTTPException(status_code=401,detail='token expired')    
    except InvalidTokenError:
        print('invalid token')
        raise HTTPException(status_code=401,detail='invalid token')    

    user=db.query(User).filter(User.email==data['email']).first()
    if not user:
        raise HTTPException(status_code=403,detail='unauthorized user')
    return user