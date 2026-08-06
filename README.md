# LMS — Loan Origination & Management Prototype

A thin-slice, end-to-end personal-loan lifecycle demo. Built with React 19, Fastify, Drizzle, and SQLite. One Node process serves the API and the SPA.

## Quick start

```bash
pnpm install
pnpm migrate
pnpm seed
pnpm dev
```

Then open <http://localhost:5173> (web) and <http://localhost:3000/api/health> (API).

## Seeded accounts

| Email             | Password   | Role       | Notes                                    |
|-------------------|------------|------------|------------------------------------------|
| mobasir@gmail.com | moba9811   | admin      | Underwriter view                         |
| alice@lms.dev     | alice123   | applicant  | No loans — fresh applicant               |
| bob@lms.dev       | bob123     | applicant  | Mid-flight loan (3 of 12 paid)           |

## Walkthrough (under 2 minutes)

1. Open `/`, sign up as a new applicant.
2. Apply: amount ₹50,000, term 12 months, rate 15%. Submit.
3. Open a second tab, sign in as `mobasir@gmail.com`.
4. Review the application → Approve → Disburse.
5. Back on the applicant tab, open the new loan → Pay EMI.

## Scripts

- `pnpm dev` — API + web concurrently
- `pnpm build` — builds web and API
- `pnpm migrate` — applies DB migrations
- `pnpm seed` — idempotent seed
- `pnpm test` — runs API tests
- `pnpm start` — runs the production server (also serves the built SPA)
- `pnpm typecheck` — typechecks everything

## Architecture

See [docs/hld/hld.md](docs/hld/hld.md) for the HLD and [docs/lld/lld.md](docs/lld/lld.md) for the LLD.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render, create a new Blueprint instance pointed at the repo. It picks up `render.yaml`.
3. Wait for first deploy. The seed runs on cold start; admin/lms accounts are created automatically.
4. Visit the URL on the Render dashboard.

The free tier has 1 GB of persistent disk; the SQLite file lives at `/data/lms.db`.