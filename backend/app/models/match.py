"""
Match model for storing AI-generated job match scores.
"""
import uuid
from sqlalchemy import Column, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class Match(Base):
    """Job match score model."""
    
    __tablename__ = "matches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False, index=True)
    match_score = Column(Float, nullable=False)  # 0-100
    score_breakdown = Column(JSONB)  # Detailed breakdown of score components
    calculated_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="matches")
    job = relationship("Job", back_populates="matches")
    
    def __repr__(self):
        return f"<Match {self.match_score:.1f}% for User {self.user_id} and Job {self.job_id}>"
