import { readFile } from 'node:fs/promises'
import path from 'node:path'
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
}

const articlesPath = path.join(process.cwd(), 'data', 'articles.json')
const file = await readFile(articlesPath, 'utf8')
const articles = JSON.parse(file)

const rows = articles.map((article) => ({
  slug: article.slug,
  title: article.title,
  category: article.category,
  section: article.section,
  summary: article.summary,
  body: article.body,
  image_url: article.image,
  image_alt: article.imageAlt,
  author: article.author,
  published_at: article.publishedAt,
  status: article.status ?? 'published',
}))

const response = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/articles?on_conflict=slug`,
  {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  },
)

if (!response.ok) {
  throw new Error(`Failed to seed Supabase: ${response.status} ${await response.text()}`)
}

const data = await response.json()
console.log(`Seeded ${data.length} articles into Supabase.`)
