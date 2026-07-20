from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.roles import admin_required

from app.schemas.salesman import (
    SalesmanCreate,
    SalesmanResponse,
)

from app.services.salesman_service import (
    create_salesman,
    get_salesmen,
    get_salesman,
    update_salesman,
    delete_salesman,
)

router = APIRouter(
    prefix="/salesmen",
    tags=["Salesmen"],
)


@router.post("/", response_model=SalesmanResponse)
def add_salesman(
    salesman: SalesmanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    return create_salesman(db, salesman)


@router.get("/", response_model=list[SalesmanResponse])
def list_salesmen(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_salesmen(db)


@router.get("/{salesman_id}", response_model=SalesmanResponse)
def get_single_salesman(
    salesman_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    salesman = get_salesman(db, salesman_id)

    if not salesman:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found",
        )

    return salesman


@router.put("/{salesman_id}", response_model=SalesmanResponse)
def update_single_salesman(
    salesman_id: str,
    salesman: SalesmanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    updated = update_salesman(db, salesman_id, salesman)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found",
        )

    return updated


@router.delete("/{salesman_id}")
def delete_single_salesman(
    salesman_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    deleted = delete_salesman(db, salesman_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found",
        )

    return {"message": "Salesman deleted successfully"}