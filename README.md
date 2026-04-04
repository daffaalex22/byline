# Byline

Byline is a newsroom-style Next.js app for publishing AI-assisted reporting with a clean editorial front page, individual article pages, and a protected publishing endpoint for automation workflows.

The project is built to feel more like a live news desk than a chatbot. Published stories are stored in Supabase, rendered on a date-sorted homepage, and exposed through article routes that can be updated by an external pipeline such as n8n, Flowise, or any scheduled job.

## Table of Contents

- [Features](#features)
- [Stack](#stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Data Model](#data-model)
- [Publishing API](#publishing-api)
- [Seeding Content](#seeding-content)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features

- News-style homepage with a lead story and paginated article archive
- Dynamic article pages at `/articles/[slug]`
- Supabase-backed article storage with public read access for published stories
- Protected `POST /api/publish` endpoint for automated publishing
- **AI Trends Pipeline**: Extract trends via Flowise integration
- Seed script for loading sample content from local JSON into Supabase
- App Router setup with ISR-style revalidation for article reads

## Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + REST API)
- **AI Integration**: Flowise

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd byline
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment:
   Copy `.env.example` to `.env.local` and fill in your Supabase and Flowise credentials.

### Database Setup

In your Supabase SQL Editor, run the contents of `supabase/articles.sql` to create the required table and RLS policies.

### Running Locally

1. Seed initial data (optional):
   ```bash
   npm run seed:supabase
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
app/
  api/
    internal/pipeline/run/route.ts  # Internal trend processing endpoint
    publish/route.ts                # Article publishing endpoint
  articles/[slug]/page.tsx          # Article detail page
  layout.tsx                        # Root layout and metadata
  page.tsx                          # Homepage and archive
data/
  articles.json                     # Seed content for stories
  mock-trends.json                  # Mock data for trend processing
lib/
  pipeline/                         # Trends processing pipeline
    flowise.ts                      # Flowise API client
    runner.ts                       # Pipeline execution logic
    trends.ts                       # Trend extraction logic
    types.ts                        # Pipeline type definitions
  articles.ts                       # Supabase read/write helpers
  types.ts                          # Shared article types
scripts/
  seed-supabase.mjs                 # Seeds sample articles into Supabase
supabase/
  articles.sql                      # Table schema and RLS policy
```

## Available Scripts

| Script | Command | Directory | Description |
|--------|---------|-----------|-------------|
| `dev` | `next dev` | Root | Starts the Next.js development server |
| `build` | `next build` | Root | Builds the application for production |
| `start` | `next start` | Root | Starts the production server |
| `lint` | `next lint` | Root | Runs ESLint for code quality checks |
| `seed:supabase` | `node --env-file=.env.local scripts/seed-supabase.mjs` | Root | Seeds sample articles into Supabase |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Base URL for your Supabase project (from Project Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public key for read-only fetches from the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side secret key for administrative tasks (seeding/publishing) |
| `PUBLISH_SECRET` | Yes | A random string required to authorize requests to `/api/publish` |
| `FLOWISE_API_URL` | No | The API endpoint for your Flowise chatflow |
| `PIPELINE_SECRET` | No | Authorization secret for triggering the internal trends pipeline |
| `TREND_SOURCE` | No | Determines trend data source (`mock`, `cache`, or `live`). Defaults to `mock`. |

## Development

### Workflow

1. Create a feature branch from `main`.
2. Run `npm run dev` to test changes locally.
3. Ensure no linting errors by running `npm run lint`.
4. Testing the pipeline: Payload requires `secret` matching `PIPELINE_SECRET`.

### Code Quality

All code should be written in TypeScript. Use the shared types in `lib/types.ts` and `lib/pipeline/types.ts` where appropriate.

## Deployment

### Web Application

1. Deploy the `main` branch to a provider like **Vercel** or **Netlify**.
2. Add all environment variables listed in `.env.example` to your deployment settings.

### Database

Ensure you have run the migrations in `supabase/articles.sql` on your production Supabase instance.

## Data Model

Each article include:

- `slug`, `title`, `summary`, `body` (array), `section`, `category`, `image_url`, `image_alt`, `author`, `published_at`, `status`.

The homepage and article routes only show articles with `status = 'published'`.

## Publishing API

Byline exposes a protected publishing endpoint: `POST /api/publish`.

Required payload example:
```json
{
  "secret": "your-publish-secret",
  "title": "Story title",
  "slug": "story-slug",
  "status": "published"
}
```

Articles are upserted by `slug`. The `secret` must match `PUBLISH_SECRET` on the server.

## Seeding Content

Sample stories live in `data/articles.json`. The seed script reads the local JSON and upserts rows into Supabase.

Run it with:
```bash
npm run seed:supabase
```

## Development Notes

- Article reads revalidate every 60 seconds (ISR).
- Public reads use the Supabase anon key; writes use the service role key.
- If no articles exist, the homepage shows a built-in fallback lead package.

## Troubleshooting

| Issue | Potential Cause | Fix |
|-------|-----------------|-----|
| 401 Unauthorized on Publish | Missing or incorrect `PUBLISH_SECRET` | Verify your `.env.local` matches the payload secret. |
| 500 Internal Server Error (Pipeline) | `PIPELINE_SECRET` not set | Ensure `PIPELINE_SECRET` is configured in the environment. |
| Supabase Auth Failures | Service role key used in client | Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client fetches. |
| Missing Article Images | Invalid URL or RLS policies | Check the `image_url` and ensure Supabase storage permissions allow access if self-hosting. |
