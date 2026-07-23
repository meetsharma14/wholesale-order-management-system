from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User, UserRole
from app.schemas.salesman import SalesmanCreate
from app.core.security import hash_password


def create_salesman(
    db: Session,
    salesman: SalesmanCreate,
):
    # Check email already exists
    existing_email = (
        db.query(User)
        .filter(User.email == salesman.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    # Check phone already exists
    existing_phone = (
        db.query(User)
        .filter(User.phone == salesman.phone)
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered",
        )

    new_salesman = User(
        name=salesman.name,
        email=salesman.email,
        phone=salesman.phone,
        password=hash_password(salesman.password),
        role=UserRole.SALESMAN,
        is_active=True,
    )

    db.add(new_salesman)
    db.commit()
    db.refresh(new_salesman)

    return new_salesman


def get_salesmen(db: Session):
    return (
        db.query(User)
        .filter(User.role == UserRole.SALESMAN)
        .all()
    )


def get_salesman(
    db: Session,
    salesman_id: str,
):
    return (
        db.query(User)
        .filter(
            User.id == salesman_id,
            User.role == UserRole.SALESMAN,
        )
        .first()
    )


def update_salesman(
    db: Session,
    salesman_id: str,
    salesman: SalesmanCreate,
):
    db_salesman = get_salesman(db, salesman_id)

    if not db_salesman:
        return None

    db_salesman.name = salesman.name
    db_salesman.email = salesman.email
    db_salesman.phone = salesman.phone

    # Update password only if provided
    if salesman.password:
        db_salesman.password = hash_password(
            salesman.password
        )

    db.commit()
    db.refresh(db_salesman)

    return db_salesman


def delete_salesman(
    db: Session,
    salesman_id: str,
):
    salesman = get_salesman(db, salesman_id)

    if not salesman:
        return None

    db.delete(salesman)
    db.commit()

    return True