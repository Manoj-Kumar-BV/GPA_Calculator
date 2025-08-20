import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    const users = db.collection('users')

    const user = await users.findOne(
      { email: session.user.email },
      { projection: { 'studentData.sgpaHistory': 1 } }
    )

    if (!user || !user.studentData?.sgpaHistory) {
      return NextResponse.json({ sgpaHistory: [] })
    }

    // Sort by creation date (newest first)
    const sgpaHistory = user.studentData.sgpaHistory
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ sgpaHistory })

  } catch (error) {
    console.error('Get SGPA history error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('id')

    if (!entryId) {
      return NextResponse.json({ message: 'Entry ID required' }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection('users')

    const result = await users.updateOne(
      { email: session.user.email },
      {
        $pull: {
          'studentData.sgpaHistory': { createdAt: new Date(entryId) }
        } as any,
        $set: {
          'studentData.lastUpdated': new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'SGPA entry deleted successfully' })

  } catch (error) {
    console.error('Delete SGPA entry error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
