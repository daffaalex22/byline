export type ArticleRecord = {
  slug: string
  title: string
  category: string
  section: string
  summary: string
  body: string[]
  image?: string
  imageAlt?: string
  author: string
  publishedAt: string
  status?: 'draft' | 'published' | 'scheduled'
  trendId?: string
}

export type Article = ArticleRecord & {
  publishedAtLabel: string
}
