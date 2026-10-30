from pydantic import BaseModel

class UserSchema(BaseModel):

    username:str
    email:str
    password_hash:str

class UserLogin(BaseModel):
    email:str
    password_hash:str

class UserResponse(BaseModel):
    username:str
    email:str
