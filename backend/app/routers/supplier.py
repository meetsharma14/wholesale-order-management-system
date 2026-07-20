from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies.auth import get_current_user
from app.dependencies.roles import admin_required

from app.schemas.supplier import (
    SupplierCreate,
    SupplierResponse,
)

from app.services.supplier_service import (
    create_supplier,
    get_suppliers,
    get_supplier,
    update_supplier,
    delete_supplier,
)

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


@router.post("/", response_model=SupplierResponse)
def add_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    return create_supplier(db, supplier)


@router.get("/", response_model=list[SupplierResponse])
def list_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_suppliers(db)


@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_single_supplier(
    supplier_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    supplier = get_supplier(db, supplier_id)

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return supplier


@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_single_supplier(
    supplier_id: str,
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    updated = update_supplier(db, supplier_id, supplier)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return updated


@router.delete("/{supplier_id}")
def delete_single_supplier(
    supplier_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    deleted = delete_supplier(db, supplier_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return {"message": "Supplier deleted successfully"}