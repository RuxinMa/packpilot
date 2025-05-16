# from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, ForeignKey, Enum
# from backend.app.db.database import Base


# # ----- Item -----
# class Item(Base):
#     __tablename__ = "items"

#     item_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     item_name = Column(String(20), unique=True, index=True, nullable=False)
#     length = Column(Numeric(5, 2), nullable=False)
#     width = Column(Numeric(5, 2), nullable=False)
#     height = Column(Numeric(5, 2), nullable=False)
#     orientation = Column(String(20), default="Face Up")
#     remarks = Column(Text, nullable=True)
#     is_fragile = Column(Boolean, default=False)
#     is_assigned = Column(Boolean, default=False)


