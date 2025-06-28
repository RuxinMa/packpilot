from sqlalchemy import Column, Integer, String, Enum
from app.db.database import Base
import enum

class UserRole(enum.Enum):
    Manager = "Manager"
    Worker = "Worker"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
