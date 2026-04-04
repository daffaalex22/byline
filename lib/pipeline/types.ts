// ── Virlo raw API types (matches /v1/trends response) ──

export type VirloTrend = {
  id: string
  name: string
  description: string
  trend_type: string
}

export type VirloTrendEntry = {
  id: string
  trend_id: string
  trend_group_id: string
  ranking: number
  trend: VirloTrend
}

export type VirloTrendGroup = {
  id: string
  title: string
  trends: VirloTrendEntry[]
}

export type VirloResponse = {
  data: VirloTrendGroup[]
}

// ── Normalized types (what the pipeline works with) ──

export type NormalizedTrend = {
  id: string
  title: string
  summary: string
  type: string
  ranking: number
  groupId: string
  groupTitle: string
  raw: VirloTrendEntry
}

export type TrendPayload = {
  runId: string
  source: 'mock' | 'cache' | 'live'
  generatedAt: string
  trends: NormalizedTrend[]
}

// ── Flowise types ──

export type FlowiseResponse = {
  text: string
  chatId?: string
  chatMessageId?: string
  sessionId?: string
  [key: string]: unknown
}

// ── Pipeline result ──

export type TrendResult = {
  trendId: string
  trendTitle: string
  flowiseResponse: FlowiseResponse
  status: 'success' | 'error'
  error?: string
  durationMs: number
}

export type PipelineResult = {
  runId: string
  source: 'mock' | 'cache' | 'live'
  trendsCount: number
  results: TrendResult[]
  totalDurationMs: number
  status: 'success' | 'partial' | 'error'
}
