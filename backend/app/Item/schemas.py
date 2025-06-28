from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    width: float
    height: float
    depth: float
    orientation: Optional[str] = "Face Up"
    remarks: Optional[str] = None
    is_fragile: Optional[bool] = False

class ItemOut(BaseModel):
    item_id: int
    item_name: str
    width: float
    height: float
    depth: float
    x: Optional[float] = None
    y: Optional[float] = None  
    z: Optional[float] = None
    placement_order: Optional[int] = None
    orientation: Optional[str] = None
    remarks: Optional[str] = None
    is_fragile: bool
    is_assigned: bool
    task_id: Optional[int] = None

    class Config:
        from_attributes = True

# from AI model update item placement
class ItemPlacementUpdate(BaseModel):
    x: float
    y: float
    z: float
    placement_order: int



