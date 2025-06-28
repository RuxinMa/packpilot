from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TaskCreate(BaseModel):
    task_name: Optional[str] = None
    container_id: int
    assigned_to: str
    deadline: Optional[str] = None

class ItemInTask(BaseModel):
    item_id: int
    item_name: str
    width: float
    height: float
    depth: float
    orientation: Optional[str] = None
    remarks: Optional[str] = None
    is_fragile: bool
    placement_order: Optional[int] = None
    x: Optional[float] = None
    y: Optional[float] = None
    z: Optional[float] = None

class TaskOut(BaseModel):
    task_id: int
    task_name: str
    container_id: int
    assigned_to: str
    manager_name: str
    status: str
    deadline: Optional[datetime] = None
    items: List[ItemInTask] = []

    class Config:
        from_attributes = True

class TaskHistoryItem(BaseModel):
    task_name: str
    worker: str
    workload: int
    status: str
    items: List[ItemInTask] = []
