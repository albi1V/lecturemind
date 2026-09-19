import "./ImprovedNotes.css";

function ImprovedNotes({
    lecture,
    results,
    onBack,
    onFinish
}) {

    return (
        <div className="improved-notes-page">

            {/* Header */}

            <div className="improved-notes-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h1>Improved Notes</h1>

            </div>


            {/* Subject and Topic */}

            <div className="lecture-heading">

                <h2>
                    {lecture.subject}
                </h2>

                <p>
                    {lecture.topic}
                </p>

            </div>


            {/* Notes */}

            <div className="improved-notes-card">

                {results.map((item, index) => (

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

                ))}


                {/* Finish Lecture */}

                <div className="finish-container">

                    <button
                        className="finish-button"
                        onClick={onFinish}
                    >
                        Finish Lecture
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ImprovedNotes;