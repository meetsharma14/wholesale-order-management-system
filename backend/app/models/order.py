import uuid

from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    retailer_id = Column(
        String,
        ForeignKey("retailers.id"),
        nullable=False,
    )

    salesman_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    total_amount = Column(Float, default=0)

    retailer = relationship("Retailer")

    salesman = relationship("User")

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )