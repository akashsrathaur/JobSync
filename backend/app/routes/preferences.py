"""
Job preference routes for managing user job preferences.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.resume import Preference
from app.schemas import PreferenceCreate, PreferenceResponse


router = APIRouter(prefix="/api/preferences", tags=["Preferences"])


@router.post("", response_model=PreferenceResponse, status_code=status.HTTP_201_CREATED)
async def create_preferences(
    pref_data: PreferenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Set job preferences for the current user.
    
    If preferences already exist, they will be updated.
    """
    # Check if preferences already exist
    existing_pref = db.query(Preference).filter(
        Preference.user_id == current_user.id
    ).first()
    
    if existing_pref:
        # Update existing preferences
        for key, value in pref_data.model_dump(exclude_unset=True).items():
            setattr(existing_pref, key, value)
        db.commit()
        db.refresh(existing_pref)
        return existing_pref
    
    # Create new preferences
    preference = Preference(
        user_id=current_user.id,
        **pref_data.model_dump()
    )
    
    db.add(preference)
    db.commit()
    db.refresh(preference)
    
    return preference


@router.get("", response_model=PreferenceResponse)
async def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's job preferences.
    """
    preference = db.query(Preference).filter(
        Preference.user_id == current_user.id
    ).first()
    
    if not preference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found. Please set your preferences first."
        )
    
    return preference


@router.put("", response_model=PreferenceResponse)
async def update_preferences(
    pref_data: PreferenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update job preferences.
    """
    preference = db.query(Preference).filter(
        Preference.user_id == current_user.id
    ).first()
    
    if not preference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found. Please create preferences first."
        )
    
    # Update fields
    for key, value in pref_data.model_dump(exclude_unset=True).items():
        setattr(preference, key, value)
    
    db.commit()
    db.refresh(preference)
    
    return preference
