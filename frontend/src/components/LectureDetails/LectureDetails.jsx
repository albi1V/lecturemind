import { useState } from "react";
import "./LectureDetails.css";

function LectureDetails({
    onProceed,
    onBack,
    loading,
    progress
}) {

    const today = new Date()
        .toISOString()
        .split("T")[0];

    // Lecture details
    const [date, setDate] = useState(today);
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState("");

    // Controls whether the notes section is visible
    const [showNotes, setShowNotes] = useState(false);

    // Stores all the notes
    const [notes, setNotes] = useState([""]);


    // First Proceed button
    const handleFirstProceed = () => {

        if (
            !date ||
            !subject.trim() ||
            !topic.trim()
        ) {
            alert("Please fill in all the lecture details.");
            return;
        }

        setShowNotes(true);
    };


    // Change a particular note
    const handleNoteChange = (index, value) => {

        const updatedNotes = [...notes];

        updatedNotes[index] = value;

        setNotes(updatedNotes);
    };


    // Add a new note input
    const handleAddNote = () => {

        setNotes([
            ...notes,
            ""
        ]);
    };


    // Final Proceed button
    const handleProceed = () => {

        const validNotes = notes
            .map((note) => note.trim())
            .filter((note) => note !== "");

        if (validNotes.length === 0) {
            alert("Please enter at least one lecture point.");
            return;
        }

        const lectureDetails = {
            date: date,
            subject: subject.trim(),
            topic: topic.trim(),
            notes: validNotes
        };

        console.log("Lecture Details:", lectureDetails);

        onProceed(lectureDetails);
    };


    return (
        <div className="lecture-details-page">

            {/* Header */}

            <div className="lecture-details-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h1>Start Lecture</h1>

            </div>


            {/* Main Card */}

            <div className="lecture-details-card">

                <h2>Lecture Details</h2>


                {/* Date */}

                <div className="form-group">

                    <label htmlFor="date">
                        Date
                    </label>

                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(event) =>
                            setDate(event.target.value)
                        }
                    />

                </div>


                {/* Subject */}

                <div className="form-group">

                    <label htmlFor="subject">
                        Subject
                    </label>

                    <input
                        id="subject"
                        type="text"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(event) =>
                            setSubject(event.target.value)
                        }
                    />

                </div>


                {/* Topic */}

                <div className="form-group">

                    <label htmlFor="topic">
                        Topic
                    </label>

                    <input
                        id="topic"
                        type="text"
                        placeholder="Enter lecture topic"
                        value={topic}
                        onChange={(event) =>
                            setTopic(event.target.value)
                        }
                    />

                </div>


                {/* FIRST PROCEED */}

                {!showNotes && (
                    <button
                        className="proceed-button"
                        onClick={handleFirstProceed}
                    >
                        Proceed
                    </button>
                )}


                {/* NOTES SECTION */}

                {showNotes && (

                    <div className="notes-section">

                        <div className="notes-divider"></div>


                        <h2>Lecture Points</h2>

                        <p className="notes-description">
                            Add the important points from your lecture.
                        </p>


                        {/* Dynamic note inputs */}

                        <div className="notes-list">

                            {notes.map((note, index) => (

                                <div
                                    className="note-row"
                                    key={index}
                                >

                                    <span className="note-number">
                                        {index + 1}
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your point"
                                        value={note}
                                        onChange={(event) =>
                                            handleNoteChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            ))}

                        </div>


                        {/* ADD BUTTON */}

                        <button
                            className="add-note-button"
                            onClick={handleAddNote}
                            disabled={loading}
                        >
                            ADD +
                        </button>

                        {progress && (
                            <p className="processing-text">
                                {progress}
                            </p>
                        )}

                        <button
                            className="proceed-button"
                            onClick={handleProceed}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Proceed"}
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default LectureDetails;