import { useState } from "react";

import LandingPage from "./components/LandingPage/LandingPage";
import LectureDetails from "./components/LectureDetails/LectureDetails";
import ImprovedNotes from "./components/ImprovedNotes/ImprovedNotes";

import { improveNote } from "./services/api";


function App() {

    const [page, setPage] = useState("landing");

    const [lecture, setLecture] = useState(null);

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = useState("");


    // --------------------------------
    // Landing Page → Lecture Details
    // --------------------------------

    const handleAddNotes = () => {

        setPage("details");

    };


    // --------------------------------
    // Lecture Details → AI Processing
    // --------------------------------

    const handleLectureDetails = async (details) => {

        console.log("Received lecture:", details);

        setLecture(details);

        setLoading(true);


        const improvedResults = [];


        try {

            for (
                let i = 0;
                i < details.notes.length;
                i++
            ) {

                const currentNote = details.notes[i];


                console.log(
                    "Sending note to backend:",
                    currentNote
                );


                setProgress(
                    `Processing ${i + 1} of ${details.notes.length}...`
                );


                const result = await improveNote(
                    details.subject,
                    details.topic,
                    currentNote
                );


                console.log(
                    "Backend response:",
                    result
                );


                improvedResults.push({

                    original: currentNote,

                    improved: result.improved_note

                });

            }


            console.log(
                "All notes processed:",
                improvedResults
            );


            setResults(improvedResults);

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


    // --------------------------------
    // Finish Lecture
    // --------------------------------

    const handleFinishLecture = () => {

        setLecture(null);

        setResults([]);

        setPage("landing");

    };


    return (
        <>

            {page === "landing" && (

                <LandingPage
                    onAddNotes={handleAddNotes}
                />

            )}


            {page === "details" && (

                <LectureDetails
                    onProceed={handleLectureDetails}

                    onBack={() =>
                        setPage("landing")
                    }

                    loading={loading}

                    progress={progress}
                />

            )}


            {page === "improved" && lecture && (

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