import Link from 'next/link'
import type { Article } from '@/lib/types'

type RelatedArticlesProps = {
  articles: Article[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="related-articles" aria-label="Related articles">
      <h2 className="related-articles__heading">More in Latest</h2>
      <div className="related-articles__grid">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="related-article">
            {article.image && (
              <div className="related-article__image-wrap">
                <img
                  src={article.image}
                  alt={article.imageAlt ?? ''}
                  className="related-article__image"
                />
              </div>
            )}
            <div className="related-article__content">
              <span className="related-article__section">{article.section}</span>
              <h3 className="related-article__title">{article.title}</h3>
              <span className="related-article__author">{article.author}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
