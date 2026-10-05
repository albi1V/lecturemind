from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Lecture(Base):
    __tablename__ = "lectures"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    lecture_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    subject: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    topic: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    notes: Mapped[list["LectureNote"]] = relationship(
        "LectureNote",
        back_populates="lecture",
        cascade="all, delete-orphan"
    )