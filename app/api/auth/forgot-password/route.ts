import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      // For security, we don't reveal whether the email exists or not
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      )
    }

    // For now, we'll just log the request and return success
    // In production, you would:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link
    
    console.log(`Password reset requested for: ${email}`)
    
    return NextResponse.json(
      { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
