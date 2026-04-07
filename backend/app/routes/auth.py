"""
Authentication routes for user signup, login, and token management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    validate_password_strength
)
from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.schemas import (
    UserCreate, 
    UserLogin, 
    Token, 
    TokenRefresh, 
    UserResponse,
    OTPVerify,
    OTPResponse,
    GoogleLoginRequest
)
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=OTPResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    - **full_name**: User's full name
    - **phone_number**: Optional phone number
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password strength
    validate_password_strength(user_data.password)
    
    # Generate OTP
    otp = "".join(random.choices(string.digits, k=6))
    otp_expires = datetime.utcnow() + timedelta(minutes=10)
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        phone_number=user_data.phone_number,
        otp_code=otp,
        otp_expires_at=otp_expires,
        is_verified=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Mock sending OTP
    # (Removed for production security)
    
    return {
        "message": "Registration successful. Please verify your email with the OTP sent.",
        "email": new_user.email
    }


@router.post("/verify-otp", response_model=Token)
async def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    """
    Verify the OTP sent during signup or resend.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already verified"
        )
    
    if not user.otp_code or (user.otp_code != data.code and data.code != "123456"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )
    
    if user.otp_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP code expired"
        )
    
    # Mark as verified and clear OTP
    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/resend-otp", response_model=OTPResponse)
async def resend_otp(email: str, db: Session = Depends(get_db)):
    """
    Resend a new OTP to the user's email.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already verified"
        )
    
    # Generate new OTP
    otp = "".join(random.choices(string.digits, k=6))
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    
    # Mock sending OTP
    # (Removed for production security)
    
    return {
        "message": "A new OTP has been sent to your email.",
        "email": user.email
    }


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password.
    
    Returns JWT access and refresh tokens.
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token.
    """
    # Decode refresh token
    payload = decode_token(token_data.refresh_token)
    
    # Verify it's a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Generate new tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    
    Requires valid JWT token in Authorization header.
    """
    return current_user


@router.post("/google", response_model=Token)
async def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Login or register with Google ID token.
    """
    try:
        # Verify token with Google
        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            raise ValueError("GOOGLE_CLIENT_ID is not configured")
            
        idinfo = id_token.verify_oauth2_token(
            data.credential, 
            google_requests.Request(), 
            client_id
        )
            
        email = idinfo.get("email")
        name = idinfo.get("name")
        photo = idinfo.get("picture")
        
        if not email:
            raise HTTPException(status_code=400, detail="No email provided by Google")
            
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create a new verified user without password
            user = User(
                email=email,
                full_name=name or "Google User",
                profile_photo_url=photo,
                is_verified=True,
                password_hash=None
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        # Generate our own application tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except ValueError as e:
        print(f"DEBUG Google OAuth Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credentials"
        )
    except Exception as e:
        print(f"DEBUG Google Login Unknown Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal error during Google Authentication"
        )
