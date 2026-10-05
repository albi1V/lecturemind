import { useEffect, useState } from "react";

import EntryPage from "./components/EntryPage/EntryPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import DateNotes from "./components/DateNotes/DateNotes";
import SubjectNotes from "./components/SubjectNotes/SubjectNotes";
import LandingPage from "./components/LandingPage/LandingPage";
import LectureDetails from "./components/LectureDetails/LectureDetails";
import ImprovedNotes from "./components/ImprovedNotes/ImprovedNotes";

import {
    improveNote,
    saveLecture,
    getLecturesByDate,
    getRecentLectures
} from "./services/api";


function App() {


const [page, setPage] = useState("entry");
const [lecture, setLecture] = useState(null);
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [progress, setProgress] = useState("");
const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken")
);

const [selectedDate, setSelectedDate] = useState(null);
const [savedLectures, setSavedLectures] = useState([]);
const [recentLectures, setRecentLectures] = useState([]);
const [selectedLecture, setSelectedLecture] = useState(null);


    // -----------------------------
    // AUTH NAVIGATION
    // -----------------------------

    const handleLogin = () => {
        setPage("login");
    };

const handleLoginSuccess = (token) => {

    localStorage.setItem(
        "accessToken",
        token
    );

    setAccessToken(token);
    setPage("landing");
};


    const handleRegister = () => {
        setPage("register");
    };


    const handleBackToEntry = () => {
        setPage("entry");
    };


    // -----------------------------
    // LECTURE NAVIGATION
    // -----------------------------

    const handleAddNotes = () => {
        setPage("details");
    };


    const handleLectureDetails = async (details) => {

        console.log(
            "Received lecture:",
            details
        );

        setLecture(details);
        setLoading(true);

        const improvedResults = [];

        try {

            for (
                let i = 0;
                i < details.notes.length;
                i++
            ) {

                const currentNote =
                    details.notes[i];

                setProgress(
                    `Processing ${i + 1} of ${details.notes.length}...`
                );

                const result =
                    await improveNote(
                        details.subject,
                        details.topic,
                        currentNote
                    );

                improvedResults.push({
                    original: currentNote,
                    improved:
                        result.improved_note
                });
            }

            setResults(
                improvedResults
            );

            setPage("improved");

        } catch (error) {

            console.error(
                "Failed to process notes:",
                error
            );

            alert(
                "Something went wrong while processing your notes."
            );

        } finally {

            setLoading(false);
            setProgress("");
        }
    };

const handleSaveLecture = async (
    lectureToSave
) => {

    try {

        console.log(
            "Saving lecture:",
            lectureToSave
        );


        const response = await saveLecture(
            lectureToSave,
            accessToken
        );


        console.log(
            "Lecture saved:",
            response
        );


        alert(
            "Lecture saved successfully!"
        );


        setLecture(null);

        setResults([]);

        setPage("landing");


    } catch (error) {
    console.error(
        "Failed to save lecture:",
        error
    );

    console.error(
        "Backend error:",
        error.response?.data
    );

    alert(
        JSON.stringify(
            error.response?.data,
            null,
            2
        )
    );
}
};

    const handleFinishLecture = () => {

        setLecture(null);
        setResults([]);

        setPage("landing");
    };
     const handleSelectDate = async (date) => {
    try {
        console.log(
            "Loading lectures for date:",
            date
        );

        const response = await getLecturesByDate(
            date,
            accessToken
        );

        console.log(
            "Saved lectures:",
            response
        );

        setSelectedDate(date);
        setSavedLectures(response.lectures);

        setPage("date-notes");

    } catch (error) {
        console.error(
            "Failed to load lectures:",
            error
        );

        const detail =
            error.response?.data?.detail;

        alert(
            detail ||
            "Failed to load saved notes."
        );
    }
};
const handleSelectSubject = (lecture) => {

    console.log(
        "Selected subject:",
        lecture
    );

    setSelectedLecture(lecture);

    setPage("subject-notes");
};
useEffect(() => {

    if (
        page !== "landing" ||
        !accessToken
    ) {
        return;
    }

    const loadRecentLectures = async () => {

        try {

            console.log(
                "Loading recent lectures..."
            );

            const response =
                await getRecentLectures(
                    accessToken
                );

            console.log(
                "Recent lectures:",
                response
            );

            setRecentLectures(
                response.lectures
            );

        } catch (error) {

            console.error(
                "Failed to load recent lectures:",
                error
            );

            const detail =
                error.response?.data?.detail;

            console.error(
                "Backend error:",
                detail
            );
        }
    };

    loadRecentLectures();

}, [page, accessToken]);
    return (
        <>

            {/* ENTRY PAGE */}

            {page === "entry" && (
                <EntryPage
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                />
            )}


            {/* LOGIN PAGE */}

            {page === "login" && (
                <LoginPage
                    onBack={handleBackToEntry}
                    onRegister={handleRegister}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}


            {/* REGISTRATION PAGE */}

            {page === "register" && (
                <RegistrationPage
                    onBack={handleBackToEntry}
                    onLogin={handleLogin}
                />
            )}


            {/* EXISTING LECTUREMIND */}

{page === "landing" && (
    <LandingPage
        onAddNotes={handleAddNotes}
        onSelectDate={handleSelectDate}
        recentLectures={recentLectures}
    />
)}

{page === "date-notes" && (
    <DateNotes
        date={selectedDate}
        lectures={savedLectures}
        onBack={() => setPage("landing")}
        onSelectSubject={handleSelectSubject}
    />
)}
{page === "subject-notes" &&
    selectedLecture && (
        <SubjectNotes
            lecture={selectedLecture}
            onBack={() => setPage("date-notes")}
        />
)}

            {page === "details" && (
                <LectureDetails
                    onProceed={
                        handleLectureDetails
                    }
                    onBack={() =>
                        setPage("landing")
                    }
                    loading={loading}
                    progress={progress}
                />
            )}


            {page === "improved" &&
                lecture && (
                    <ImprovedNotes
                        lecture={lecture}
                        results={results}
                        onBack={() => setPage("details")}
                        onFinish={handleFinishLecture}
                        onSave={handleSaveLecture}
                    />
                )}

        </>
    );

}


export default App;
