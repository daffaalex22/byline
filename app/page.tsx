import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

const reportColumns = [
  {
    label: 'Explainers',
    headline: 'Why AI-native reporting should feel more like a beat desk than a chatbot',
    copy:
      'Readers do not want autocomplete pretending to be journalism. They want judgement, context, and a clean understanding of what matters.',
  },
  {
    label: 'Markets',
    headline: 'What a serious autonomous newsroom has to prove in the first 30 seconds',
    copy:
      'The interface has to signal care fast: sourced claims, visible editorial logic, and a feed organized around consequence rather than hype.',
  },
  {
    label: 'Policy',
    headline: 'The harder challenge is not generation. It is trust, selection, and restraint.',
    copy:
      'A credible news surface earns attention by showing why this story leads, what changed, and where the reporting came from.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Signal intake',
    description: 'Wire feeds, documents, transcripts, and social chatter are triaged into live reporting threads.',
  },
  {
    step: '02',
    title: 'Angle selection',
    description: 'The system scores what is new, what is material, and what deserves a real piece rather than a summary.',
  },
  {
    step: '03',
    title: 'Structured drafting',
    description: 'Every draft is assembled with sourcing notes, chronology, and explicit claims before it becomes prose.',
  },
  {
    step: '04',
    title: 'Reader surface',
    description: 'The final output lands as a calm, readable story package with context, evidence, and follow-on questions.',
  },
]

const archivePageSize = 4

type HomePageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams
  const articles = await getAllArticles()
  const [leadStory, ...archiveStories] = articles
  const currentPage = Math.max(1, Number.parseInt(page ?? '1', 10) || 1)
  const totalPages = Math.max(1, Math.ceil(archiveStories.length / archivePageSize))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedStories = archiveStories.slice(
    (safePage - 1) * archivePageSize,
    safePage * archivePageSize,
  )

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="masthead-row">
          <Link className="brand-mark" href="/" aria-label="Byline home">
            <span className="brand-mark__word">Byline</span>
            <span className="brand-mark__tag">AI-native reporting</span>
          </Link>
          <nav className="top-nav" aria-label="Primary">
            <a href="#top-story">Top story</a>
            <a href="#latest">Approach</a>
            <a href="#archive">Latest</a>
            <a href="#method">Method</a>
            <a href="#launch">Publishing</a>
          </nav>
        </div>
        <div className="edition-bar">
          <span>World</span>
          <span>Business</span>
          <span>Tech</span>
          <span>Climate</span>
          <span>Policy</span>
          <span>Opinion</span>
        </div>
      </header>

      <main>
        <section className="hero" id="top-story">
          <div className="hero__image-wrap">
            <img
              className="hero__image"
              src={leadStory.image}
              alt={leadStory.imageAlt}
            />
          </div>
          <div className="hero__content fade-up">
            <p className="eyebrow">{leadStory.category}</p>
            <h1>{leadStory.title}</h1>
            <p className="hero__summary">{leadStory.summary}</p>
            <div className="hero__actions">
              <Link className="button button--solid" href={`/articles/${leadStory.slug}`}>
                Read the lead story
              </Link>
              <a className="button button--ghost" href="#method">
                See how publishing works
              </a>
            </div>
          </div>
        </section>

        <section className="front-grid" id="latest">
          <div className="front-grid__lead fade-up">
            <p className="section-label">Byline approach</p>
            <h2>A front page designed like a newsroom, not a prompt box</h2>
            <p>
              The first thing readers should feel is editorial confidence: a strong lead, clear hierarchy,
              and a sense that the story selection is driven by consequence rather than chatter.
            </p>
          </div>
          <div className="front-grid__columns">
            {reportColumns.map((column, index) => (
              <article
                className="story-block fade-up"
                key={column.headline}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="story-block__label">{column.label}</p>
                <h3>{column.headline}</h3>
                <p>{column.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" id="archive">
          <div className="split-section__feature fade-up">
            <p className="section-label">Latest coverage</p>
            <h2>A plain date-sorted archive that lets the reporting carry the page</h2>
            <p>
              The featured story leads the homepage. Everything below it should read like a live news desk:
              timestamped, orderly, and easy to scan without repeating the hero.
            </p>
          </div>
          <div className="archive-list">
            {paginatedStories.map((story, index) => (
              <article
                className="archive-item fade-up"
                key={story.slug}
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <div className="archive-item__meta">
                  <p className="story-stack__desk">{story.section}</p>
                  <p>{story.publishedAtLabel}</p>
                </div>
                <h3 className="archive-item__title">
                  <Link href={`/articles/${story.slug}`}>{story.title}</Link>
                </h3>
                <p>{story.summary}</p>
              </article>
            ))}
            <div className="archive-pagination">
              <span className="archive-pagination__status">
                Page {safePage} of {totalPages}
              </span>
              <div className="archive-pagination__links">
                {safePage > 1 ? (
                  <Link className="button button--ghost button--compact" href={`/?page=${safePage - 1}#archive`}>
                    Newer
                  </Link>
                ) : (
                  <span className="button button--ghost button--compact button--disabled">Newer</span>
                )}
                {safePage < totalPages ? (
                  <Link className="button button--ghost button--compact" href={`/?page=${safePage + 1}#archive`}>
                    Older
                  </Link>
                ) : (
                  <span className="button button--ghost button--compact button--disabled">Older</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="process" id="method">
          <div className="process__intro fade-up">
            <p className="section-label">Editorial method</p>
            <h2>Automation should be visible in the workflow, not obvious in the writing</h2>
          </div>
          <div className="process__grid">
            {processSteps.map((item, index) => (
              <article
                className="process-card fade-up"
                key={item.step}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="process-card__step">{item.step}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="closing-banner fade-up" id="launch">
          <p className="section-label">Publishing systems</p>
          <h2>New stories can be published automatically from n8n, Flowise, or any scheduler.</h2>
          <p>
            The site already has article routes and a publish endpoint, so the reporting pipeline can post
            fresh stories on a schedule without touching the frontend presentation layer.
          </p>
          <code className="code-pill">POST /api/publish</code>
        </section>
      </main>
    </div>
  )
}
