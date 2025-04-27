from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta

from ..db.database import get_db
from . import models, schemas, auth
from ..core.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(tags=["authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

@router.post("/api/auth/token", status_code=status.HTTP_200_OK)
async def login(user_data: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    """
    user login API, returns JWT access token
    """
    user = db.query(models.User).filter(
        models.User.username == user_data.username,
        models.User.role == user_data.role
    ).first()
    
    if not user or not auth.verify_password(user_data.password, user.password):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {
            "status": "error",
            "message": "Incorrect username, password, or role",
            "token": None,
            "role": None,
            "redirect_url": None
        }
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    # Set redirect URL based on role
    redirect_url = "/manager/dashboard" if user.role == models.UserRole.Manager else "/worker/dashboard"
    
    return {
        "status": "success",
        "message": "Login successful",
        "token": access_token,
        "role": user.role.value,
        "redirect_url": redirect_url
    }