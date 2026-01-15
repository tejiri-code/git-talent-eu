export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string;
    location: string;
    email: string;
    bio: string;
    public_repos: number;
    followers: number;
}

export interface RepositorySignal {
    name: string;
    description: string;
    stargazers_count: number;
    language: string;
    forks_count: number;
    updated_at: string;
    size: number;
}

export interface EngineerScore {
    consistency: number; // 0-1
    complexity: number;  // 0-1
    impact: number;      // 0-1
    overall: number;     // 0-1
    topLanguages: string[];
}
