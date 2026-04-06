import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import ReadingProgress from '@/app/components/ReadingProgress'
import BackToTop from '@/app/components/BackToTop'
import StickyNav from '@/app/components/StickyNav'
import RelatedArticles from '@/app/components/RelatedArticles'
import ShareButtons from '@/app/components/ShareButtons'
import ArticleImage from '@/app/components/ArticleImage'

type ArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article not found | Byline',
    }
  }

  return {
    title: `${article.title} | Byline`,
    description: article.summary,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, article.section)

  const wordCount = article.body.join(' ').split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main className="article-page">
      <ReadingProgress />
      <BackToTop />
      <StickyNav title={article.title} />
      <header className="article-nav" aria-label="Article navigation">
        <div className="article-nav__brand">
          <Link className="article-nav__logo" href="/">
            Byline
          </Link>
        </div>
        <nav className="article-nav__links">
          <Link href="/#archive">Latest</Link>
          <Link href="/#method">Method</Link>
        </nav>
      </header>

      <div className="article-page__hero">
        <div className="article-page__hero-copy">
          <h1>{article.title}</h1>
          <p className="article-page__dek">{article.summary}</p>
          <div className="article-page__actions">
            <ShareButtons article={article} />
          </div>
        </div>
        <div className="article-page__meta">
          <span>{article.author}</span>
          <span>{readingTime} min read</span>
          <span>{article.publishedAtLabel}</span>
        </div>
      </div>

      {article.image && (
        <ArticleImage src={article.image} alt={article.imageAlt ?? ''} />
      )}

      <article className="article-body">
        <p className="article-body__lede">{article.summary}</p>
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
      <RelatedArticles articles={relatedArticles} />
    </main>
  )
}
