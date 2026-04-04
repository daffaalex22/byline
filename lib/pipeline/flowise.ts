import type { NormalizedTrend, FlowiseResponse } from '@/lib/pipeline/types'

function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function trendToVars(
  trend: NormalizedTrend,
  runId: string,
  source: string,
): Record<string, string> {
  return {
    run_id: runId,
    source,
    trend_id: trend.id,
    trend_title: trend.title,
    trend_summary: trend.summary,
    trend_type: trend.type,
    trend_ranking: String(trend.ranking),
    group_id: trend.groupId,
    group_title: trend.groupTitle,
  }
}

export async function sendToFlowise(
  trend: NormalizedTrend,
  runId: string,
  source: string,
): Promise<FlowiseResponse> {
  const url = getRequiredEnv('FLOWISE_API_URL')
  const vars = trendToVars(trend, runId, source)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: `Generate a report for the following trend: ${trend.title}`,
      overrideConfig: { vars },
    }),
    signal: AbortSignal.timeout(120_000),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Flowise error ${response.status}: ${errorText}`)
  }

  return response.json() as Promise<FlowiseResponse>
}
