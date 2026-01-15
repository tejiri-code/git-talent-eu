import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RecruiterSearchPage() {
    const session = (await getServerSession(authOptions as any)) as any;

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Fetch all engineers who have opted in
    const engineers = await prisma.engineerProfile.findMany({
        where: { optIn: true },
        include: { user: true },
        orderBy: { score: 'desc' },
    });

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="logo">GitTalent<span>EU</span></div>
                <div className="user-nav">
                    <span>Recruiter: {session.user.name}</span>
                    <img src={session.user.image || ""} alt="" className="avatar-sm" />
                </div>
            </nav>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Discover Engineers</h1>
                    <p>Find elite European talent based on real engineering signals.</p>
                </header>

                <div className="search-container">
                    <aside className="search-filters">
                        <div className="filter-group">
                            <h3>Tech Stack</h3>
                            <div className="filter-options">
                                <label><input type="checkbox" /> Rust</label>
                                <label><input type="checkbox" /> Go</label>
                                <label><input type="checkbox" /> TypeScript</label>
                                <label><input type="checkbox" /> Python</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h3>Region</h3>
                            <div className="filter-options">
                                <label><input type="checkbox" /> Northern Europe</label>
                                <label><input type="checkbox" /> Western Europe</label>
                                <label><input type="checkbox" /> Southern Europe</label>
                                <label><input type="checkbox" /> Eastern Europe</label>
                                <label><input type="checkbox" /> Remote First</label>
                            </div>
                        </div>
                    </aside>

                    <section className="engineer-list">
                        {engineers.length === 0 ? (
                            <div className="empty-state">
                                <p>No engineers have opted-in yet. Try again later!</p>
                            </div>
                        ) : (
                            engineers.map((engineer) => (
                                <div key={engineer.id} className="engineer-card">
                                    <div className="profile-summary">
                                        <span className="cv-blind-badge">CV-Blind Profile</span>
                                        <h3>{engineer.githubUsername}</h3>
                                        <div className="profile-meta">
                                            <span>📍 {engineer.location || "Europe"}</span>
                                            <span>🌍 {engineer.isRemote ? "Remote-First" : "Hybrid"}</span>
                                        </div>
                                        <div className="tag-cloud">
                                            {(engineer.languages as string[])?.slice(0, 3).map(lang => (
                                                <span key={lang} className="tag primary">{lang}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="engineer-stats">
                                        <div className="mini-stat">
                                            <span className="value">{Math.round((engineer.score || 0) * 100)}</span>
                                            <span className="label">Score</span>
                                        </div>
                                        <div className="mini-stat">
                                            <span className="value">{engineer.totalCommits}+</span>
                                            <span className="label">Impact</span>
                                        </div>
                                        <button className="btn-primary">View Details</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
