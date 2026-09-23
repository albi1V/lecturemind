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