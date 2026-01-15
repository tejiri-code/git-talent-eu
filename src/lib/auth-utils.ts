import { prisma } from "@/lib/prisma";

export async function getGitHubToken(userId: string) {
    const account = await prisma.account.findFirst({
        where: {
            userId,
            provider: "github",
        },
    });

    return account?.access_token;
}
