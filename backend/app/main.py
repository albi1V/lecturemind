from fastapi import Depends, FastAPI, HTTPException
from datetime import date
from fastapi.middleware.cors import CORSMiddleware

from app.security import create_access_token, get_current_user

from sqlalchemy.orm import Session

from app.ai import improve_note

from app.auth import (
    complete_registration,
    login_user,
    request_registration_otp,
)

from app.database import Base, engine, get_db

from app.models import (
    User,
    OTPVerification,
    Lecture,
    LectureNote,
)

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
    LectureCreate,
    LectureCreateResponse,
    DateLecturesResponse,
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
            password=request.password,
        )

        access_token = create_access_token(
            user_id=user.id
        )

        return LoginResponse(
            message="Login successful.",
            user_id=user.id,
            identifier=user.identifier,
            access_token=access_token,
            token_type="bearer",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error),
        )


@app.post(
    "/api/lectures",
    response_model=LectureCreateResponse
)
def save_lecture(
    request: LectureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        # -----------------------------
        # Create the lecture
        # -----------------------------

        lecture = Lecture(
            user_id=current_user.id,
            lecture_date=request.lecture_date,
            subject=request.subject,
            topic=request.topic
        )

        db.add(lecture)

        # Get the generated lecture ID
        db.flush()


        # -----------------------------
        # Create the lecture notes
        # -----------------------------

        for note in request.notes:

            lecture_note = LectureNote(
                lecture_id=lecture.id,
                original_note=note.original_note,
                improved_note=note.improved_note
            )

            db.add(lecture_note)


        # -----------------------------
        # Save everything
        # -----------------------------

        db.commit()

        return LectureCreateResponse(
            message="Lecture saved successfully.",
            lecture_id=lecture.id
        )


    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save lecture: {str(error)}"
        )

@app.get(
    "/api/lectures/date/{lecture_date}",
    response_model=DateLecturesResponse
)
def get_lectures_by_date(
    lecture_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lectures = (
        db.query(Lecture)
        .filter(
            Lecture.user_id == current_user.id,
            Lecture.lecture_date == lecture_date
        )
        .order_by(Lecture.subject.asc())
        .all()
    )

    lecture_responses = []

    for lecture in lectures:
        note_responses = []

        for note in lecture.notes:
            note_responses.append(
                {
                    "id": note.id,
                    "original_note": note.original_note,
                    "improved_note": note.improved_note
                }
            )

        lecture_responses.append(
            {
                "id": lecture.id,
                "lecture_date": lecture.lecture_date,
                "subject": lecture.subject,
                "topic": lecture.topic,
                "notes": note_responses
            }
        )

    return {
        "lecture_date": lecture_date,
        "lectures": lecture_responses
    }
@app.get("/api/lectures/recent")
def get_recent_lectures(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lectures = (
        db.query(Lecture)
        .filter(
            Lecture.user_id == current_user.id
        )
        .order_by(
            Lecture.lecture_date.desc(),
            Lecture.subject.asc()
        )
        .all()
    )

    recent_lectures = {}

    for lecture in lectures:

        date_key = lecture.lecture_date.isoformat()

        if date_key not in recent_lectures:
            recent_lectures[date_key] = {
                "date": date_key,
                "subjects": []
            }

        if lecture.subject not in recent_lectures[date_key]["subjects"]:
            recent_lectures[date_key]["subjects"].append(
                lecture.subject
            )

    return {
        "lectures": list(
            recent_lectures.values()
        )
    }
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