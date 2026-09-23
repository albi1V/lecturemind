from sqlalchemy import text

from app.database import engine


try:
    with engine.connect() as connection:

        result = connection.execute(
            text("SELECT DATABASE()")
        )

        print("Connected to database:")
        print(result.scalar())

except Exception as error:

    print("Database connection failed:")
    print(error)