<div align="center">

<img src="codelens/public/logo2.svg" alt="CodeLens logo" width="72" />

# CodeLens

**AI pull-request reviews that land on GitHub seconds after you push.**

Install the CodeLens GitHub App on a repository, open a pull request, and CodeLens reads the diff, reviews it for bugs, security holes, performance traps and readability issues, and posts a structured review straight into the PR conversation.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Neon-Postgres-00E599?logo=postgresql&logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-background_jobs-6366F1)
![Pinecone](https://img.shields.io/badge/Pinecone-vector_DB-000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

<!-- TODO: add live demo link → [**Live demo**](https://your-deployment.vercel.app) · -->
[Features](#-features) · [How it works](#-how-it-works) · [Getting started](#-getting-started) · [Roadmap](#-roadmap)

</div>

<!-- TODO: replace with a real screenshot or GIF of a review comment on a PR -->
<!-- ![CodeLens reviewing a pull request](docs/screenshots/pr-review.png) -->

---

## ✨ Features

- **Automatic PR reviews** — every time a pull request is `opened`, `reopened` or gets new commits (`synchronize`), CodeLens reviews it. No buttons to press.
- **Structured, actionable feedback** — each review starts with a one-line verdict, then splits findings into ✅ *What looks good*, ⚠️ *Suggestions* (non-blocking) and 🚨 *Issues* (should fix before merge). Clean diffs get a short "looks good" instead of invented nitpicks.
- **Reviews across six dimensions** — correctness, security, performance, reliability, readability and maintainability.
- **Native GitHub App** — installs per repository, authenticates as an installation, verifies every webhook signature (`x-hub-signature-256`) and comments as the app, not as you.
- **Durable background pipeline** — reviews run as multi-step [Inngest](https://www.inngest.com) functions with automatic retries; a PR can never get stuck in "processing" because a failure handler marks it `failed`.
- **Codebase indexing** — sync a repository's default branch into a Pinecone vector index, laying the groundwork for reviews that understand the rest of your code, not just the diff.
- **Dashboard** — sign in with GitHub to see review stats (total, reviewed, in progress, needs attention), every reviewed PR with its full AI review, your connected repositories and their sync status.
- **Polished UI** — shadcn/ui components, light and dark mode, and a marketing home page.

<!-- TODO: dashboard screenshot -->
<!-- ![Dashboard overview](docs/screenshots/dashboard.png) -->

## 🧠 How it works

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant GH as GitHub
    participant API as CodeLens<br/>/api/github/webhook
    participant DB as Postgres (Neon)
    participant Q as Inngest
    participant LLM as LLM (OpenRouter)

    Dev->>GH: Open / update pull request
    GH->>API: pull_request webhook (signed)
    API->>API: Verify signature, filter action
    API->>DB: Upsert PullRequest (status: pending)
    API->>Q: send "github/pr.received"
    API-->>GH: 200 OK (fast ack)
    Q->>DB: status → processing
    Q->>GH: Fetch changed files + patches
    Q->>LLM: Diff + review prompt
    LLM-->>Q: Markdown review
    Q->>GH: Post review as PR comment
    Q->>DB: status → reviewed, save review
```

The webhook handler only validates and enqueues, so GitHub always gets a quick response. The slow work — fetching the diff, calling the model, commenting — happens in the `review-pull-request` Inngest function, where each step is retried independently.

**Repository sync** follows the same pattern: clicking *Sync* on the Repositories page fires `repo/sync.requested`, and the `sync-repo-codebase` function walks the branch's git tree, keeps source files (skipping `node_modules`, `dist`, `.next`, generated code and files over 100 KB), splits them into 80-line chunks and upserts them into a per-repo Pinecone namespace. Re-syncing replaces the old vectors.

### Pull request lifecycle

| Status | Meaning |
| --- | --- |
| `pending` | Webhook received, job queued |
| `processing` | Diff fetched, review being generated |
| `reviewed` | Review posted to GitHub and saved |
| `failed` | All retries exhausted |
| `rate_limited` | Model provider throttled the request |

## 🛠 Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, server actions, `proxy.ts`), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Base UI, Phosphor & Lucide icons, Recharts, next-themes, Sonner |
| Data fetching | TanStack Query |
| Auth | Better Auth (GitHub OAuth) |
| Database | PostgreSQL on Neon, Prisma 7 with the `pg` driver adapter |
| GitHub | GitHub App via Octokit (webhooks, installation tokens, REST API) |
| Background jobs | Inngest |
| AI | Vercel AI SDK + OpenRouter provider |
| Vector search | Pinecone (integrated embeddings) |

## 📁 Project structure

The app lives in the `codelens/` folder and is organised by feature:

```
codelens/
├── app/
│   ├── (auth)/sign-in/            # GitHub sign-in page
│   ├── (protected)/dashboard/     # overview, pull-request, repos, github, settings
│   ├── api/
│   │   ├── auth/[...all]/         # Better Auth handler
│   │   ├── github/webhook/        # GitHub App webhook receiver
│   │   ├── github/callback/       # GitHub App install/setup callback
│   │   └── inngest/               # Inngest function endpoint
│   └── page.tsx                   # marketing home page
├── features/
│   ├── ai/                        # OpenRouter client
│   ├── auth/                      # session helpers, sign-in form, route guard
│   ├── dashboard/                 # shell, sidebar, routes, status badges
│   ├── github/                    # GitHub App client, webhook handler, installations, repo list
│   ├── inngest/                   # Inngest client
│   ├── pinecone/                  # Pinecone client
│   ├── repo-sync/                 # codebase fetch → chunk → upsert pipeline
│   └── reviews/                   # PR files, review generation, PR comments, stats
├── lib/                           # auth config, Prisma client, utils
├── prisma/                        # schema + migrations
└── proxy.ts                       # protects /dashboard and /sign-in
```

## 🚀 Getting started

### Prerequisites

- **Node.js 20+** and npm
- A **PostgreSQL** database (a free [Neon](https://neon.tech) project works well)
- A **GitHub account** to create an OAuth App and a GitHub App
- An **[OpenRouter](https://openrouter.ai)** API key
- A **[Pinecone](https://www.pinecone.io)** account (only needed for repository sync)
- A tunnel such as [ngrok](https://ngrok.com) or [smee.io](https://smee.io) so GitHub can reach your local webhook

### 1. Clone and install

```bash
git clone https://github.com/gauravshukla490/codeLens.git
cd codeLens/codelens
npm install
```

### 2. Configure environment variables

Create `codelens/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="generate-a-long-random-string"

# GitHub OAuth App (sign in)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# GitHub App (reviews)
GITHUB_APP_ID=""
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=""

# AI
OPENROUTER_API_KEY=""

# Pinecone (repository sync)
PINECONE_API_KEY=""
PINECONE_INDEX="codelens"
```

> The private key can be pasted on one line with `\n` in place of newlines — the app converts them back.

### 3. Set up the database

```bash
npx prisma migrate deploy   # apply migrations
npx prisma generate         # generates the client into lib/generated/prisma
```

### 4. Create a GitHub OAuth App (for sign-in)

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**

- **Homepage URL:** `http://localhost:3000`
- **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`

Copy the client ID and secret into `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`.

### 5. Create a GitHub App (for reviews)

GitHub → **Settings → Developer settings → GitHub Apps → New GitHub App**

| Setting | Value |
| --- | --- |
| Webhook URL | `https://<your-tunnel>/api/github/webhook` |
| Webhook secret | any random string → `GITHUB_WEBHOOK_SECRET` |
| Setup URL (post-install redirect) | `http://localhost:3000/api/github/callback` |
| Repository permissions | **Contents:** Read · **Pull requests:** Read & write · **Metadata:** Read |
| Subscribe to events | **Pull request** |

Then generate a private key (→ `GITHUB_APP_PRIVATE_KEY`) and copy the App ID (→ `GITHUB_APP_ID`).

> ⚠️ The install link uses the app slug `shukla-pr-reviewer` in `features/github/utils/github-app.ts`. If you create your own app, change that slug to yours.

### 6. Create a Pinecone index (optional, for repo sync)

Create an index **with integrated embeddings** (for example `llama-text-embed-v2`) and set the field map so the embedded field is `text`. Put its name in `PINECONE_INDEX`.

### 7. Run everything

You need three processes:

```bash
# terminal 1 — the app
npm run dev

# terminal 2 — Inngest dev server (runs the background jobs)
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest

# terminal 3 — expose port 3000 for GitHub webhooks
ngrok http 3000
```

Open **http://localhost:3000**, sign in with GitHub, go to **Dashboard → GitHub** and install the app on a test repository. Open a pull request there — within a few seconds a CodeLens review should appear on it, and the PR will show up on the dashboard. The Inngest dev UI at **http://localhost:8288** shows each run step by step.

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## ☁️ Deployment

CodeLens deploys cleanly to [Vercel](https://vercel.com):

1. Import the repo and set the **root directory** to `codelens`.
2. Add every variable from `.env`, with `BETTER_AUTH_URL` set to your production URL.
3. Connect the project to [Inngest Cloud](https://www.inngest.com) (the Vercel integration adds `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`).
4. Point the GitHub App's webhook and setup URLs, and the OAuth App's callback URL, at the production domain.

## 🗺 Roadmap

- [x] GitHub sign-in and protected dashboard
- [x] GitHub App installation flow and verified webhooks
- [x] Background review pipeline with retries and failure handling
- [x] AI review posted as a PR comment
- [x] Repository sync into Pinecone
- [x] Dashboard redesign with dark mode
- [ ] **Context-aware reviews** — retrieve related code from the synced Pinecone namespace and pass it into the review prompt (the prompt builder already accepts it)
- [ ] Inline, line-level review comments instead of a single summary comment
- [ ] Re-sync automatically on pushes to the default branch
- [ ] Choose the review model per repository from Settings
- [ ] Handle PRs with more than 100 changed files and repos with more than 200 indexable files
- [ ] Per-repo review rules (ignore paths, severity threshold, custom guidelines)

## 🤝 Contributing

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Commit using [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, …), matching the existing history
3. Run `npm run lint` and make sure the app builds
4. Open a pull request — CodeLens will review it 😉

## 👥 Team

<!-- TODO: confirm names, roles and links -->
| Name | GitHub |
| --- | --- |
| Gaurav Shukla | [@gauravshukla490](https://github.com/gauravshukla490) |
| Tushar Kumar | [@tushar-41](https://github.com/tushar-41) |

