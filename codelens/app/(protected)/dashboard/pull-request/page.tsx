import Link from "next/link";
import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import {
  statusBadge,
  type statusBadgeClass,
} from "@/features/dashboard/lib/status-style";
import { getUserInstallationId } from "@/features/github/server/installation";
import { listPullRequests } from "@/features/reviews/server/list-pull-requests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Pull requests · Dashboard",
};

const STATUS_TONE: Record<string, keyof typeof statusBadgeClass> = {
  reviewed: "success",
  processing: "info",
  pending: "neutral",
  failed: "danger",
  rate_limited: "warning",
};

const DashboardPullRequestsPage = async () => {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);
  const pullRequests = installationId
    ? await listPullRequests(installationId)
    : [];

  return (
    <>
      <DashboardHeader
        title="Pull requests"
        description="Pull requests CodeLens has received and reviewed."
      />
      <div className="p-4">
        {!installationId ? (
          <p className="text-sm text-muted-foreground">
            The GitHub App isn&apos;t installed yet.{" "}
            <Link href={DASHBOARD_ROUTES.github} className="underline">
              Connect GitHub
            </Link>{" "}
            to start receiving reviews.
          </p>
        ) : pullRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pull requests yet. Open or push to a PR in an installed
            repository and it will show up here.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pull request</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pullRequests.map((pr) => (
                <TableRow key={pr.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {pr.repoFullName}#{pr.prNumber}
                    </a>
                    <div className="text-xs font-normal text-muted-foreground">
                      {pr.title}
                    </div>
                  </TableCell>
                  <TableCell>{pr.authorLogin ?? "—"}</TableCell>
                  <TableCell>
                    <span
                      className={statusBadge(STATUS_TONE[pr.status] ?? "neutral")}
                    >
                      {pr.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(pr.updatedAt, { addSuffix: true })}
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

export default DashboardPullRequestsPage;
