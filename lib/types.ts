export type ArticleRecord = {
  slug: string
  title: string
  category: string
  section: string
  summary: string
  body: string[]
  image: string
  imageAlt: string
  author: string
  publishedAt: string
}

export type Article = ArticleRecord & {
  publishedAtLabel: string
}
