from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user, require_roles
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


# ADMIN creates salesman account
@router.post(
    "/",
    response_model=SalesmanResponse,
)
def add_salesman(
    salesman: SalesmanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    return create_salesman(
        db,
        salesman,
    )


# ADMIN / SALESMAN can see salesman list
@router.get(
    "/",
    response_model=list[SalesmanResponse],
)
def list_salesmen(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("ADMIN", "SALESMAN")
    ),
):
    return get_salesmen(db)


# Get one salesman
@router.get(
    "/{salesman_id}",
    response_model=SalesmanResponse,
)
def get_single_salesman(
    salesman_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    salesman = get_salesman(
        db,
        salesman_id,
    )

    if not salesman:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found",
        )

    return salesman


# ADMIN or the salesman himself can update
@router.put(
    "/{salesman_id}",
    response_model=SalesmanResponse,
)
def update_single_salesman(
    salesman_id: str,
    salesman: SalesmanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user_role = str(
        current_user.role
    ).upper()

    # Admin can update any salesman
    if current_user_role == "ADMIN":
        return update_salesman(
            db,
            salesman_id,
            salesman,
        )

    # Salesman can update only his own account
    if (
        current_user_role == "SALESMAN"
        and current_user.id == salesman_id
    ):
        return update_salesman(
            db,
            salesman_id,
            salesman,
        )

    raise HTTPException(
        status_code=403,
        detail="You can only update your own salesman profile",
    )


# Only ADMIN can delete salesman
@router.delete(
    "/{salesman_id}"
)
def delete_single_salesman(
    salesman_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    deleted = delete_salesman(
        db,
        salesman_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found",
        )

    return {
        "message": "Salesman deleted successfully"
    }