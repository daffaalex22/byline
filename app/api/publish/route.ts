import { NextResponse } from 'next/server'
import { publishArticle } from '@/lib/articles'

type PublishPayload = {
  secret?: string
  title?: string
  slug?: string
  category?: string
  section?: string
  summary?: string
  body?: string[]
  image?: string
  imageAlt?: string
  author?: string
  publishedAt?: string
  status?: 'draft' | 'published' | 'scheduled'
}

export async function POST(request: Request) {
  let payload: PublishPayload

  try {
    payload = (await request.json()) as PublishPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const expectedSecret = process.env.PUBLISH_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'PUBLISH_SECRET is not configured on the server.' },
      { status: 500 },
    )
  }

  if (payload.secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized publish request.' }, { status: 401 })
  }

  if (
    !payload.title ||
    !payload.slug ||
    !payload.summary ||
    !payload.section ||
    !payload.category ||
    !payload.author ||
    !payload.publishedAt ||
    !Array.isArray(payload.body) ||
    payload.body.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          'Missing required fields. Expected title, slug, summary, section, category, author, publishedAt, and a non-empty body array.',
      },
      { status: 400 },
    )
  }

  const article = await publishArticle({
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    section: payload.section,
    summary: payload.summary,
    body: payload.body,
    image: payload.image,
    imageAlt: payload.imageAlt,
    author: payload.author,
    publishedAt: payload.publishedAt,
    status: payload.status ?? 'published',
  })

  return NextResponse.json(
    {
      message: 'Article published successfully.',
      article,
    },
    { status: 201 },
  )
}
