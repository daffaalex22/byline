import { NextResponse } from 'next/server'
import { getTrends } from '@/lib/pipeline/trends'

type DispatchPayload = {
  secret?: string
  source?: string
  limit?: number
}

export async function POST(request: Request) {
  let payload: DispatchPayload

  try {
    payload = (await request.json()) as DispatchPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const expectedSecret = process.env.PIPELINE_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'PIPELINE_SECRET is not configured on the server.' },
      { status: 500 },
    )
  }

  if (payload.secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized dispatch request.' },
      { status: 401 },
    )
  }

  try {
    const trendPayload = await getTrends(payload.source)

    // Strip the `raw` field to keep the response small for GitHub Actions matrix
    let trends = trendPayload.trends.map(({ raw: _, ...trend }) => trend)

    // Apply optional limit (trends are already sorted by ranking)
    if (payload.limit && payload.limit > 0) {
      trends = trends.slice(0, payload.limit)
    }

    return NextResponse.json({
      runId: trendPayload.runId,
      source: trendPayload.source,
      generatedAt: trendPayload.generatedAt,
      trendCount: trends.length,
      trends,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch trends.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
