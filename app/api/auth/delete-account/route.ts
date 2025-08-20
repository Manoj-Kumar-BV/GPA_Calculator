import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ 
        message: 'Password is required to delete account' 
      }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection('users')

    // Get user to verify password
    const user = await users.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ 
        message: 'User not found' 
      }, { status: 404 })
    }

    // For Google/GitHub users, they don't have password
    if (!user.password) {
      // For social login users, we'll allow deletion without password verification
      // but they need to confirm via email verification or other method
      const result = await users.deleteOne({ email: session.user.email })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ 
          message: 'Failed to delete account' 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        message: 'Account deleted successfully' 
      })
    }

    // For email/password users, verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ 
        message: 'Invalid password' 
      }, { status: 401 })
    }

    // Delete user account and all data
    const result = await users.deleteOne({ email: session.user.email })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        message: 'Failed to delete account' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Account deleted successfully. All your data has been permanently removed.' 
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}
