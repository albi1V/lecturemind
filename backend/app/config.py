import os

from dotenv import load_dotenv


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MYSQL_DATABASE_URL = os.getenv("MYSQL_DATABASE_URL")

SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not set. "
        "Please add it to the .env file."
    )


if not MYSQL_DATABASE_URL:
    raise ValueError(
        "MYSQL_DATABASE_URL is not set."
    )

if not SMTP_USERNAME:
    raise ValueError("SMTP_USERNAME is not set.")

if not SMTP_PASSWORD:
    raise ValueError("SMTP_PASSWORD is not set.")



# Add these settings after your existing configuration.

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)

if not JWT_SECRET_KEY:
    raise ValueError(
        "JWT_SECRET_KEY is missing from the .env file."
    )