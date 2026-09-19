import "./LandingPage.css";

function LandingPage({ onAddNotes }) {
    return (
        <div className="landing-page">

            <div className="hero-section">

                <h1>LectureMind</h1>

                <p>
                    Turn your quick lecture points into
                    meaningful notes with AI.
                </p>

            </div>

            <div className="add-notes-card">

                <div className="card-icon">
                    ✎
                </div>

                <h2>Add Notes</h2>

                <p>
                    Start a new lecture and capture
                    your notes quickly.
                </p>

                <button onClick={onAddNotes}>
                    Add Notes
                </button>

            </div>

        </div>
    );
}

export default LandingPage;