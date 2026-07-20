from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate


def create_product(db: Session, product: ProductCreate):
    new_product = Product(**product.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


def get_products(db: Session):
    return db.query(Product).all()


def get_product(db: Session, product_id: str):
    return db.query(Product).filter(Product.id == product_id).first()


def update_product(db: Session, product_id: str, product_data):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return None

    for key, value in product_data.model_dump().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


def delete_product(db: Session, product_id: str):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return None

    product.is_active = False   # Soft Delete

    db.commit()

    return product