'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function SigninPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="auth-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (session) {
        return (
            <div className="auth-container">
                <h1>Welcome, {session.user?.name}</h1>
                <p>You are signed in as {session.user?.role?.toLowerCase()}.</p>
                <div className="auth-actions">
                    <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
                    <button onClick={() => signOut()} className="btn-secondary">Sign Out</button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Connect with GitHub</h1>
                <p>Join the ecosystem of elite European engineers. Privacy-first, signal-focused.</p>

                <div className="gdpr-box">
                    <h3>GDPR & Privacy</h3>
                    <p>
                        By signing in, you agree to our terms. We only ingest public data.
                        You will have the option to opt-in to the hiring database once inside.
                        You can delete your data at any time.
                    </p>
                </div>

                <button
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                    className="btn-primary btn-lg btn-block"
                >
                    Continue with GitHub
                </button>

                <Link href="/" className="back-link">← Back to home</Link>
            </div>
        </div>
    );
}
