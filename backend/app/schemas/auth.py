from pydantic import BaseModel, Field


class OTPRequest(BaseModel):
    identifier: str = Field(
        ...,
        min_length=5,
        max_length=255
    )


class OTPVerifyRequest(BaseModel):
    identifier: str = Field(
        ...,
        min_length=5,
        max_length=255
    )

    otp: str = Field(
        ...,
        min_length=6,
        max_length=6
    )


class RegisterRequest(BaseModel):
    identifier: str = Field(
        ...,
        min_length=5,
        max_length=255
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128
    )

    otp: str = Field(
        ...,
        min_length=6,
        max_length=6
    )


class RegisterResponse(BaseModel):
    message: str
    user_id: int


class LoginRequest(BaseModel):
    identifier: str = Field(
        ...,
        min_length=5,
        max_length=255
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=128
    )


class LoginResponse(BaseModel):
    message: str
    user_id: int
    identifier: str