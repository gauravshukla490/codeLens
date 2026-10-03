import { prisma } from "@/lib/db";

export type PullRequestStats = {
    total: number;
    reviewed: number;
    inProgress: number;
    failed: number;
};

/** Status counts for an installation's pull requests. */
export async function getPullRequestStats(
    installationId: number
): Promise<PullRequestStats> {
    const groups = await prisma.pullRequest.groupBy({
        by: ["status"],
        where: { installationId },
        _count: { _all: true },
    });

    const count = (...statuses: string[]) =>
        groups
            .filter((group) => statuses.includes(group.status))
            .reduce((sum, group) => sum + group._count._all, 0);

    return {
        total: groups.reduce((sum, group) => sum + group._count._all, 0),
        reviewed: count("reviewed"),
        inProgress: count("pending", "processing"),
        failed: count("failed", "rate_limited"),
    };
}
