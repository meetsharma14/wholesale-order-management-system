from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate


def create_category(db: Session, category: CategoryCreate):
    existing = db.query(Category).filter(Category.name == category.name).first()

    if existing:
        raise ValueError("Category already exists")

    new_category = Category(
        name=category.name,
        description=category.description
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


def get_categories(db: Session):
    return db.query(Category).all()


def get_category(db: Session, category_id: str):
    return db.query(Category).filter(Category.id == category_id).first()


def delete_category(db: Session, category_id: str):
    category = get_category(db, category_id)

    if not category:
        return None

    db.delete(category)
    db.commit()

    return category