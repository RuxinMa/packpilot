from pydantic import BaseModel
from typing import Optional, List

class ItemCreate(BaseModel):
    length: float
    width: float
    height: float
    orientation: Optional[str] = "Face Up"
    remarks: Optional[str] = None

class ItemOut(ItemCreate):
    item_id: int
    item_name: str

    class Config:
        from_orm = True



