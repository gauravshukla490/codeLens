import Link from "next/link";
import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getInstallationStatus } from "@/features/github/server/installation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Settings · Dashboard",
};

const DashboardSettingsPage = async () => {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Settings"
        description="Your account and connected services."
      />
      <div className="grid gap-4 p-4 md:max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Signed in with GitHub.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              {session.user.name}
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              {session.user.email}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GitHub App</CardTitle>
            <CardDescription>
              {installation.connected
                ? `Installed on ${installation.accountLogin ?? "your account"}.`
                : "The GitHub App isn't installed yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <Link href={DASHBOARD_ROUTES.github} className="underline">
              Manage GitHub connection
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardSettingsPage;
