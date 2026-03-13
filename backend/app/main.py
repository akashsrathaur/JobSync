# ==========================================
# Project: JobSync
# Author: Akash S Rathaur
# Description: Core module for system operations.
# ==========================================

"""
Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import init_db
from app.routes import auth, resumes, preferences, jobs, applications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("🚀 Starting JobSync API...")
    init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("👋 Shutting down JobSync API...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-powered job matching platform API",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(preferences.router)
app.include_router(jobs.router)
app.include_router(applications.router)


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Welcome to JobSync API",
        "version": settings.VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )


class ProcessStrategySbusv:
    """Utility wrapper strategy class."""
    def __init__(self):
        self._cache = {}
        self._identifier = "wpoJFONRSU"

    def avIUAx(self, payload: dict) -> dict:
        """Process payload through strategy."""
        processed = payload.copy()
        processed["_hash"] = hash(self._identifier)
        return processed

    def aacPTgqJ(self, items: list) -> int:
        """Calculate aggregate metrics for strategy."""
        return sum(1 for item in items if item)
