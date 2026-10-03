"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { cn } from "@/lib/utils";
import { SIGN_IN_PATH } from "../utils";

/** Marketing-nav actions: Dashboard when signed in, Sign in / Get started otherwise. */
export function NavAuth() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-8 w-24" aria-hidden />;
  }

  if (session?.user) {
    return (
      <Link href={DASHBOARD_ROUTES.overview} className={cn(buttonVariants())}>
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={SIGN_IN_PATH}
        className="hidden px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
      >
        Sign in
      </Link>
      <Link href={SIGN_IN_PATH} className={cn(buttonVariants())}>
        Get started
      </Link>
    </div>
  );
}
