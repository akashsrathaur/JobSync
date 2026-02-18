"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# ============= Auth Schemas =============

class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str


class UserResponse(BaseModel):
    """Schema for user data response."""
    id: UUID
    email: str
    full_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Resume Schemas =============

class ResumeUpload(BaseModel):
    """Schema for resume upload response."""
    id: UUID
    file_url: str
    uploaded_at: datetime


class ParsedResumeData(BaseModel):
    """Schema for parsed resume data."""
    skills: List[str]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    summary: Optional[str] = None


class ResumeResponse(BaseModel):
    """Schema for resume response."""
    id: UUID
    user_id: UUID
    file_url: str
    parsed_data: Optional[Dict[str, Any]]
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


# ============= Preference Schemas =============

class PreferenceCreate(BaseModel):
    """Schema for creating job preferences."""
    desired_role: Optional[str] = None
    desired_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None


class PreferenceResponse(BaseModel):
    """Schema for preference response."""
    id: UUID
    user_id: UUID
    desired_role: Optional[str]
    desired_skills: Optional[List[str]]
    experience_level: Optional[str]
    location: Optional[str]
    min_salary: Optional[int]
    max_salary: Optional[int]
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Job Schemas =============

class JobResponse(BaseModel):
    """Schema for job listing response."""
    id: UUID
    title: str
    company: str
    description: str
    location: Optional[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    experience_required: Optional[str]
    required_skills: Optional[List[str]]
    source: Optional[str]
    external_url: Optional[str]
    posted_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class JobWithMatch(JobResponse):
    """Schema for job with match score."""
    match_score: float
    score_breakdown: Optional[Dict[str, float]]


# ============= Match Schemas =============

class MatchResponse(BaseModel):
    """Schema for match response."""
    id: UUID
    user_id: UUID
    job_id: UUID
    match_score: float
    score_breakdown: Optional[Dict[str, float]]
    calculated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Application Schemas =============

class ApplicationCreate(BaseModel):
    """Schema for creating an application."""
    job_id: UUID


class ApplicationUpdate(BaseModel):
    """Schema for updating application status."""
    status: str = Field(..., pattern="^(applied|interviewing|rejected|accepted)$")


class ApplicationResponse(BaseModel):
    """Schema for application response."""
    id: UUID
    user_id: UUID
    job_id: UUID
    status: str
    applied_at: datetime
    updated_at: datetime
    job: Optional[JobResponse] = None
    
    class Config:
        from_attributes = True


# ============= Saved Job Schemas =============

class SavedJobCreate(BaseModel):
    """Schema for saving a job."""
    job_id: UUID


class SavedJobResponse(BaseModel):
    """Schema for saved job response."""
    id: UUID
    user_id: UUID
    job_id: UUID
    saved_at: datetime
    job: Optional[JobResponse] = None
    
    class Config:
        from_attributes = True


# ============= Pagination Schemas =============

class PaginationParams(BaseModel):
    """Schema for pagination parameters."""
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    """Schema for paginated response."""
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int
