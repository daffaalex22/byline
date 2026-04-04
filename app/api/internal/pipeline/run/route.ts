import { NextResponse } from 'next/server'
import { runPipeline } from '@/lib/pipeline/runner'

type PipelinePayload = {
  secret?: string
  source?: string
}

export async function POST(request: Request) {
  let payload: PipelinePayload

  try {
    payload = (await request.json()) as PipelinePayload
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
      { error: 'Unauthorized pipeline request.' },
      { status: 401 },
    )
  }

  try {
    const result = await runPipeline({ source: payload.source })

    const httpStatus = result.status === 'error' ? 502 : 200

    return NextResponse.json(result, { status: httpStatus })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Pipeline execution failed.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
