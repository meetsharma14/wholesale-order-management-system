from sqlalchemy.orm import Session

from app.models.salesman import Salesman
from app.schemas.salesman import SalesmanCreate


def create_salesman(db: Session, salesman: SalesmanCreate):
    new_salesman = Salesman(**salesman.model_dump())

    db.add(new_salesman)
    db.commit()
    db.refresh(new_salesman)

    return new_salesman


def get_salesmen(db: Session):
    return db.query(Salesman).all()


def get_salesman(db: Session, salesman_id: str):
    return db.query(Salesman).filter(
        Salesman.id == salesman_id
    ).first()


def update_salesman(
    db: Session,
    salesman_id: str,
    salesman: SalesmanCreate,
):
    db_salesman = get_salesman(db, salesman_id)

    if not db_salesman:
        return None

    for key, value in salesman.model_dump().items():
        setattr(db_salesman, key, value)

    db.commit()
    db.refresh(db_salesman)

    return db_salesman


def delete_salesman(db: Session, salesman_id: str):
    salesman = get_salesman(db, salesman_id)

    if not salesman:
        return None

    db.delete(salesman)
    db.commit()

    return True