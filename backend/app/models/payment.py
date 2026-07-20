import uuid

from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    retailer_id = Column(String, ForeignKey("retailers.id"))
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())