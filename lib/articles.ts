import type { Article, ArticleRecord } from '@/lib/types'

type ArticleRow = {
  slug: string
  title: string
  category: string
  section: string
  summary: string
  body: string[]
  image_url?: string
  image_alt?: string
  author: string
  published_at: string
  status: 'draft' | 'published' | 'scheduled'
  trend_id?: string
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getSupabaseUrl() {
  return `${getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')}/rest/v1`
}

function getPublicHeaders() {
  const anonKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  }
}

function getAdminHeaders() {
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  }
}

function formatArticle(article: ArticleRecord): Article {
  return {
    ...article,
    status: article.status ?? 'published',
    publishedAtLabel: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date(article.publishedAt)),
  }
}

function mapRowToArticleRecord(row: ArticleRow): ArticleRecord {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    section: row.section,
    summary: row.summary,
    body: row.body,
    image: row.image_url,
    imageAlt: row.image_alt,
    author: row.author,
    publishedAt: row.published_at,
    status: row.status,
    trendId: row.trend_id,
  }
}

function mapArticleRecordToRow(article: ArticleRecord) {
  return {
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
    trend_id: article.trendId,
  }
}

export async function getAllArticles() {
  const response = await fetch(
    `${getSupabaseUrl()}/articles?select=slug,title,category,section,summary,body,image_url,image_alt,author,published_at,status,trend_id&status=eq.published&order=published_at.desc`,
    {
      headers: getPublicHeaders(),
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as ArticleRow[]
  return data.map((row) => formatArticle(mapRowToArticleRecord(row)))
}

export async function getArticleBySlug(slug: string) {
  const response = await fetch(
    `${getSupabaseUrl()}/articles?select=slug,title,category,section,summary,body,image_url,image_alt,author,published_at,status,trend_id&slug=eq.${encodeURIComponent(slug)}&status=eq.published`,
    {
      headers: {
        ...getPublicHeaders(),
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch article "${slug}": ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as ArticleRow[]

  if (!data) {
    return undefined
  }

  const article = data[0]

  if (!article) {
    return undefined
  }

  return formatArticle(mapRowToArticleRecord(article))
}

export async function getRelatedArticles(currentSlug: string, limit = 3) {
  const response = await fetch(
    `${getSupabaseUrl()}/articles?select=slug,title,category,section,summary,image_url,image_alt,author,published_at,status,trend_id&status=eq.published&slug=not.eq.${encodeURIComponent(currentSlug)}&order=published_at.desc&limit=${limit}`,
    {
      headers: getPublicHeaders(),
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch related articles: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as ArticleRow[]
  return data.map((row) => formatArticle(mapRowToArticleRecord(row)))
}

export async function publishArticle(article: ArticleRecord) {
  const response = await fetch(`${getSupabaseUrl()}/articles?on_conflict=slug`, {
    method: 'POST',
    headers: {
      ...getAdminHeaders(),
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(mapArticleRecordToRow(article)),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to publish article "${article.slug}": ${response.status} ${errorText}`)
  }

  const [data] = (await response.json()) as ArticleRow[]
  return formatArticle(mapRowToArticleRecord(data))
}
