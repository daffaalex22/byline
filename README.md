# Byline

Byline is a newsroom-style Next.js app for publishing AI-assisted reporting with a clean editorial front page, individual article pages, and a protected publishing endpoint for automation workflows.

The project is built to feel more like a live news desk than a chatbot. Published stories are stored in Supabase, rendered on a date-sorted homepage, and exposed through article routes that can be updated by an external pipeline such as n8n, Flowise, or any scheduled job.

## Features

- News-style homepage with a lead story and paginated article archive
- Dynamic article pages at `/articles/[slug]`
- Supabase-backed article storage with public read access for published stories
- Protected `POST /api/publish` endpoint for automated publishing
- Seed script for loading sample content from local JSON into Supabase
- App Router setup with ISR-style revalidation for article reads

## Stack

- Next.js 15
- React 19
- TypeScript
- Supabase REST API

## Project Structure

```text
app/
  api/publish/route.ts       Protected publishing endpoint
  articles/[slug]/page.tsx  Article detail page
  layout.tsx                Root layout and metadata
  page.tsx                  Homepage and archive
data/
  articles.json             Seed content
lib/
  articles.ts               Supabase read/write helpers
  types.ts                  Shared article types
scripts/
  seed-supabase.mjs         Seeds sample articles into Supabase
supabase/
  articles.sql              Table schema and RLS policy
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project details:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PUBLISH_SECRET=replace-this-with-a-long-random-string
```

What each value is used for:

- `NEXT_PUBLIC_SUPABASE_URL`: Base URL for the Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key used for read-only article fetches
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side key used for seeding and publish upserts
- `PUBLISH_SECRET`: Shared secret required by `POST /api/publish`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and add your Supabase credentials.

3. In Supabase SQL Editor, run:

   ```sql
   -- file: supabase/articles.sql
   ```

   Then paste in the contents of `supabase/articles.sql`.

4. Seed the sample articles:

   ```bash
   npm run seed:supabase
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Data Model

Each article includes:

- `slug`
- `title`
- `summary`
- `body` as an array of paragraphs
- `section`
- `category`
- `image_url`
- `image_alt`
- `author`
- `published_at`
- `status` (`draft`, `published`, or `scheduled`)

The homepage and article routes only show articles with `status = 'published'`.

## Publishing API

Byline exposes a protected publishing endpoint:

```http
POST /api/publish
Content-Type: application/json
```

Required payload:

```json
{
  "secret": "your-publish-secret",
  "title": "Story title",
  "slug": "story-slug",
  "category": "Lead story",
  "section": "Tech",
  "summary": "One-paragraph summary.",
  "body": [
    "First paragraph.",
    "Second paragraph."
  ],
  "image": "https://images.example.com/story.jpg",
  "imageAlt": "Descriptive alt text",
  "author": "Byline Desk",
  "publishedAt": "2026-04-03T09:00:00.000Z",
  "status": "published"
}
```

Notes:

- The `secret` must match `PUBLISH_SECRET` on the server.
- Articles are upserted by `slug`.
- If `status` is omitted, the API defaults to `published`.
- The endpoint returns the saved article in the response body.

Example `curl` request:

```bash
curl -X POST http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "replace-this-with-your-secret",
    "title": "New article",
    "slug": "new-article",
    "category": "Analysis",
    "section": "World",
    "summary": "A concise summary.",
    "body": ["Paragraph one.", "Paragraph two."],
    "image": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Newsroom desk",
    "author": "Byline Desk",
    "publishedAt": "2026-04-03T09:00:00.000Z"
  }'
```

## Seeding Content

Sample stories live in `data/articles.json`. The seed script:

- reads the local JSON file
- maps fields into the Supabase table format
- upserts rows on `slug`

Run it with:

```bash
npm run seed:supabase
```

## Development Notes

- Article reads revalidate every 60 seconds
- Public reads are handled with the Supabase anon key
- Writes happen server-side with the service role key
- If no articles exist yet, the homepage shows a built-in fallback lead package

## Deployment

To deploy this app, make sure your hosting environment includes the same four environment variables from `.env.local`.

For production publishing workflows:

- keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
- use a strong `PUBLISH_SECRET`
- send publish requests only from trusted automation systems

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run seed:supabase
```
