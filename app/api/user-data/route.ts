import { NextResponse } from 'next/server'
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
      { projection: { studentData: 1, name: 1, email: 1 } }
    )

    if (!user) {
      // Create user if doesn't exist
      await users.insertOne({
        email: session.user.email,
        name: session.user.name || 'Student',
        createdAt: new Date(),
        studentData: {
          cgpa: null,
          semesters: [],
          sgpaHistory: []
        }
      })

      return NextResponse.json({
        cgpa: null,
        totalSemesters: 0,
        recentSgpa: null,
        totalSubjects: 0,
        totalSgpaCalculations: 0,
        averageCreditsPerSemester: 0
      })
    }

    const studentData = user.studentData || {}
    const sgpaHistory = studentData.sgpaHistory || []
    
    // Calculate analytics
    const totalSubjects = sgpaHistory.reduce((total: number, entry: any) => 
      total + (entry.subjects?.length || 0), 0)
    
    const totalCredits = sgpaHistory.reduce((total: number, entry: any) => 
      total + (entry.totalCredits || 0), 0)
    
    const averageCreditsPerSemester = sgpaHistory.length > 0 
      ? Math.round((totalCredits / sgpaHistory.length) * 100) / 100 
      : 0

    const userData = {
      cgpa: studentData.cgpa || null,
      totalSemesters: studentData.semesters?.length || 0,
      recentSgpa: sgpaHistory.length > 0 ? sgpaHistory[sgpaHistory.length - 1].sgpa : null,
      totalSubjects,
      totalSgpaCalculations: sgpaHistory.length,
      averageCreditsPerSemester,
      lastUpdated: studentData.lastUpdated || null
    }

    return NextResponse.json(userData)

  } catch (error) {
    console.error('Get user data error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
