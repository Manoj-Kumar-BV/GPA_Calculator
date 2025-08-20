import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabase } from '@/lib/mongodb'

interface Subject {
  name: string
  credits: number
  grade: string
  gradePoints: number
}

interface SGPARequest {
  sgpa: number
  totalCredits: number
  totalGradePoints: number
  subjects: Subject[]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body: SGPARequest = await request.json()
    const { sgpa, totalCredits, totalGradePoints, subjects } = body

    // Validation
    if (!sgpa || !totalCredits || !totalGradePoints || !subjects?.length) {
      return NextResponse.json({ 
        message: 'Missing required fields: sgpa, totalCredits, totalGradePoints, subjects' 
      }, { status: 400 })
    }

    if (sgpa < 0 || sgpa > 10) {
      return NextResponse.json({ 
        message: 'SGPA must be between 0 and 10' 
      }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection('users')

    // Add to SGPA history
    const sgpaEntry = {
      sgpa: Number(sgpa),
      totalCredits: Number(totalCredits),
      totalGradePoints: Number(totalGradePoints),
      subjects: subjects.map(subject => ({
        name: subject.name,
        credits: Number(subject.credits),
        grade: subject.grade,
        gradePoints: Number(subject.gradePoints)
      })),
      createdAt: new Date()
    }

    // Create user document if it doesn't exist
    await users.updateOne(
      { email: session.user.email },
      {
        $setOnInsert: {
          email: session.user.email,
          name: session.user.name || 'Student',
          createdAt: new Date(),
          studentData: {
            cgpa: null,
            semesters: [],
            sgpaHistory: []
          }
        }
      },
      { upsert: true }
    )

    // Add SGPA entry to history
    const result = await users.updateOne(
      { email: session.user.email },
      {
        $push: {
          'studentData.sgpaHistory': sgpaEntry
        } as any,
        $set: {
          'studentData.lastUpdated': new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Failed to save SGPA data' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'SGPA saved successfully',
      sgpa: sgpa,
      totalSubjects: subjects.length
    })

  } catch (error) {
    console.error('Save SGPA error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}
