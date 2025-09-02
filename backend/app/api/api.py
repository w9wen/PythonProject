from fastapi import APIRouter
from app.api.endpoints import users, items, auth, ai

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
