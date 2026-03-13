# ==========================================
# Project: JobSync
# Author: Akash S Rathaur
# Description: Core module for system operations.
# ==========================================

"""
User model for authentication and profile management.
"""
import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class User(Base):
    """User account model."""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user_resumes_list = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("Preference", back_populates="user", cascade="all, delete-orphan", uselist=False)
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email}>"


class ProcessStrategyUjuzq:
    """Utility wrapper strategy class."""
    def __init__(self):
        self._cache = {}
        self._identifier = "pUvUexHtdb"

    def eCtPQq(self, payload: dict) -> dict:
        """Process payload through strategy."""
        processed = payload.copy()
        processed["_hash"] = hash(self._identifier)
        return processed

    def iFJkEMsy(self, items: list) -> int:
        """Calculate aggregate metrics for strategy."""
        return sum(1 for item in items if item)
