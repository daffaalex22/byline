import type { PipelineResult, TrendResult } from '@/lib/pipeline/types'
import { getTrends } from '@/lib/pipeline/trends'
import { sendToFlowise } from '@/lib/pipeline/flowise'

export async function runPipeline(options?: {
  source?: string
}): Promise<PipelineResult> {
  const pipelineStart = Date.now()

  const payload = await getTrends(options?.source)
  const results: TrendResult[] = []

  for (const trend of payload.trends) {
    const trendStart = Date.now()

    try {
      const flowiseResponse = await sendToFlowise(
        trend,
        payload.runId,
        payload.source,
      )

      results.push({
        trendId: trend.id,
        trendTitle: trend.title,
        flowiseResponse,
        status: 'success',
        durationMs: Date.now() - trendStart,
      })
    } catch (error) {
      results.push({
        trendId: trend.id,
        trendTitle: trend.title,
        flowiseResponse: { text: '' },
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - trendStart,
      })
    }
  }

  const successCount = results.filter((r) => r.status === 'success').length
  const totalCount = results.length

  let status: PipelineResult['status']
  if (successCount === totalCount) {
    status = 'success'
  } else if (successCount > 0) {
    status = 'partial'
  } else {
    status = 'error'
  }

  return {
    runId: payload.runId,
    source: payload.source,
    trendsCount: totalCount,
    results,
    totalDurationMs: Date.now() - pipelineStart,
    status,
  }
}
