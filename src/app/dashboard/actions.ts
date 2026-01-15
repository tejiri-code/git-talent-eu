'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleOptIn(enabled: boolean) {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.engineerProfile.update({
        where: { userId: session.user.id },
        data: { optIn: enabled },
    });

    revalidatePath('/dashboard');
}
