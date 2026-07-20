import uuid

from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Salesman(Base):
    __tablename__ = "salesmen"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    address = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())