from sqlalchemy import Column, Integer, String, Enum, CheckConstraint
import enum
import re
from ..db.database import Base

class UserRole(enum.Enum):
    Manager = "Manager"
    Worker = "Worker"

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(20), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # store hashed password
    role = Column(Enum(UserRole), nullable=False)
    
    # add constraint for username: 5-20 characters, only allow letters, numbers and underscores
    __table_args__ = (
        CheckConstraint(
            "length(username) >= 5 AND length(username) <= 20",
            name="check_username_length"
        ),
    ) 