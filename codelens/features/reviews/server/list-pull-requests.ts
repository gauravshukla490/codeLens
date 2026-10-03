import { prisma } from "@/lib/db";

/** Pull requests received for a GitHub App installation, newest first. */
export async function listPullRequests(installationId: number) {
    return prisma.pullRequest.findMany({
        where: { installationId },
        orderBy: { updatedAt: "desc" },
        take: 50,
    });
}
