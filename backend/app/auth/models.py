from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, ForeignKey, Enum
from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
import enum
from sqlalchemy import Enum
from sqlalchemy import Enum

class UserRole(enum.Enum):
    Manager = "Manager"
    Worker = "Worker"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
