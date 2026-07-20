from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.models.user import User


def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


def salesman_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "SALESMAN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Salesman access required"
        )

    return current_user


def retailer_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "RETAILER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Retailer access required"
        )

    return current_user