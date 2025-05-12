from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, ForeignKey, Enum
from backend.app.db.database import Base

import enum
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


# ----- Item -----
class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_name = Column(String(20), unique=True, index=True, nullable=False)
    length = Column(Numeric(5, 2), nullable=False)
    width = Column(Numeric(5, 2), nullable=False)
    height = Column(Numeric(5, 2), nullable=False)
    orientation = Column(String(20), default="Face Up")
    remarks = Column(Text, nullable=True)
    is_fragile = Column(Boolean, default=False)
    is_assigned = Column(Boolean, default=False)

# ----- Task -----
class TaskStatusEnum(enum.Enum):
    Assigned = "Assigned"
    Completed = "Completed"

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_name = Column(String(20), unique=True, nullable=False)
    worker_id = Column(Integer, nullable=False)
    status = Column(Enum(TaskStatusEnum), default=TaskStatusEnum.Assigned)

class TaskItem(Base):
    __tablename__ = "task_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey('tasks.task_id'))
    item_id = Column(Integer, ForeignKey('items.item_id'))

# ----- Container -----
class Container(Base):
    __tablename__ = "containers"

    container_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    length = Column(Numeric(5, 2), nullable=False)
    width = Column(Numeric(5, 2), nullable=False)
    height = Column(Numeric(5, 2), nullable=False)
    label = Column(String(50), nullable=True)



