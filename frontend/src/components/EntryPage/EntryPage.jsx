import "./EntryPage.css";

function EntryPage({ onLogin, onRegister }) {
    return (
        <div className="entry-page">

            <div className="entry-container">

                <div className="entry-logo">
                    LM
                </div>

                <h1>LectureMind</h1>

                <p className="entry-tagline">
                    Turn your lecture points into
                    meaningful notes with AI.
                </p>

                <div className="entry-buttons">

                    <button
                        className="entry-login-button"
                        onClick={onLogin}
                    >
                        Login
                    </button>

                    <button
                        className="entry-register-button"
                        onClick={onRegister}
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EntryPage;