import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/lib/articles'
import ReadingProgress from '@/app/components/ReadingProgress'
import BackToTop from '@/app/components/BackToTop'
import StickyNav from '@/app/components/StickyNav'

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
          <div className="article-nav__crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{article.section}</span>
          </div>
        </div>
        <nav className="article-nav__links">
          <Link href="/#archive">Latest</Link>
          <Link href="/#method">Method</Link>
        </nav>
      </header>

      <div className="article-page__hero">
        <div className="article-page__hero-copy">
          <p className="eyebrow">{article.section}</p>
          <h1>{article.title}</h1>
          <p className="article-page__dek">{article.summary}</p>
        </div>
        <div className="article-page__meta">
          <span>{article.author}</span>
          <span>{article.publishedAtLabel}</span>
        </div>
      </div>

      {article.image && (
        <div className="article-page__image-wrap">
          <img className="article-page__image" src={article.image} alt={article.imageAlt ?? ''} />
        </div>
      )}

      <article className="article-body">
        <p className="article-body__lede">{article.summary}</p>
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </main>
  )
}
