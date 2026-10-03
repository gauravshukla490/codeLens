import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  ChartLineUp,
  GitPullRequest,
  GithubLogo,
  Lightning,
  ShieldCheck,
  Sparkle,
  Stack,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { NavAuth } from "@/features/auth/components/nav-auth";
import { SIGN_IN_PATH } from "@/features/auth/utils";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    icon: GitPullRequest,
    title: "Reviews every pull request",
    body: "Opened, updated or reopened — CodeLens picks up the PR automatically and reviews the diff. No commands, no config files.",
  },
  {
    icon: Brain,
    title: "Feedback you can act on",
    body: "Each review opens with a one-line verdict, then splits into what looks good, suggestions and real issues, with the why and a suggested fix.",
  },
  {
    icon: ShieldCheck,
    title: "Catches what humans skim past",
    body: "Bugs, injection risks, unvalidated input, missing null checks, race conditions and performance traps are all on the checklist.",
  },
  {
    icon: Stack,
    title: "Repository-aware context",
    body: "Sync a repo and reviews can draw on the rest of your codebase, not just the lines that changed.",
  },
  {
    icon: Lightning,
    title: "Reliable background jobs",
    body: "Reviews run as durable background jobs with automatic retries, so a flaky API call never silently drops your PR.",
  },
  {
    icon: ChartLineUp,
    title: "A dashboard for every PR",
    body: "See every pull request and its status — pending, processing, reviewed or failed — and jump straight to it on GitHub.",
  },
];

const STEPS = [
  {
    title: "Connect GitHub",
    body: "Sign in with GitHub and install the CodeLens app on the repositories you choose. Revoke access any time.",
  },
  {
    title: "Open a pull request",
    body: "Push your branch as usual. A signature-verified webhook tells CodeLens the moment a PR changes.",
  },
  {
    title: "Get the review in the PR",
    body: "CodeLens analyses the diff and posts a structured review as a comment, right where your team already works.",
  },
];

const COMPARISON = [
  ["Waiting hours for a first look", "A first review lands on the PR within moments"],
  ["Reviewers skim large diffs", "Every changed file is checked, every time"],
  ["Feedback depends on who's free", "The same checklist applied to every PR"],
  ["Small bugs slip through to production", "Edge cases and risky patterns flagged before merge"],
];

const BENEFITS = [
  {
    title: "Merge with more confidence",
    body: "Surface bugs and security problems while the code is still in review, when they are cheapest to fix.",
  },
  {
    title: "Give your reviewers their time back",
    body: "Let CodeLens handle the first pass so humans can focus on design, intent and trade-offs.",
  },
  {
    title: "Raise the baseline for the whole team",
    body: "Explanations come with every finding, so each review quietly teaches better habits.",
  },
];

const FAQ = [
  {
    q: "How do I get started?",
    a: "Sign in with GitHub, install the CodeLens GitHub App on the repositories you want covered, and open a pull request. That's the whole setup.",
  },
  {
    q: "When does a review run?",
    a: "On every pull request that is opened, reopened, or updated with new commits.",
  },
  {
    q: "Can I turn it off?",
    a: "Yes. Disconnect the app from your dashboard, or remove it from your GitHub settings at any time.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
}) {
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wide text-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-lg text-muted-foreground">{body}</p>
      ) : null}
    </div>
  );
}

function ReviewMockup() {
  return (
    <div className="animate-float relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-brand/15 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-green-400/80" />
          <span className="ml-2 truncate text-xs text-muted-foreground">
            acme/api · Pull request #42
          </span>
        </div>
        <div className="space-y-4 p-5 text-sm">
          <div className="flex items-center gap-3">
            <span className="animate-pulse-ring flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkle weight="fill" className="size-4" />
            </span>
            <div>
              <p className="font-semibold">CodeLens</p>
              <p className="text-xs text-muted-foreground">
                reviewed this pull request
              </p>
            </div>
          </div>
          <p className="font-medium">
            Solid refactor overall — one correctness issue to fix before
            merging.
          </p>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400">
              🚨 Issue · payments/refund.ts
            </p>
            <p className="mt-1 text-muted-foreground">
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                amount / quantity
              </code>{" "}
              throws when quantity is 0. Guard it, or return early.
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              ⚠️ Suggestion · orders/list.ts
            </p>
            <p className="mt-1 text-muted-foreground">
              This loop queries per row. Batch it to avoid an N+1.
            </p>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400">
              ✅ Looks good
            </p>
            <p className="mt-1 text-muted-foreground">
              Clear naming and well-scoped functions throughout.
            </p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Illustrative example of a CodeLens review
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <NavAuth />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy-hero relative overflow-hidden">
          <div className="bg-grid absolute inset-0 -z-0" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <span
                className="animate-fade-up inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                <GithubLogo weight="fill" className="size-3.5 text-foreground" />
                AI code review for GitHub
              </span>
              <h1
                className="animate-fade-up font-display mt-6 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
                style={{ animationDelay: "80ms" }}
              >
                Every pull request,{" "}
                <em className="text-brand italic">reviewed</em> before anyone
                has to ask.
              </h1>
              <p
                className="animate-fade-up mt-6 max-w-xl text-lg text-muted-foreground"
                style={{ animationDelay: "160ms" }}
              >
                CodeLens is a GitHub App that reads your diffs, finds bugs,
                security risks and maintainability problems, and posts a clear
                review right on the PR — so your team ships faster with fewer
                surprises.
              </p>
              <div
                className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "240ms" }}
              >
                <Link
                  href={SIGN_IN_PATH}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-11 px-5 text-base"
                  )}
                >
                  Start with GitHub
                  <ArrowRight
                    weight="bold"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <a
                  href="#how"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5 text-base"
                  )}
                >
                  See how it works
                </a>
              </div>
              <ul
                className="animate-fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
                style={{ animationDelay: "320ms" }}
              >
                {[
                  "Works with any language",
                  "Nothing to configure",
                  "Revoke access anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check weight="bold" className="size-4 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <ReviewMockup />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-24">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionHeading
              eyebrow="Features"
              title={
                <>
                  Everything a great reviewer does,{" "}
                  <em className="text-brand">on every PR</em>
                </>
              }
              body="Built to sit quietly in your GitHub workflow and make every review sharper."
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="reveal group hover-lift rounded-2xl border bg-card p-6"
                >
                  <span className="icon-tile flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <feature.icon weight="duotone" className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 bg-muted/50 py-24">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionHeading
              eyebrow="How it works"
              title={
                <>
                  Up and running in <em className="text-brand">three steps</em>
                </>
              }
            />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="reveal hover-lift relative rounded-2xl border bg-card p-7"
                >
                  <span className="font-display text-6xl text-brand/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="scroll-mt-20 py-24">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-14 px-6 lg:grid-cols-2">
            <div className="reveal">
              <p className="text-sm font-semibold tracking-wide text-brand uppercase">
                Benefits
              </p>
              <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
                Spend review time on <em className="text-brand">what matters</em>
              </h2>
              <div className="mt-10 space-y-7">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="group flex gap-4">
                    <span className="icon-tile mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check weight="bold" className="size-4" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {benefit.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal overflow-hidden rounded-2xl border bg-card">
              <div className="grid grid-cols-2 border-b bg-muted/60 text-sm font-semibold">
                <div className="px-5 py-3 text-muted-foreground">Without CodeLens</div>
                <div className="px-5 py-3 text-brand">With CodeLens</div>
              </div>
              {COMPARISON.map(([before, after]) => (
                <div
                  key={before}
                  className="grid grid-cols-2 border-b text-sm transition-colors last:border-b-0 hover:bg-accent/50"
                >
                  <div className="flex gap-2 px-5 py-4 text-muted-foreground">
                    <X weight="bold" className="mt-0.5 size-4 shrink-0 text-red-500" />
                    {before}
                  </div>
                  <div className="flex gap-2 px-5 py-4">
                    <Check weight="bold" className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                    {after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-muted/50 py-24">
          <div className="mx-auto w-full max-w-3xl px-6">
            <SectionHeading eyebrow="FAQ" title="Quick answers" />
            <div className="mt-12 space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group reveal rounded-xl border bg-card px-5 py-4 transition-colors open:border-brand/40 hover:border-brand/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    {item.q}
                    <span className="ml-4 text-xl leading-none text-brand transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24">
          <div className="bg-navy-band reveal relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-16 text-center">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
            <h2 className="font-display relative text-4xl sm:text-5xl">
              Ready for calmer, sharper code reviews?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/75">
              Connect your GitHub account, install the app, and open your next
              pull request.
            </p>
            <Link
              href={SIGN_IN_PATH}
              className="group relative mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-base font-medium text-[oklch(0.24_0.08_262)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
            >
              Get started with GitHub
              <ArrowRight
                weight="bold"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} CodeLens. AI code review for GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
