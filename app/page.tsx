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

export default async function HomePage() {
  const articles = await getAllArticles()
  const [leadStory, ...latestStories] = articles

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
            <a href="#latest">Latest</a>
            <a href="#method">Method</a>
            <a href="#launch">Publish API</a>
          </nav>
        </div>
        <div className="edition-bar">
          <span>Hackathon edition</span>
          <span>Autonomous newsroom prototype</span>
          <span>Serious stories, no human editorial bottleneck</span>
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
            <p className="section-label">What makes this different</p>
            <h2>A front page designed like a newsroom, not a prompt box</h2>
            <p>
              The first thing readers should feel is editorial confidence. The first thing judges should
              see is that the product knows how to present consequence, hierarchy, and depth.
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

        <section className="split-section">
          <div className="split-section__feature fade-up">
            <p className="section-label">Latest coverage</p>
            <h2>The page should immediately answer what changed and why it matters</h2>
            <p>
              Byline is built around article packages that can stand on their own: a clear nut graph,
              supporting context, and visible sourcing logic that makes the output feel reportorial.
            </p>
          </div>
          <div className="story-stack">
            {latestStories.map((story, index) => (
              <article
                className="story-stack__item fade-up"
                key={story.slug}
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <p className="story-stack__desk">{story.section}</p>
                <h3>
                  <Link href={`/articles/${story.slug}`}>{story.title}</Link>
                </h3>
              </article>
            ))}
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
          <p className="section-label">Automation ready</p>
          <h2>Publish new stories by posting JSON from n8n, Flowise, or any scheduler.</h2>
          <p>
            The app now has article routes and a publish endpoint, so your workflow can generate a story
            on a daily cadence and push it into the site without touching the frontend.
          </p>
          <code className="code-pill">POST /api/publish</code>
        </section>
      </main>
    </div>
  )
}
