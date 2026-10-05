from datetime import date

from pydantic import BaseModel, Field


class NoteRequest(BaseModel):
    subject: str = Field(
        ...,
        min_length=1
    )

    topic: str = Field(
        ...,
        min_length=1
    )

    note: str = Field(
        ...,
        min_length=1
    )


class NoteResponse(BaseModel):
    improved_note: str


class LectureNoteCreate(BaseModel):
    original_note: str = Field(
        ...,
        min_length=1
    )

    improved_note: str = Field(
        ...,
        min_length=1
    )


class LectureCreate(BaseModel):
    lecture_date: date

    subject: str = Field(
        ...,
        min_length=1
    )

    topic: str = Field(
        ...,
        min_length=1
    )

    notes: list[LectureNoteCreate] = Field(
        ...,
        min_length=1
    )


class LectureCreateResponse(BaseModel):
    message: str

    lecture_id: int

class LectureNoteResponse(BaseModel):
    id: int
    original_note: str
    improved_note: str


class LectureResponse(BaseModel):
    id: int
    lecture_date: date
    subject: str
    topic: str
    notes: list[LectureNoteResponse]


class DateLecturesResponse(BaseModel):
    lecture_date: date
    lectures: list[LectureResponse]