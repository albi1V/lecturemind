import { useState } from "react";

import EntryPage from "./components/EntryPage/EntryPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";

import LandingPage from "./components/LandingPage/LandingPage";
import LectureDetails from "./components/LectureDetails/LectureDetails";
import ImprovedNotes from "./components/ImprovedNotes/ImprovedNotes";

import { improveNote } from "./services/api";


function App() {

    const [page, setPage] = useState("entry");

    const [lecture, setLecture] = useState(null);
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");


    // -----------------------------
    // AUTH NAVIGATION
    // -----------------------------

    const handleLogin = () => {
        setPage("login");
    };
    const handleLoginSuccess = () => {
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


    const handleFinishLecture = () => {

        setLecture(null);
        setResults([]);

        setPage("landing");
    };


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
                        onBack={() =>
                            setPage("details")
                        }
                        onFinish={
                            handleFinishLecture
                        }
                    />
                )}

        </>
    );
}


export default App;