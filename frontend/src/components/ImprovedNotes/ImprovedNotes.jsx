import { useState } from "react";

import "./ImprovedNotes.css";

function ImprovedNotes({
    lecture,
    results,
    onBack,
    onFinish,
    onSave
}) {

    const [showSaveDialog, setShowSaveDialog] =
        useState(false);


    /*
     * User clicks Finish Lecture.
     * We don't immediately leave the page.
     * First we ask whether the lecture should be saved.
     */
    const handleFinishClick = () => {

        setShowSaveDialog(true);

    };


    /*
     * User chooses Don't Save.
     */
    const handleDontSave = () => {

        setShowSaveDialog(false);

        onFinish();

    };


    /*
     * User chooses Save Lecture.
     *
     * We send the complete lecture information
     * back to App.jsx.
     */
    const handleSaveLecture = () => {

        const lectureToSave = {

            lecture_date: lecture.date,

            subject: lecture.subject,

            topic: lecture.topic,

            notes: results.map((item) => ({

                original_note: item.original,

                improved_note: item.improved

            }))

        };


        console.log(
            "Lecture ready to save:",
            lectureToSave
        );


        setShowSaveDialog(false);


        /*
         * Send the lecture data to App.jsx.
         */
        onSave(lectureToSave);

    };


    return (
        <div className="improved-notes-page">


            {/* =========================
                Header
            ========================= */}

            <div className="improved-notes-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h1>
                    Improved Notes
                </h1>

            </div>


            {/* =========================
                Subject and Topic
            ========================= */}

            <div className="lecture-heading">

                <h2>
                    {lecture.subject}
                </h2>

                <p>
                    {lecture.topic}
                </p>

            </div>


            {/* =========================
                Notes
            ========================= */}

            <div className="improved-notes-card">

                {results.map(
                    (item, index) => (

                        <div
                            className="improved-note-item"
                            key={index}
                        >

                            <div className="original-section">

                                <h3>
                                    Original:
                                </h3>

                                <p>
                                    {item.original}
                                </p>

                            </div>


                            <div className="ai-section">

                                <h3>
                                    AI Improved:
                                </h3>

                                <p>
                                    {item.improved}
                                </p>

                            </div>


                            {index !== results.length - 1 && (
                                <hr />
                            )}

                        </div>

                    )
                )}


                {/* =========================
                    Finish Lecture
                ========================= */}

                <div className="finish-container">

                    <button
                        className="finish-button"
                        onClick={handleFinishClick}
                    >
                        Finish Lecture
                    </button>

                </div>

            </div>


            {/* =========================
                Save Dialog
            ========================= */}

            {showSaveDialog && (

                <div className="save-dialog-overlay">

                    <div className="save-dialog">

                        <h2>
                            Lecture Completed
                        </h2>

                        <p>
                            Do you want to save this lecture?
                        </p>


                        <div className="save-dialog-buttons">

                            <button
                                className="save-lecture-button"
                                onClick={handleSaveLecture}
                            >
                                Save Lecture
                            </button>


                            <button
                                className="dont-save-button"
                                onClick={handleDontSave}
                            >
                                Don't Save
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ImprovedNotes;