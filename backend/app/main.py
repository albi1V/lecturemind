from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.ai import improve_note
from app.schemas import NoteRequest, NoteResponse


app = FastAPI(
    title="LectureMind API",
    description="AI-powered lecture note assistant",
    version="0.1.0",
)


# Allow the React frontend to communicate with this backend.
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


@app.post(
    "/api/improve-note",
    response_model=NoteResponse,
)
def improve_lecture_note(request: NoteRequest):

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
            detail=f"Failed to improve note: {str(error)}",
        )