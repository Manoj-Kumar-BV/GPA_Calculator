import { NextResponse } from 'next/server'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { 
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          originalMessage: error.message,
          stack: error.stack 
        })
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Unknown error occurred' },
    { status: 500 }
  )
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !data[field])
  
  if (missingFields.length > 0) {
    throw new APIError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_FIELDS'
    )
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateGPA(gpa: number, min: number = 0, max: number = 10): void {
  if (gpa < min || gpa > max) {
    throw new APIError(
      `GPA must be between ${min} and ${max}`,
      400,
      'INVALID_GPA'
    )
  }
}

export function sanitizeUserInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
