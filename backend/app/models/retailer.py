import uuid

from sqlalchemy import Column, String, Float, Boolean
from app.database import Base


class Retailer(Base):
    __tablename__ = "retailers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    shop_name = Column(String(150), nullable=False)
    owner_name = Column(String(150), nullable=False)

    phone = Column(String(20), unique=True, nullable=False)
    email = Column(String(100), unique=True)

    gst_number = Column(String(50))

    address = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(10))

    credit_limit = Column(Float, default=0)
    outstanding_balance = Column(Float, default=0)

    is_active = Column(Boolean, default=True)