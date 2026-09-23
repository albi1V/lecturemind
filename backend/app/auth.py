import re

from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.models import User
from app.otp import create_otp, verify_otp


# =========================================================
# PASSWORD HASHING
# =========================================================

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Convert a plain-text password into a secure password hash.
    """
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str
) -> bool:
    """
    Check whether a plain-text password matches
    the stored password hash.
    """
    return password_hash.verify(
        password,
        hashed_password
    )


# =========================================================
# PASSWORD VALIDATION
# =========================================================

def validate_password(password: str):
    """
    Check whether the password satisfies
    our password requirements.

    Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    """

    if len(password) < 8:
        raise ValueError(
            "Password must contain at least 8 characters."
        )

    if not any(char.isupper() for char in password):
        raise ValueError(
            "Password must contain at least one uppercase letter."
        )

    if not any(char.islower() for char in password):
        raise ValueError(
            "Password must contain at least one lowercase letter."
        )

    if not any(char.isdigit() for char in password):
        raise ValueError(
            "Password must contain at least one number."
        )


# =========================================================
# IDENTIFIER VALIDATION
# =========================================================

def detect_identifier_type(identifier: str) -> str:
    """
    Detect whether the identifier is an email
    address or an Indian mobile number.
    """

    identifier = identifier.strip()

    # Email pattern
    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if re.match(email_pattern, identifier):
        return "email"

    # Indian phone number
    # Starts with 6, 7, 8 or 9
    # Followed by 9 digits
    phone_pattern = r"^[6-9]\d{9}$"

    if re.match(phone_pattern, identifier):
        return "phone"

    raise ValueError(
        "Please enter a valid email address "
        "or Indian mobile number."
    )


# =========================================================
# REQUEST REGISTRATION OTP
# =========================================================

def request_registration_otp(
    db: Session,
    identifier: str
):
    """
    Start the registration process.

    Steps:
    1. Clean identifier
    2. Detect email or phone
    3. Check whether account already exists
    4. Generate OTP
    """

    identifier = identifier.strip().lower()

    identifier_type = detect_identifier_type(
        identifier
    )

    # Check whether user already exists
    existing_user = (
        db.query(User)
        .filter(
            User.identifier == identifier
        )
        .first()
    )

    if existing_user:
        raise ValueError(
            "An account already exists with "
            "this email or phone number."
        )

    # Create OTP
    otp = create_otp(
        db=db,
        identifier=identifier,
        identifier_type=identifier_type
    )

    return identifier_type, otp


# =========================================================
# COMPLETE REGISTRATION
# =========================================================

def complete_registration(
    db: Session,
    identifier: str,
    otp: str,
    password: str
):
    """
    Complete the registration process.

    Steps:
    1. Clean identifier
    2. Detect email or phone
    3. Check existing account
    4. Verify OTP
    5. Validate password
    6. Hash password
    7. Create user
    8. Save user in database
    """

    identifier = identifier.strip().lower()

    # Detect email or phone
    identifier_type = detect_identifier_type(
        identifier
    )

    # Check whether account already exists
    existing_user = (
        db.query(User)
        .filter(
            User.identifier == identifier
        )
        .first()
    )

    if existing_user:
        raise ValueError(
            "An account already exists with "
            "this email or phone number."
        )

    # Verify OTP
    verified = verify_otp(
        db=db,
        identifier=identifier,
        otp=otp
    )

    if not verified:
        raise ValueError(
            "Invalid or expired OTP."
        )

    # Validate password
    validate_password(password)

    # Hash password
    hashed_password = hash_password(
        password
    )

    # Create user
    user = User(
        identifier=identifier,
        identifier_type=identifier_type,
        password_hash=hashed_password,
        is_verified=True
    )

    # Save user
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# =========================================================
# LOGIN
# =========================================================

def login_user(
    db: Session,
    identifier: str,
    password: str
):
    """
    Authenticate an existing user.

    Steps:
    1. Clean identifier
    2. Detect email or phone
    3. Find user
    4. Verify password
    5. Check account verification
    6. Return user
    """

    identifier = identifier.strip().lower()

    # Detect email or phone
    detect_identifier_type(identifier)

    # Find user
    user = (
        db.query(User)
        .filter(
            User.identifier == identifier
        )
        .first()
    )

    # User not found
    if not user:
        raise ValueError(
            "Invalid email/phone number or password."
        )

    # Verify password
    if not verify_password(
        password,
        user.password_hash
    ):
        raise ValueError(
            "Invalid email/phone number or password."
        )

    # Check whether account is verified
    if not user.is_verified:
        raise ValueError(
            "Please verify your account before logging in."
        )

    return user