import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getGitHubToken } from "@/lib/auth-utils";
import { GitHubService } from "@/lib/github";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toggleOptIn } from "./actions";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions as any);

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Ensure engineer profile exists
    let profile = await prisma.engineerProfile.findUnique({
        where: { userId: session.user.id },
    });

    const token = await getGitHubToken(session.user.id);

    if (!profile && token) {
        // Initialize profile on first visit if we have a token
        const ghService = new GitHubService(token);
        const ghUser = await ghService.getUserData();
        const repos = await ghService.getUserRepos(ghUser.login);
        const scores = ghService.calculateScore(repos);

        profile = await prisma.engineerProfile.create({
            data: {
                userId: session.user.id,
                githubUsername: ghUser.login,
                location: ghUser.location,
                score: scores.overall,
                totalCommits: repos.length, // Simplified for MVP
                languages: scores.topLanguages,
                complexityScore: scores.complexityScore || 0,
                prCount: scores.impact * 10, // Simplified signal
            },
        });
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="logo">GitTalent<span>EU</span></div>
                <div className="user-nav">
                    <span>{session.user.name}</span>
                    <img src={session.user.image || ""} alt="" className="avatar-sm" />
                </div>
            </nav>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Engineer Dashboard</h1>
                    <p>Manage your visibility and technical signals.</p>
                </header>

                <div className="dashboard-grid">
                    <section className="stats-card">
                        <h2>Technical Signal</h2>
                        <div className="score-display">
                            <div className="score-circle">
                                <span className="score-value">{Math.round((profile?.score || 0) * 100)}</span>
                                <span className="score-label">Overall</span>
                            </div>
                        </div>
                        <div className="stats-details">
                            <div className="stat-item">
                                <span className="label">Consistency</span>
                                <div className="progress-bar"><div className="fill" style={{ width: `${(profile?.totalCommits || 0) * 2}%` }}></div></div>
                            </div>
                            <div className="stat-item">
                                <span className="label">Impact</span>
                                <div className="progress-bar"><div className="fill" style={{ width: `${(profile?.prCount || 0) * 10}%` }}></div></div>
                            </div>
                            <div className="stat-item">
                                <span className="label">Complexity</span>
                                <div className="progress-bar"><div className="fill" style={{ width: `${(profile?.complexityScore || 0) * 100}%` }}></div></div>
                            </div>
                        </div>
                    </section>

                    <section className="privacy-card">
                        <h2>GDPR & Visibility</h2>
                        <p className="hint">Only opted-in engineers are visible to recruiters. You can revoke this at any time.</p>

                        <div className="opt-in-control">
                            <div className="status-label">
                                <strong>Hiring Status:</strong>
                                <span className={profile?.optIn ? "status-on" : "status-off"}>
                                    {profile?.optIn ? " Visible to Recruiters" : " Hidden (Private)"}
                                </span>
                            </div>

                            <form action={async () => {
                                'use server';
                                await toggleOptIn(!profile?.optIn);
                            }}>
                                <button type="submit" className={profile?.optIn ? "btn-secondary" : "btn-primary"}>
                                    {profile?.optIn ? "Stop Sharing Data" : "Opt-in to Hiring Platform"}
                                </button>
                            </form>
                        </div>

                        <div className="danger-zone">
                            <h3>Right to be Forgotten</h3>
                            <p>Permanently delete all your GitHub metadata and scores from our system.</p>
                            <button className="btn-danger">Delete My Account</button>
                        </div>
                    </section>
                </div>

                <section className="repos-preview">
                    <h2>Top Languages & Tech Stack</h2>
                    <div className="tag-cloud">
                        {(profile?.languages as string[])?.map(lang => (
                            <span key={lang} className="tag">{lang}</span>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
