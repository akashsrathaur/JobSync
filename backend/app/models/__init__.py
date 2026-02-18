"""
Models package initialization.
Import all models here for easy access.
"""
from app.models.user import User
from app.models.resume import Resume, ResumeSkill, Preference
from app.models.job import Job, JobSkill
from app.models.match import Match
from app.models.application import Application, SavedJob

__all__ = [
    "User",
    "Resume",
    "ResumeSkill",
    "Preference",
    "Job",
    "JobSkill",
    "Match",
    "Application",
    "SavedJob",
]
