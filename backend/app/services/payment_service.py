from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_user_role
from app.models.payment import Payment
from app.models.retailer import Retailer
from app.schemas.payment import PaymentCreate


def create_payment(db: Session, payment: PaymentCreate):
    retailer = (
        db.query(Retailer)
        .filter(Retailer.id == payment.retailer_id)
        .first()
    )

    if not retailer:
        raise HTTPException(status_code=404, detail="Retailer not found")

    if payment.amount > float(retailer.outstanding_balance or 0):
        raise HTTPException(
            status_code=400,
            detail="Payment amount cannot exceed retailer outstanding balance",
        )

    new_payment = Payment(**payment.model_dump())
    retailer.outstanding_balance = (
        float(retailer.outstanding_balance or 0) - payment.amount
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment


def get_payments(db: Session, current_user=None):
    if current_user and get_user_role(current_user) == "RETAILER":
        retailer = (
            db.query(Retailer)
            .filter(Retailer.email == current_user.email)
            .first()
        )

        if not retailer:
            return []

        return (
            db.query(Payment)
            .filter(Payment.retailer_id == retailer.id)
            .all()
        )

    return db.query(Payment).all()


def get_payment(db: Session, payment_id: str):
    return db.query(Payment).filter(
        Payment.id == payment_id
    ).first()


def update_payment(
    db: Session,
    payment_id: str,
    payment: PaymentCreate,
):
    db_payment = get_payment(db, payment_id)

    if not db_payment:
        return None

    old_retailer = (
        db.query(Retailer)
        .filter(Retailer.id == db_payment.retailer_id)
        .first()
    )

    new_retailer = (
        db.query(Retailer)
        .filter(Retailer.id == payment.retailer_id)
        .first()
    )

    if not new_retailer:
        raise HTTPException(status_code=404, detail="Retailer not found")

    if old_retailer:
        old_retailer.outstanding_balance = (
            float(old_retailer.outstanding_balance or 0) +
            float(db_payment.amount or 0)
        )

    if payment.amount > float(new_retailer.outstanding_balance or 0):
        raise HTTPException(
            status_code=400,
            detail="Payment amount cannot exceed retailer outstanding balance",
        )

    new_retailer.outstanding_balance = (
        float(new_retailer.outstanding_balance or 0) - payment.amount
    )

    for key, value in payment.model_dump().items():
        setattr(db_payment, key, value)

    db.commit()
    db.refresh(db_payment)

    return db_payment


def delete_payment(db: Session, payment_id: str):
    payment = get_payment(db, payment_id)

    if not payment:
        return None

    retailer = (
        db.query(Retailer)
        .filter(Retailer.id == payment.retailer_id)
        .first()
    )

    if retailer:
        retailer.outstanding_balance = (
            float(retailer.outstanding_balance or 0) +
            float(payment.amount or 0)
        )

    db.delete(payment)
    db.commit()

    return True
