import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    order_id = Column(
        String,
        ForeignKey("orders.id"),
        nullable=False,
    )

    product_id = Column(
        String,
        ForeignKey("products.id"),
        nullable=False,
    )

    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship(
        "Order",
        back_populates="items",
    )

    product = relationship(
    "Product",
    back_populates="order_items",
    )