import "./SubjectNotes.css";

function SubjectNotes({
    lecture,
    onBack
}) {

    return (
        <div className="subject-notes-page">

            <div className="subject-notes-header">

                <button
                    className="subject-back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h1>
                    Saved Notes
                </h1>

            </div>


            <div className="subject-notes-content">

                <div className="subject-heading">

                    <h2>
                        {lecture.subject}
                    </h2>

                    <p>
                        {lecture.lecture_date}
                    </p>

                </div>


                <div className="notes-container">

                    {lecture.notes.map(
                        (note, index) => (

                            <div
                                className="saved-note-card"
                                key={note.id}
                            >

                                <div className="topic-section">

                                    <span className="topic-label">
                                        Topic
                                    </span>

                                    <h3>
                                        {lecture.topic}
                                    </h3>

                                </div>


                                <div className="original-note-section">

                                    <h4>
                                        Original Note
                                    </h4>

                                    <p>
                                        {note.original_note}
                                    </p>

                                </div>


                                <div className="improved-note-section">

                                    <h4>
                                        AI Improved
                                    </h4>

                                    <p>
                                        {note.improved_note}
                                    </p>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

        </div>
    );
}

export default SubjectNotes;