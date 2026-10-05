import { useMemo, useState } from "react";
import "./LandingPage.css";

function LandingPage({ onAddNotes, onSelectDate, recentLectures = [] }) {
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();

    const filteredLectures = useMemo(() => recentLectures.filter((lecture) => {
        const searchable = `${lecture.date} ${lecture.subjects.join(" ")}`.toLowerCase();
        return searchable.includes(query);
    }), [recentLectures, query]);

    const subjectCount = new Set(recentLectures.flatMap((lecture) => lecture.subjects)).size;
    const formatDate = (date, options) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, options);

    return (
        <div className="landing-page">
            <header className="dashboard-header">
                <a className="dashboard-brand" href="#dashboard" aria-label="LectureMind home">
                    <span className="dashboard-brand-icon">L</span>
                    <span>Lecture<span className="dashboard-brand-light">Mind</span></span>
                </a>
                <div className="dashboard-header-label"><span /> Your learning space</div>
            </header>

            <main className="dashboard-main" id="dashboard">
                <section className="dashboard-welcome">
                    <div>
                        <p className="dashboard-eyebrow">YOUR PERSONAL STUDY SPACE</p>
                        <h1>Make every lecture <span>count.</span></h1>
                        <p className="dashboard-intro">Capture what you learn, improve your notes, and find them whenever you need them.</p>
                    </div>
                    <button className="dashboard-primary-button" onClick={onAddNotes}>
                        <span aria-hidden="true">+</span> New lecture
                    </button>
                </section>

                <section className="dashboard-overview" aria-label="Notes library overview">
                    <article className="overview-stat overview-stat-blue">
                        <span className="overview-stat-icon" aria-hidden="true">▦</span>
                        <span className="overview-stat-copy"><span>Lecture days</span><strong>{recentLectures.length}</strong></span>
                        <span className="overview-stat-foot">with saved notes</span>
                    </article>
                    <article className="overview-stat overview-stat-green">
                        <span className="overview-stat-icon" aria-hidden="true">◇</span>
                        <span className="overview-stat-copy"><span>Subjects</span><strong>{subjectCount}</strong></span>
                        <span className="overview-stat-foot">in your library</span>
                    </article>
                    <button className="overview-create" onClick={onAddNotes}>
                        <span className="overview-create-icon" aria-hidden="true">+</span>
                        <span className="overview-create-copy"><strong>Start a new lecture</strong><small>Add your lecture points and turn them into useful notes.</small></span>
                        <span className="overview-create-arrow" aria-hidden="true">→</span>
                    </button>
                </section>

                <section className="library-panel">
                    <div className="library-heading">
                        <div>
                            <p className="dashboard-eyebrow">YOUR LIBRARY</p>
                            <h2>Recent lecture days</h2>
                            <p className="library-description">Choose a day to open the notes you saved.</p>
                        </div>
                        <label className="library-search">
                            <span aria-hidden="true">⌕</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search dates or subjects"
                                aria-label="Search dates or subjects"
                            />
                            {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}
                        </label>
                    </div>

                    {filteredLectures.length ? (
                        <div className="library-list">
                            {filteredLectures.map((lecture) => (
                                <button className="library-row" key={lecture.date} onClick={() => onSelectDate(lecture.date)}>
                                    <span className="library-date-tile">
                                        <strong>{formatDate(lecture.date, { day: "2-digit" })}</strong>
                                        <small>{formatDate(lecture.date, { month: "short" })}</small>
                                    </span>
                                    <span className="library-date-copy">
                                        <strong>{formatDate(lecture.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong>
                                        <small>{lecture.subjects.length} {lecture.subjects.length === 1 ? "subject" : "subjects"}</small>
                                    </span>
                                    <span className="library-subjects">
                                        {lecture.subjects.slice(0, 3).map((subject) => <span className="library-subject" key={subject}>{subject}</span>)}
                                        {lecture.subjects.length > 3 && <span className="library-subject library-subject-more">+{lecture.subjects.length - 3}</span>}
                                    </span>
                                    <span className="library-row-action">View notes <span aria-hidden="true">→</span></span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="library-empty">
                            <span className="library-empty-icon" aria-hidden="true">✎</span>
                            <h3>{recentLectures.length ? "No matching lecture days" : "Your notes will appear here"}</h3>
                            <p>{recentLectures.length ? "Try another date or subject, or clear your search." : "Create your first lecture to start building your personal notes library."}</p>
                            {!recentLectures.length && <button onClick={onAddNotes}>Create your first lecture <span aria-hidden="true">→</span></button>}
                        </div>
                    )}
                </section>

                <footer className="dashboard-footer">One lecture at a time. One step closer to mastery.</footer>
            </main>
        </div>
    );
}

export default LandingPage;
