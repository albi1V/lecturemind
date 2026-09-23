from fastapi import Depends, FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from app.ai import improve_note

from app.auth import (
    complete_registration,
    login_user,
    request_registration_otp,
)

from app.database import Base, engine, get_db

from app.models import User, OTPVerification

from app.notification import (
    send_email_otp,
    send_sms_otp,
)

from app.schemas import (
    LoginRequest,
    LoginResponse,
    NoteRequest,
    NoteResponse,
    OTPRequest,
    OTPVerifyRequest,
    RegisterRequest,
    RegisterResponse,
)


# Create database tables
Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="LectureMind API",
    description="AI-powered lecture note assistant",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "LectureMind API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# -----------------------------------------
# REGISTRATION
# -----------------------------------------

@app.post("/api/auth/send-otp")
def send_registration_otp(
    request: OTPRequest,
    db: Session = Depends(get_db)
):

    try:

        identifier_type, otp = (
            request_registration_otp(
                db=db,
                identifier=request.identifier
            )
        )

        identifier = (
            request.identifier
            .strip()
            .lower()
        )

        if identifier_type == "email":

            send_email_otp(
                email=identifier,
                otp=otp
            )

        else:

            send_sms_otp(
                phone=identifier,
                otp=otp
            )

        return {
            "message": (
                "OTP sent successfully."
            ),
            "identifier_type": identifier_type
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to send OTP: "
                f"{str(error)}"
            )
        )


@app.post(
    "/api/auth/register",
    response_model=RegisterResponse
)
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        user = complete_registration(
            db=db,
            identifier=request.identifier,
            otp=request.otp,
            password=request.password
        )

        return RegisterResponse(
            message=(
                "Registration successful."
            ),
            user_id=user.id
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Registration failed: "
                f"{str(error)}"
            )
        )
# -----------------------------------------
# LOGIN
# -----------------------------------------

@app.post(
    "/api/auth/login",
    response_model=LoginResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

        user = login_user(
            db=db,
            identifier=request.identifier,
            password=request.password
        )

        return LoginResponse(
            message="Login successful.",
            user_id=user.id,
            identifier=user.identifier
        )

    except ValueError as error:

        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Login failed: "
                f"{str(error)}"
            )
        )

# -----------------------------------------
# AI NOTE IMPROVEMENT
# -----------------------------------------

@app.post(
    "/api/improve-note",
    response_model=NoteResponse
)
def improve_lecture_note(
    request: NoteRequest
):

    try:

        improved_note = improve_note(
            subject=request.subject,
            topic=request.topic,
            note=request.note,
        )

        return NoteResponse(
            improved_note=improved_note
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to improve note: "
                f"{str(error)}"
            )
        )