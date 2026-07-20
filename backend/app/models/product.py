import uuid

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import relationship

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    name = Column(String(150), nullable=False)
    sku = Column(String(50), unique=True, nullable=False)
    barcode = Column(String(100), unique=True, nullable=True)

    # Relationships
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=False)

    brand = Column(String(100), nullable=False)

    purchase_price = Column(Float, default=0)
    selling_price = Column(Float, default=0)

    gst = Column(Integer, default=18)

    stock = Column(Integer, default=0)
    minimum_stock = Column(Integer, default=0)

    unit = Column(String(20), nullable=False)

    description = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)

    # ORM Relationships
    category = relationship("Category")
    supplier = relationship("Supplier")

    order_items = relationship(
        "OrderItem",
        back_populates="product"
    )