import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: 'Dados de entrada inválidos',
        code: 'VALIDATION_ERROR',
        details: error.issues
      },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        message: error.message,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Erro interno do servidor',
      code: 'UNKNOWN_ERROR'
    },
    { status: 500 }
  )
}

export function createSuccessResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(message: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      message,
      code: code || 'API_ERROR'
    },
    { status }
  )
}
