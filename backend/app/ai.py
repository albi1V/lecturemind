from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import GEMINI_API_KEY
from app.prompts import lecture_note_prompt


model = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.2,
)


lecture_note_chain = lecture_note_prompt | model


def improve_note(
    subject: str,
    topic: str,
    note: str,
) -> str:

    response = lecture_note_chain.invoke(
        {
            "subject": subject,
            "topic": topic,
            "note": note,
        }
    )

    content = response.content

    # Gemini may return content as a list of content blocks.
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        text_parts = []

        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                text_parts.append(block.get("text", ""))

        return "".join(text_parts).strip()

    return str(content)