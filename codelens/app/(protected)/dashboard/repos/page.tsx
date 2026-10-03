import Link from "next/link";
import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import type { DashboardRepo } from "@/features/dashboard/lib/types";
import { getUserInstallationId } from "@/features/github/server/installation";
import { listInstallationRepos } from "@/features/github/server/repositories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Repositories · Dashboard",
};

const DashboardReposPage = async () => {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  let repos: DashboardRepo[] = [];
  let loadFailed = false;

  if (installationId) {
    try {
      repos = await listInstallationRepos(installationId);
    } catch (error) {
      console.error("Failed to load repositories", error);
      loadFailed = true;
    }
  }

  return (
    <>
      <DashboardHeader
        title="Repositories"
        description="Repositories the CodeLens GitHub App can review."
      />
      <div className="p-4">
        {!installationId ? (
          <p className="text-sm text-muted-foreground">
            The GitHub App isn&apos;t installed yet.{" "}
            <Link href={DASHBOARD_ROUTES.github} className="underline">
              Connect GitHub
            </Link>{" "}
            to see your repositories.
          </p>
        ) : loadFailed ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t load repositories from GitHub. Try again in a moment.
          </p>
        ) : repos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            The app is installed but has access to no repositories. Update its
            repository access on GitHub.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Default branch</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repos.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`https://github.com/${repo.fullName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {repo.fullName}
                    </a>
                  </TableCell>
                  <TableCell>
                    <span
                      className={statusBadge(
                        repo.visibility === "private" ? "warning" : "neutral"
                      )}
                    >
                      {repo.visibility}
                    </span>
                  </TableCell>
                  <TableCell>{repo.defaultBranch}</TableCell>
                  <TableCell>{repo.language ?? "—"}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(repo.updatedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default DashboardReposPage;
