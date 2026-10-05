import "./DateNotes.css";

function DateNotes({
    date,
    lectures,
    onBack,
    onSelectSubject
}) {

    return (
        <div className="date-notes-page">

            <div className="date-notes-header">

                <button
                    className="date-back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h1>
                    Saved Notes
                </h1>

            </div>


            <div className="date-notes-content">

                <h2>
                    {date}
                </h2>

                <p className="date-description">
                    Subjects from this date
                </p>


                <div className="subject-cards-container">

                    {lectures.map((lecture) => (

                        <div
                            className="subject-card"
                            key={lecture.id}
                            onClick={() =>
                                onSelectSubject(lecture)
                            }
                        >

                            <h3>
                                {lecture.subject}
                            </h3>

                            <p className="topic-count">
                                Topic
                            </p>

                            <div className="topic-name">
                                {lecture.topic}
                            </div>

                            <button
                                className="view-subject-button"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    onSelectSubject(
                                        lecture
                                    );
                                }}
                            >
                                View Notes →
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default DateNotes;