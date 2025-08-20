import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabase } from '@/lib/mongodb'

interface Subject {
  grade: string
  gradePoints: number
  credits: number
}

interface SGPAEntry {
  sgpa: number
  totalCredits: number
  subjects: Subject[]
  createdAt: Date
}

interface StudentData {
  sgpaHistory: SGPAEntry[]
  cgpa?: number
}

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
      { projection: { studentData: 1 } }
    )

    if (!user?.studentData) {
      return NextResponse.json({
        analytics: {
          averageSgpa: 0,
          highestSgpa: 0,
          lowestSgpa: 0,
          totalCredits: 0,
          totalSubjects: 0,
          performanceTrend: 'stable',
          gradeDistribution: {},
          monthlyProgress: []
        }
      })
    }

    const { sgpaHistory = [], cgpa }: StudentData = user.studentData

    if (sgpaHistory.length === 0) {
      return NextResponse.json({
        analytics: {
          averageSgpa: 0,
          highestSgpa: 0,
          lowestSgpa: 0,
          totalCredits: 0,
          totalSubjects: 0,
          performanceTrend: 'stable',
          gradeDistribution: {},
          monthlyProgress: []
        }
      })
    }

    // Calculate analytics
    const sgpaValues = sgpaHistory.map((entry: SGPAEntry) => entry.sgpa)
    const averageSgpa = sgpaValues.reduce((sum: number, sgpa: number) => sum + sgpa, 0) / sgpaValues.length
    const highestSgpa = Math.max(...sgpaValues)
    const lowestSgpa = Math.min(...sgpaValues)

    const totalCredits = sgpaHistory.reduce((sum: number, entry: SGPAEntry) => sum + entry.totalCredits, 0)
    const totalSubjects = sgpaHistory.reduce((sum: number, entry: SGPAEntry) => sum + entry.subjects.length, 0)

    // Performance trend
    let performanceTrend = 'stable'
    if (sgpaHistory.length >= 2) {
      const recent = sgpaHistory.slice(-3).map((entry: SGPAEntry) => entry.sgpa)
      const older = sgpaHistory.slice(0, -3).map((entry: SGPAEntry) => entry.sgpa)
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((sum: number, sgpa: number) => sum + sgpa, 0) / recent.length
        const olderAvg = older.reduce((sum: number, sgpa: number) => sum + sgpa, 0) / older.length
        
        if (recentAvg > olderAvg + 0.2) performanceTrend = 'improving'
        else if (recentAvg < olderAvg - 0.2) performanceTrend = 'declining'
      }
    }

    // Grade distribution
    const gradeDistribution: Record<string, number> = {}
    sgpaHistory.forEach((entry: SGPAEntry) => {
      entry.subjects.forEach((subject: Subject) => {
        gradeDistribution[subject.grade] = (gradeDistribution[subject.grade] || 0) + 1
      })
    })

    // Monthly progress
    const monthlyProgress = sgpaHistory
      .map((entry: SGPAEntry) => ({
        month: new Date(entry.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }),
        sgpa: entry.sgpa,
        credits: entry.totalCredits
      }))
      .reverse() // Show chronological order

    return NextResponse.json({
      analytics: {
        averageSgpa: Math.round(averageSgpa * 100) / 100,
        highestSgpa: Math.round(highestSgpa * 100) / 100,
        lowestSgpa: Math.round(lowestSgpa * 100) / 100,
        totalCredits,
        totalSubjects,
        performanceTrend,
        gradeDistribution,
        monthlyProgress,
        cgpa: cgpa || null,
        totalCalculations: sgpaHistory.length
      }
    })

  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
