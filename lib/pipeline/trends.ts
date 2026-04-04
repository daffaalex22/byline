import type {
  VirloResponse,
  VirloTrendGroup,
  NormalizedTrend,
  TrendPayload,
} from '@/lib/pipeline/types'

import mockTrendsData from '@/data/mock-trends.json'

type TrendSource = 'mock' | 'cache' | 'live'

function resolveSource(override?: string): TrendSource {
  const source = override ?? process.env.TREND_SOURCE ?? 'mock'

  if (source === 'mock' || source === 'cache' || source === 'live') {
    return source
  }

  return 'mock'
}

function generateRunId(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '_')
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `run_${date}_${seq}`
}

function normalizeGroup(group: VirloTrendGroup): NormalizedTrend[] {
  return group.trends.map((entry) => ({
    id: entry.trend.id,
    title: entry.trend.name,
    summary: entry.trend.description,
    type: entry.trend.trend_type,
    ranking: entry.ranking,
    groupId: group.id,
    groupTitle: group.title,
    raw: entry,
  }))
}

function normalizeTrends(response: VirloResponse): NormalizedTrend[] {
  const allTrends = response.data.flatMap(normalizeGroup)
  return allTrends.sort((a, b) => a.ranking - b.ranking)
}

function fetchMockTrends(): VirloResponse {
  return mockTrendsData as VirloResponse
}

function fetchCacheTrends(): VirloResponse {
  // TODO: Read from Supabase trend_snapshots table
  throw new Error('Cache source is not implemented yet.')
}

function fetchLiveTrends(): VirloResponse {
  // TODO: Call GET https://api.virlo.ai/v1/trends with VIRLO_API_KEY
  throw new Error('Live source is not implemented yet.')
}

export async function getTrends(sourceOverride?: string): Promise<TrendPayload> {
  const source = resolveSource(sourceOverride)

  let raw: VirloResponse

  switch (source) {
    case 'mock':
      raw = fetchMockTrends()
      break
    case 'cache':
      raw = fetchCacheTrends()
      break
    case 'live':
      raw = fetchLiveTrends()
      break
  }

  const trends = normalizeTrends(raw)

  return {
    runId: generateRunId(),
    source,
    generatedAt: new Date().toISOString(),
    trends,
  }
}
