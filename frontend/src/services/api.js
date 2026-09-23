import axios from "axios";


const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});


// ------------------------------------
// AI
// ------------------------------------

export const improveNote = async (
    subject,
    topic,
    note
) => {

    const response = await API.post(
        "/api/improve-note",
        {
            subject: subject,
            topic: topic,
            note: note,
        }
    );

    return response.data;
};


// ------------------------------------
// REGISTRATION - SEND OTP
// ------------------------------------

export const sendRegistrationOTP = async (
    identifier
) => {

    const response = await API.post(
        "/api/auth/send-otp",
        {
            identifier: identifier,
        }
    );

    return response.data;
};


// ------------------------------------
// REGISTRATION
// ------------------------------------

export const registerUser = async (
    identifier,
    otp,
    password
) => {

    const response = await API.post(
        "/api/auth/register",
        {
            identifier: identifier,
            otp: otp,
            password: password,
        }
    );

    return response.data;
};



export const loginUser = async (
    identifier,
    password
) => {
    const response = await API.post("/api/auth/login", {
        identifier,
        password,
    });

    return response.data;
};