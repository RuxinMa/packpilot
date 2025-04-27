from pydantic import BaseModel, validator
from typing import Optional
import re
from .models import UserRole

class UserBase(BaseModel):
    username: str
    role: UserRole
    
    @validator('username')
    def username_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{5,20}$', v):
            raise ValueError('username must be 5-20 characters, only allow letters, numbers and underscores')
        return v

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
    role: UserRole
    
    @validator('username')
    def username_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{5,20}$', v):
            raise ValueError('username must be 5-20 characters, only allow letters, numbers and underscores')
        return v

class User(UserBase):
    user_id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[UserRole] = None 