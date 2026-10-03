import Link from "next/link";
import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  CheckCircle,
  GitPullRequest,
  Hourglass,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { getUserInstallationId } from "@/features/github/server/installation";
import { listPullRequests } from "@/features/reviews/server/list-pull-requests";
import { getPullRequestStats } from "@/features/reviews/server/pull-request-stats";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

const Dashboard = async () => {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  const [stats, recent] = installationId
    ? await Promise.all([
        getPullRequestStats(installationId),
        listPullRequests(installationId),
      ])
    : [null, []];

  const cards = [
    { label: "Pull requests", value: stats?.total ?? 0, icon: GitPullRequest },
    { label: "Reviewed", value: stats?.reviewed ?? 0, icon: CheckCircle },
    { label: "In progress", value: stats?.inProgress ?? 0, icon: Hourglass },
    { label: "Needs attention", value: stats?.failed ?? 0, icon: WarningCircle },
  ];

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="How CodeLens is doing across your pull requests."
      />
      <div className="space-y-6 p-4 md:p-6">
        <div className="animate-fade-up">
          <h2 className="font-display text-3xl">Welcome back, {firstName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {installationId
              ? "Here's the latest from your connected repositories."
              : "Connect the GitHub App to start getting AI reviews."}
          </p>
        </div>

        {!installationId ? (
          <Link
            href={DASHBOARD_ROUTES.github}
            className="group hover-lift flex items-center justify-between rounded-2xl border bg-card p-5"
          >
            <div>
              <p className="font-semibold">Connect GitHub</p>
              <p className="text-sm text-muted-foreground">
                Install the CodeLens app on your repositories.
              </p>
            </div>
            <ArrowRight className="size-5 text-brand transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={card.label}
              className="animate-fade-up group hover-lift rounded-2xl border bg-card p-5"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <span className="icon-tile flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <card.icon weight="duotone" className="size-5" />
                </span>
              </div>
              <p className="font-display mt-3 text-4xl">{card.value}</p>
            </div>
          ))}
        </div>

        {installationId ? (
          <div className="rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="font-semibold">Recent pull requests</h3>
              <Link
                href={DASHBOARD_ROUTES.pullRequest}
                className="link-underline text-sm text-brand"
              >
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                No pull requests yet. Open one in an installed repository and
                it will appear here.
              </p>
            ) : (
              <ul>
                {recent.slice(0, 5).map((pr) => (
                  <li
                    key={pr.id}
                    className="flex items-center justify-between gap-4 border-b px-5 py-3 text-sm transition-colors last:border-b-0 hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {pr.repoFullName}#{pr.prNumber}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {pr.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={statusBadge(
                          pr.status === "reviewed"
                            ? "success"
                            : pr.status === "failed"
                              ? "danger"
                              : pr.status === "processing"
                                ? "info"
                                : "neutral"
                        )}
                      >
                        {pr.status.replace("_", " ")}
                      </span>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {formatDistanceToNow(pr.updatedAt, { addSuffix: true })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
