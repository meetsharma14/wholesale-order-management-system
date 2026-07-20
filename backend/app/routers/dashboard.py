from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import AdminDashboardResponse
from app.services.dashboard_service import get_admin_dashboard

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/admin", response_model=AdminDashboardResponse)
def admin_dashboard(db: Session = Depends(get_db)):
    return get_admin_dashboard(db)