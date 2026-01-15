# Environment Variables Setup

The `OAuthSignin` error you're seeing is because critical environment variables are missing from your `.env` file. 

Please ensure your `.env` file contains the following variables:

```bash
# NextAuth Configuration
# Run `openssl rand -base64 32` to generate a secret
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth Provider
# Create at https://github.com/settings/developers
# Homepage URL: http://localhost:3000
# Callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### Steps to Fix:
1. **GitHub Credentials**: Go to [GitHub Developer Settings](https://github.com/settings/developers) and create a new OAuth App.
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
2. **NEXTAUTH_SECRET**: Generate a random string (e.g., using `openssl rand -base64 32`).
3. **Update .env**: Add the generated Client ID, Client Secret, and NextAuth Secret to your `.env` file.
4. **Restart Server**: Restart your `npm run dev` process to load the new variables.
