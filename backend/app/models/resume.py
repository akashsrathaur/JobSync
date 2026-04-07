"""
Resume model for storing uploaded resumes and parsed data.
"""
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class Resume(Base):
    """Resume model for storing uploaded resumes."""
    
    __tablename__ = "resumes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    file_url = Column(String, nullable=False)  # S3 URL or local path
    raw_text = Column(Text)  # Extracted text from PDF
    parsed_data = Column(JSONB)  # Structured data: skills, experience, education
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    skills = relationship("ResumeSkill", back_populates="resume", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Resume {self.id} for User {self.user_id}>"


class ResumeSkill(Base):
    """Skills extracted from resume."""
    
    __tablename__ = "resume_skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=False, index=True)
    skill_name = Column(String, nullable=False)
    skill_category = Column(String)  # e.g., "Programming", "Framework", "Tool"
    proficiency_level = Column(String)  # e.g., "Beginner", "Intermediate", "Expert"
    
    # Relationships
    resume = relationship("Resume", back_populates="skills")
    
    def __repr__(self):
        return f"<ResumeSkill {self.skill_name}>"


class Preference(Base):
    """User job preferences."""
    
    __tablename__ = "preferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    desired_role = Column(String)
    desired_skills = Column(JSONB)  # List of desired skills
    experience_level = Column(String)  # e.g., "Entry", "Mid", "Senior"
    location = Column(String)
    min_salary = Column(String)
    max_salary = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="preferences")
    
    def __repr__(self):
        return f"<Preference for User {self.user_id}>"
