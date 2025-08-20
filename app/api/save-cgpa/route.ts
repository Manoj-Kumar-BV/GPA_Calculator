import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabase } from '@/lib/mongodb'

interface Semester {
  semester: number
  credits: number
  gradePoints: number
}

interface CGPARequest {
  cgpa: number
  semesters: Semester[]
  studentType: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body: CGPARequest = await request.json()
    const { cgpa, semesters, studentType } = body

    // Validation
    if (!cgpa || !semesters?.length || !studentType) {
      return NextResponse.json({ 
        message: 'Missing required fields: cgpa, semesters, studentType' 
      }, { status: 400 })
    }

    if (cgpa < 0 || cgpa > 10) {
      return NextResponse.json({ 
        message: 'CGPA must be between 0 and 10' 
      }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection('users')

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

    // Update CGPA data
    const result = await users.updateOne(
      { email: session.user.email },
      {
        $set: {
          'studentData.cgpa': Number(cgpa),
          'studentData.semesters': semesters.map(sem => ({
            semester: Number(sem.semester),
            credits: Number(sem.credits),
            gradePoints: Number(sem.gradePoints)
          })),
          'studentData.studentType': studentType,
          'studentData.lastUpdated': new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Failed to save CGPA data' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'CGPA saved successfully',
      cgpa: cgpa,
      totalSemesters: semesters.length
    })

  } catch (error) {
    console.error('Save CGPA error:', error)
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
