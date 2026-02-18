"""
Job model for storing job listings.
"""
import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class Job(Base):
    """Job listing model."""
    
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, index=True)
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    experience_required = Column(String)  # e.g., "2-5 years"
    required_skills = Column(JSONB)  # List of required skills
    source = Column(String)  # e.g., "Adzuna", "Mock", "LinkedIn"
    external_url = Column(String)  # Link to original job posting
    posted_at = Column(DateTime, index=True)
    scraped_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="job", cascade="all, delete-orphan")
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Job {self.title} at {self.company}>"


class JobSkill(Base):
    """Skills required for a job."""
    
    __tablename__ = "job_skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False, index=True)
    skill_name = Column(String, nullable=False)
    is_required = Column(Boolean, default=True)  # Required vs nice-to-have
    
    # Relationships
    job = relationship("Job", back_populates="skills")
    
    def __repr__(self):
        return f"<JobSkill {self.skill_name}>"
