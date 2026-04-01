import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { Article, ArticleRecord } from '@/lib/types'

const articlesPath = path.join(process.cwd(), 'data', 'articles.json')

function formatArticle(article: ArticleRecord): Article {
  return {
    ...article,
    publishedAtLabel: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date(article.publishedAt)),
  }
}

async function readArticleRecords() {
  const file = await fs.readFile(articlesPath, 'utf8')
  return JSON.parse(file) as ArticleRecord[]
}

async function writeArticleRecords(articles: ArticleRecord[]) {
  await fs.writeFile(articlesPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
}

export async function getAllArticles() {
  const articles = await readArticleRecords()

  return articles
    .sort((left, right) => {
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    })
    .map(formatArticle)
}

export async function getArticleBySlug(slug: string) {
  const articles = await getAllArticles()
  return articles.find((article) => article.slug === slug)
}

export async function publishArticle(article: ArticleRecord) {
  const articles = await readArticleRecords()
  const existingIndex = articles.findIndex((entry) => entry.slug === article.slug)

  if (existingIndex >= 0) {
    articles[existingIndex] = article
  } else {
    articles.unshift(article)
  }

  await writeArticleRecords(articles)
  return formatArticle(article)
}
