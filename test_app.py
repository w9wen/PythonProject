from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

app = FastAPI(
    title="Test API",
    description="A simple test API",
    version="0.1.0",
    docs_url="/docs",  # Swagger UI path
    redoc_url="/redoc",  # ReDoc path
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Mock items endpoint for testing frontend connectivity
@app.get("/api/v1/items/")
async def get_items(skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Get a list of mock items.
    This endpoint is for testing frontend connectivity.
    """
    items = [
        {
            "id": 1,
            "title": "Test Item 1",
            "description": "This is a test item from the Python backend"
        },
        {
            "id": 2,
            "title": "Test Item 2",
            "description": "Another test item from the Python backend"
        },
        {
            "id": 3,
            "title": "Test Item 3",
            "description": "Yet another test item from the Python backend"
        }
    ]
    return items[skip:skip+limit]
