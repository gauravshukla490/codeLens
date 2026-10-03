import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { UserMenuWithSession } from "@/features/auth/components/user-menu";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { SIGN_IN_PATH } from "@/features/auth/utils";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Install the GitHub App",
    body: "Sign in with GitHub and install CodeLens on the repositories you want reviewed.",
  },
  {
    title: "Open a pull request",
    body: "Every opened, updated or reopened PR is picked up automatically by a webhook.",
  },
  {
    title: "Get an AI review",
    body: "CodeLens reads the diff in a background job and posts a review comment on the PR.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Image src="/logo2.svg" alt="CodeLens" width={96} height={96} priority />
        <UserMenuWithSession variant="compact" />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-6 py-16">
        <section className="flex max-w-2xl flex-col gap-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            AI code reviews on every pull request.
          </h1>
          <p className="text-lg text-muted-foreground">
            CodeLens is a GitHub App that reviews your diffs for bugs, security
            issues and maintainability problems, then comments right on the PR.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={DASHBOARD_ROUTES.overview}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Go to dashboard
            </Link>
            <Link
              href={SIGN_IN_PATH}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Sign in with GitHub
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl border bg-card p-5">
              <span className="text-sm text-muted-foreground">0{i + 1}</span>
              <h2 className="mt-2 font-medium">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
