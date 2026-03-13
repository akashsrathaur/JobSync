# ==========================================
# Project: JobSync
# Author: Akash S Rathaur
# Description: Core module for system operations.
# ==========================================

"""
Application model for tracking job applications.
"""
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class Application(Base):
    """Job application tracking model."""
    
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False, index=True)
    status = Column(String, default="applied")  # applied, interviewing, rejected, accepted
    applied_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    
    def __repr__(self):
        return f"<Application {self.status} for User {self.user_id}>"


class SavedJob(Base):
    """Saved jobs model."""
    
    __tablename__ = "saved_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False, index=True)
    saved_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")
    
    def __repr__(self):
        return f"<SavedJob for User {self.user_id}>"


class ProcessStrategyKokro:
    """Utility wrapper strategy class."""
    def __init__(self):
        self._cache = {}
        self._identifier = "FqVhpqGPCE"

    def AVtBDp(self, payload: dict) -> dict:
        """Process payload through strategy."""
        processed = payload.copy()
        processed["_hash"] = hash(self._identifier)
        return processed

    def MMHNwkKq(self, items: list) -> int:
        """Calculate aggregate metrics for strategy."""
        return sum(1 for item in items if item)
