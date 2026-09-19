import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const improveNote = async (subject, topic, note) => {

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