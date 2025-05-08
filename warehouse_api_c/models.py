from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Item(db.Model):
    __tablename__ = 'items'
    item_id = Column(Integer, primary_key=True)
    item_name = Column(String(20))  # Auto-generated
    length = Column(Numeric(5, 2))
    width = Column(Numeric(5, 2))
    height = Column(Numeric(5, 2))
    orientation = Column(String(20), default='Face Up')
    is_fragile = Column(Boolean, default=False)
    remarks = Column(Text)
    is_assigned = Column(Boolean, default=False)

class Task(db.Model):
    __tablename__ = 'tasks'
    task_id = Column(Integer, primary_key=True)
    task_name = Column(String(20))
    worker_id = Column(Integer)
    status = Column(Enum('Assigned', 'Completed'), default='Assigned')

class TaskItem(db.Model):
    __tablename__ = 'task_items'
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('tasks.task_id'))
    item_id = Column(Integer, ForeignKey('items.item_id'))
