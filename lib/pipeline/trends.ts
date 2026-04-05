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

async function fetchMockTrends(): Promise<VirloResponse> {
  return mockTrendsData as VirloResponse
}

function fetchCacheTrends(): VirloResponse {
  // TODO: Read from Supabase trend_snapshots table
  throw new Error('Cache source is not implemented yet.')
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getOptionalEnv(name: string): string | undefined {
  return process.env[name]
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

async function fetchWithKey(url: string, apiKey: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })
}

async function fetchLiveTrends(): Promise<VirloResponse> {
  const primaryKey = getRequiredEnv('VIRLO_API_KEY')
  const backupKey = getOptionalEnv('VIRLO_API_KEY_BACKUP')

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 2)

  const params = new URLSearchParams({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    limit: '50',
  })

  const url = `https://api.virlo.ai/v1/trends?${params}`

  const response = await fetchWithKey(url, primaryKey)

  if (!response.ok && backupKey) {
    const primaryError = `Primary: ${response.status} ${response.statusText}`
    const backupResponse = await fetchWithKey(url, backupKey)
    if (!backupResponse.ok) {
      throw new Error(`Virlo API errors - ${primaryError}; Backup: ${backupResponse.status} ${backupResponse.statusText}`)
    }
    console.warn(`Virlo API primary key failed (${primaryError}), using backup key`)
    return backupResponse.json() as Promise<VirloResponse>
  }

  if (!response.ok) {
    throw new Error(`Virlo API error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<VirloResponse>
}

export async function getTrends(sourceOverride?: string): Promise<TrendPayload> {
  const source = resolveSource(sourceOverride)

  let raw: VirloResponse

  switch (source) {
    case 'mock':
      raw = await fetchMockTrends()
      break
    case 'cache':
      raw = await fetchCacheTrends()
      break
    case 'live':
      raw = await fetchLiveTrends()
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
