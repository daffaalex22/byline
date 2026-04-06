import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import ScrollSpy from '@/app/components/ScrollSpy'

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
    description: 'Virlo.ai surfaces the latest trends, which are triaged into live reporting threads.',
  },
  {
    step: '02',
    title: 'Story selection',
    description: 'Trends are filtered and scored to identify which ones are new, material, and worth creating a real piece rather than a summary.',
  },
  {
    step: '03',
    title: 'Structured drafting',
    description: 'Every draft is assembled with sourcing notes, chronology, and explicit claims before it becomes prose.',
  },
  {
    step: '04',
    title: 'Reader surface',
    description: 'The final output is published to the platform, landing as a calm, readable story package with context and evidence.',
  },
]

const archivePageSize = 4
const emptyLeadStory = {
  slug: '',
  title: 'The Byline front page is ready for your first published story',
  category: 'Top story',
  section: 'Newsroom',
  summary:
    'Once the Supabase articles table is seeded, this lead package will automatically pull in the latest published story.',
  body: [],
  image:
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
  imageAlt: 'A newsroom desk with papers and a laptop',
  author: 'Byline Desk',
  publishedAt: new Date().toISOString(),
  publishedAtLabel: 'Awaiting first publish',
  status: 'published' as const,
}

type HomePageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams
  const articles = await getAllArticles()
  const [leadStory = emptyLeadStory, ...archiveStories] = articles
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
          <ScrollSpy />
        </div>
      </header>

      <main>
        <section className="hero" id="top-story">
          {leadStory.image && (
            <div className="hero__image-wrap">
              <img
                className="hero__image"
                src={leadStory.image}
                alt={leadStory.imageAlt}
              />
            </div>
          )}
          <div className="hero__content fade-up">
            <h1>{leadStory.title}</h1>
            <p className="hero__summary">{leadStory.summary}</p>
            <div className="hero__actions">
              {leadStory.slug ? (
                <Link className="button button--solid" href={`/articles/${leadStory.slug}`}>
                  Read the lead story
                </Link>
              ) : (
                <a className="button button--solid" href="#launch">
                  Connect the article pipeline
                </a>
              )}
              <a className="button button--ghost" href="#method">
                See how publishing works
              </a>
            </div>
          </div>
        </section>

        <section className="front-grid" id="latest">
          <div className="front-grid__lead fade-up">
            <p className="section-label">Byline approach</p>
            <h2>Strong lead. Clear hierarchy. Stories selected by consequence, not chatter.</h2>
            <p>
              The first thing you feel is editorial confidence: a strong lead, clear hierarchy,
              and a sense that story selection is driven by consequence rather than chatter.
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
            <h2>A date-sorted archive. The reporting speaks for itself.</h2>
            <p>
              The featured story leads the homepage. Everything below is timestamped, orderly,
              and easy to scan.
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
                  <Link className="button button--ghost button--compact" href={`/?page=${safePage - 1}`} scroll={false}>
                    Newer
                  </Link>
                ) : (
                  <span className="button button--ghost button--compact button--disabled">Newer</span>
                )}
                {safePage < totalPages ? (
                  <Link className="button button--ghost button--compact" href={`/?page=${safePage + 1}`} scroll={false}>
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
            <h2>From trend to published story</h2>
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
          <h2>End-to-end AI. Open source, fully automated.</h2>
          <p>
            The whole pipeline is AI, end to end. The code is open source and available to explore.
          </p>
          <a className="code-pill" href="https://github.com/daffaalex22/byline" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Source Code
          </a>
        </section>
      </main>
    </div>
  )
}
