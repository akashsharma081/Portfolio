import re
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class SubmissionBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of client")
    email: EmailStr = Field(..., description="Email address")
    phone: str = Field(..., description="WhatsApp / Phone number")
    description: str = Field(..., min_length=10, max_length=1000, description="Message body description")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be empty or whitespace only")
        return stripped

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        stripped = v.strip()
        # Matches optional +, followed by 10 to 20 chars of numbers, spaces, hyphens, and brackets
        pattern = r"^\+?[\d\s\-()]{10,20}$"
        if not re.match(pattern, stripped):
            raise ValueError("Phone number must contain between 10 to 20 valid characters (digits, spaces, -, +, and parentheses)")
        
        # Ensure that there are at least 10 actual digits
        digit_count = sum(1 for char in stripped if char.isdigit())
        if digit_count < 10:
            raise ValueError("Phone number must contain at least 10 digits")
        return stripped

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Description cannot be empty or whitespace only")
        # Ensure it contains actual text/letters rather than just symbols or random numbers
        if not any(char.isalpha() for char in stripped):
            raise ValueError("Description must contain descriptive letters/words")
        return stripped

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    status: Optional[str] = Field(None, description="Enquiry status: new, urgent, read")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be empty")
        return stripped

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        pattern = r"^\+?[\d\s\-()]{10,20}$"
        if not re.match(pattern, stripped):
            raise ValueError("Phone number must contain between 10 to 20 valid characters (digits, spaces, -, +, and parentheses)")
        digit_count = sum(1 for char in stripped if char.isdigit())
        if digit_count < 10:
            raise ValueError("Phone number must contain at least 10 digits")
        return stripped

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        if not stripped:
            raise ValueError("Description cannot be empty")
        if not any(char.isalpha() for char in stripped):
            raise ValueError("Description must contain descriptive letters/words")
        return stripped

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip().lower()
        allowed = {"new", "urgent", "read"}
        if stripped not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return stripped

class SubmissionResponse(BaseModel):
    id: int
    name: str
    email: str
    whatsapp: str  # Maps DB phone to frontend expectations
    description: str
    status: str
    date: str  # Format YYYY-MM-DD
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }

    @model_validator(mode='before')
    @classmethod
    def map_db_fields(cls, data: Any) -> Any:
        # Dynamically transform DB models into schema structure
        if hasattr(data, 'phone'):
            data_dict = {
                "id": data.id,
                "name": data.name,
                "email": data.email,
                "whatsapp": data.phone,
                "description": data.description,
                "status": data.status,
                "date": data.created_at.strftime("%Y-%m-%d") if data.created_at else datetime.utcnow().strftime("%Y-%m-%d"),
                "created_at": data.created_at,
                "updated_at": data.updated_at
            }
            return data_dict
        return data
