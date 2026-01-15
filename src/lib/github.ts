import { GitHubUser, RepositorySignal, EngineerScore } from '@/types';

/**
 * Service to handle GitHub API interactions.
 * Note: In a real app, this would use octokit and handle rate limiting.
 */
export class GitHubService {
    private baseUri = 'https://api.github.com';
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async fetchGitHub(path: string) {
        const response = await fetch(`${this.baseUri}${path}`, {
            headers: {
                Authorization: `token ${this.token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        return response.json();
    }

    async getUserData(): Promise<GitHubUser> {
        return this.fetchGitHub('/user');
    }

    async getUserRepos(username: string): Promise<RepositorySignal[]> {
        return this.fetchGitHub(`/users/${username}/repos?sort=updated&per_page=100`);
    }

    /**
     * Simple scoring logic for MVP.
     * Consistency: Based on repo count and update frequency.
     * Impact: Based on stars and forks across repos.
     * Complexity: Based on languages and repo size.
     */
    calculateScore(repos: RepositorySignal[]): EngineerScore {
        if (repos.length === 0) {
            return { consistency: 0, complexity: 0, impact: 0, overall: 0, topLanguages: [] };
        }

        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
        const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

        // Normalized scores (0-1)
        const impact = Math.min(totalStars / 100 + totalForks / 50, 1);
        const consistency = Math.min(repos.length / 50, 1);
        const complexity = Math.min(languages.length / 10, 1);

        const overall = (impact * 0.4 + consistency * 0.3 + complexity * 0.3);

        return {
            consistency,
            complexity,
            impact,
            overall,
            topLanguages: languages.slice(0, 5),
        };
    }
}
