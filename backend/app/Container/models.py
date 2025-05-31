from sqlalchemy import Column, Integer, String, Numeric
from app.db.database import Base

class Container(Base):
    __tablename__ = "containers"

    container_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    length = Column(Numeric(5, 2), nullable=False)
    width = Column(Numeric(5, 2), nullable=False)
    height = Column(Numeric(5, 2), nullable=False)
    label = Column(String(50), nullable=True)



