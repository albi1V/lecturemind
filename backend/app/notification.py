import smtplib
from email.message import EmailMessage

from app.config import SMTP_USERNAME, SMTP_PASSWORD


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


def send_email_otp(email: str, otp: str):
    message = EmailMessage()

    message["From"] = SMTP_USERNAME
    message["To"] = email
    message["Subject"] = "Your LectureMind verification code"

    message.set_content(
        f"""
Hello,

Your LectureMind verification code is:

{otp}

This OTP is valid for 5 minutes.

If you did not request this code, you can safely ignore this email.

Regards,
LectureMind
"""
    )

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(message)


def send_sms_otp(phone: str, otp: str):
    # SMS integration will be added later.
    print(f"SMS OTP for {phone}: {otp}")