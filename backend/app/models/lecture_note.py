from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class LectureNote(Base):
    __tablename__ = "lecture_notes"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    lecture_id: Mapped[int] = mapped_column(
        ForeignKey("lectures.id"),
        nullable=False,
        index=True
    )

    original_note: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    improved_note: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    lecture: Mapped["Lecture"] = relationship(
        "Lecture",
        back_populates="notes"
    )