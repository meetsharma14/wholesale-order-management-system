from sqlalchemy.orm import Session

from app.dependencies.auth import get_user_role
from app.models.retailer import Retailer
from app.schemas.retailer import RetailerCreate


def create_retailer(db: Session, retailer: RetailerCreate):
    new_retailer = Retailer(**retailer.model_dump())

    db.add(new_retailer)
    db.commit()
    db.refresh(new_retailer)

    return new_retailer


def get_retailers(db: Session, current_user=None):
    if current_user and get_user_role(current_user) == "RETAILER":
        return (
            db.query(Retailer)
            .filter(Retailer.email == current_user.email)
            .all()
        )

    return db.query(Retailer).all()


def get_retailer(db: Session, retailer_id: str):
    return db.query(Retailer).filter(
        Retailer.id == retailer_id
    ).first()


def update_retailer(
    db: Session,
    retailer_id: str,
    retailer: RetailerCreate,
):
    db_retailer = get_retailer(db, retailer_id)

    if not db_retailer:
        return None

    for key, value in retailer.model_dump().items():
        setattr(db_retailer, key, value)

    db.commit()
    db.refresh(db_retailer)

    return db_retailer


def delete_retailer(db: Session, retailer_id: str):
    retailer = get_retailer(db, retailer_id)

    if not retailer:
        return None

    db.delete(retailer)
    db.commit()

    return True
