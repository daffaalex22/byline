import type { PipelineResult, TrendResult } from '@/lib/pipeline/types'
import { getTrends } from '@/lib/pipeline/trends'
import { sendToFlowise, FlowiseError } from '@/lib/pipeline/flowise'

function isRetryableError(error: unknown): boolean {
  if (error instanceof FlowiseError) {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
    return retryableStatusCodes.includes(error.statusCode)
  }
  return false
}

async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      const shouldRetry = attempt < maxRetries && isRetryableError(error)
      if (shouldRetry) {
        const delay = baseDelayMs * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else if (!isRetryableError(error)) {
        throw error
      }
    }
  }

  throw lastError
}

export async function runPipeline(options?: {
  source?: string
}): Promise<PipelineResult> {
  const pipelineStart = Date.now()

  const payload = await getTrends(options?.source)
  const results: TrendResult[] = []

  for (const trend of payload.trends) {
    const trendStart = Date.now()

    try {
      const flowiseResponse = await withExponentialBackoff(
        () => sendToFlowise(trend, payload.runId, payload.source),
        3,
        1000,
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
