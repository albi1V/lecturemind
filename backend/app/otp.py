import secrets
from datetime import datetime, timedelta

from pwdlib import PasswordHash
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import OTPVerification


otp_password_hash = PasswordHash.recommended()


OTP_EXPIRY_MINUTES = 5
MAX_OTP_ATTEMPTS = 5


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def create_otp(
    db: Session,
    identifier: str,
    identifier_type: str
) -> str:

    otp = generate_otp()

    otp_hash = otp_password_hash.hash(otp)

    # Invalidate previous OTPs
    previous_otps = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.identifier == identifier,
            OTPVerification.is_verified == False
        )
        .all()
    )

    for previous in previous_otps:
        previous.is_verified = True

    expires_at = (
        datetime.utcnow()
        + timedelta(minutes=OTP_EXPIRY_MINUTES)
    )

    otp_record = OTPVerification(
        identifier=identifier,
        identifier_type=identifier_type,
        otp_hash=otp_hash,
        expires_at=expires_at,
        attempts=0,
        is_verified=False
    )

    db.add(otp_record)
    db.commit()
    db.refresh(otp_record)

    return otp


def verify_otp(
    db: Session,
    identifier: str,
    otp: str
) -> bool:

    otp_record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.identifier == identifier,
            OTPVerification.is_verified == False
        )
        .order_by(
            desc(OTPVerification.created_at)
        )
        .first()
    )

    if not otp_record:
        return False

    if datetime.utcnow() > otp_record.expires_at:
        return False

    if otp_record.attempts >= MAX_OTP_ATTEMPTS:
        return False

    otp_record.attempts += 1

    is_correct = otp_password_hash.verify(
        otp,
        otp_record.otp_hash
    )

    if not is_correct:
        db.commit()
        return False

    otp_record.is_verified = True

    db.commit()

    return True