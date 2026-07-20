from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.user import User

from app.routers.auth import router as auth_router
from app.routers.category import router as category_router
from app.routers.product import router as product_router
from app.routers.supplier import router as supplier_router
from app.routers.retailer import router as retailer_router
from app.routers.order import router as order_router
from app.routers.salesman import router as salesman_router
from app.routers.payment import router as payment_router
from app.routers.dashboard import router as dashboard_router
from app.database import SessionLocal
from app.services.auth_service import ensure_default_admin

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    ensure_default_admin(db)

app = FastAPI(
    title="Wholesale Order Management API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(supplier_router)
app.include_router(retailer_router)
app.include_router(order_router)
app.include_router(salesman_router)
app.include_router(payment_router)
app.include_router(dashboard_router)

@app.get("/")
def home():
    return {
        "message": "Wholesale Order Management API Running"
    }
