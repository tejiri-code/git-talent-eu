import Link from 'next/link';

export default function Home() {
  return (
    <main className="landing-container">
      <nav className="navbar">
        <div className="logo">GitTalent<span>EU</span></div>
        <div className="nav-links">
          <Link href="#features">Features</Link>
          <Link href="/auth/signin" className="btn-secondary">Recruiter Login</Link>
          <Link href="/auth/signin" className="btn-primary">Join as Engineer</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">Built for Europe</div>
          <h1>Hire for <span>Code</span>, Not for Credentials.</h1>
          <p>
            The GDPR-compliant hiring platform that discovers elite software engineers
            based on real GitHub contributions. Bias-free, CV-blind, and focused on talent.
          </p>
          <div className="hero-actions">
            <Link href="/auth/signin" className="btn-primary btn-lg">Get Started with GitHub</Link>
            <Link href="#features" className="btn-secondary btn-lg">Explore Engineers</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-card">
            <div className="code-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="code-body">
              <pre>
                <code>
                  {`// Engineer Signal Analyzed
const profile = {
  consistency: 0.98,
  complexity: "High",
  languages: ["Rust", "Go", "TS"],
  impact: "Critical PRs in 5 OSS repos"
};`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Engineered for Fairness</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="icon">🛡️</div>
            <h3>GDPR First</h3>
            <p>Strict opt-in protocols and right-to-delete built into every workflow.</p>
          </div>
          <div className="feature-item">
            <div className="icon">🙈</div>
            <h3>CV-Blind</h3>
            <p>Profiles are anonymized. Focus purely on engineering technical excellence.</p>
          </div>
          <div className="feature-item">
            <div className="icon">📈</div>
            <h3>Real Signals</h3>
            <p>Scoring based on commits, PRs, and code quality, not job titles.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 GitTalent EU. Privacy by design. Built in Europe.</p>
      </footer>
    </main>
  );
}
