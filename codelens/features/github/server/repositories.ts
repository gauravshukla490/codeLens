import type { DashboardRepo } from "@/features/dashboard/lib/types";
import { getGithubApp } from "../utils/github-app";

const REPOS_PER_PAGE = 100;

/** Lists the repositories the user's GitHub App installation can access. */
export async function listInstallationRepos(
    installationId: number
): Promise<DashboardRepo[]> {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);

    const { data } = await octokit.request("GET /installation/repositories", {
        per_page: REPOS_PER_PAGE,
    });

    return data.repositories.map((repo) => ({
        id: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        visibility: repo.private ? "private" : "public",
        defaultBranch: repo.default_branch,
        updatedAt: repo.updated_at ?? repo.pushed_at ?? new Date().toISOString(),
        language: repo.language ?? null,
        stars: repo.stargazers_count ?? 0,
    }));
}
