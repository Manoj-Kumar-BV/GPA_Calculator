// Grade system configuration
export const GRADE_SYSTEM = {
  grades: [
    { grade: 'O', points: 10, description: 'Outstanding' },
    { grade: 'A+', points: 9, description: 'Excellent' },
    { grade: 'A', points: 8, description: 'Very Good' },
    { grade: 'B+', points: 7, description: 'Good' },
    { grade: 'B', points: 6, description: 'Above Average' },
    { grade: 'C', points: 5, description: 'Average' },
    { grade: 'P', points: 4, description: 'Pass' },
    { grade: 'F', points: 0, description: 'Fail' }
  ],
  getGradePoints: (grade: string): number => {
    const gradeObj = GRADE_SYSTEM.grades.find(g => g.grade === grade)
    return gradeObj?.points ?? 0
  },
  getGradeDescription: (grade: string): string => {
    const gradeObj = GRADE_SYSTEM.grades.find(g => g.grade === grade)
    return gradeObj?.description ?? 'Unknown'
  }
}

// Performance classifications
export const PERFORMANCE_CLASSIFICATIONS = {
  cgpa: [
    { min: 9.5, max: 10, label: 'Outstanding', color: '#10b981' },
    { min: 8.5, max: 9.49, label: 'Excellent', color: '#059669' },
    { min: 7.5, max: 8.49, label: 'Very Good', color: '#0891b2' },
    { min: 6.5, max: 7.49, label: 'Good', color: '#0284c7' },
    { min: 5.5, max: 6.49, label: 'Above Average', color: '#7c3aed' },
    { min: 4.5, max: 5.49, label: 'Average', color: '#c2410c' },
    { min: 0, max: 4.49, label: 'Below Average', color: '#dc2626' }
  ],
  sgpa: [
    { min: 9.5, max: 10, label: 'Outstanding', color: '#10b981' },
    { min: 8.5, max: 9.49, label: 'Excellent', color: '#059669' },
    { min: 7.5, max: 8.49, label: 'Very Good', color: '#0891b2' },
    { min: 6.5, max: 7.49, label: 'Good', color: '#0284c7' },
    { min: 5.5, max: 6.49, label: 'Above Average', color: '#7c3aed' },
    { min: 4.5, max: 5.49, label: 'Average', color: '#c2410c' },
    { min: 0, max: 4.49, label: 'Below Average', color: '#dc2626' }
  ]
}

export function getPerformanceClassification(gpa: number, type: 'cgpa' | 'sgpa') {
  const classifications = PERFORMANCE_CLASSIFICATIONS[type]
  return classifications.find(cls => gpa >= cls.min && gpa <= cls.max) || classifications[classifications.length - 1]
}

// Application constants
export const APP_CONFIG = {
  name: 'Student LMS - GPA Calculator',
  version: '1.0.0',
  author: 'Manoj Kumar BV',
  maxSemesters: 10,
  maxSubjectsPerSemester: 20,
  maxCreditsPerSubject: 10,
  minCreditsPerSubject: 1,
  defaultCredits: 3,
  supportedFormats: ['pdf', 'csv', 'json'],
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
}

// API response messages
export const API_MESSAGES = {
  success: {
    CGPA_SAVED: 'CGPA saved successfully',
    SGPA_SAVED: 'SGPA saved successfully',
    USER_CREATED: 'User created successfully',
    DATA_RETRIEVED: 'Data retrieved successfully',
    ENTRY_DELETED: 'Entry deleted successfully'
  },
  error: {
    UNAUTHORIZED: 'Unauthorized access',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    MISSING_FIELDS: 'Missing required fields',
    INVALID_EMAIL: 'Invalid email format',
    WEAK_PASSWORD: 'Password must be at least 6 characters',
    INVALID_GPA: 'GPA must be between 0 and 10',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    SERVER_ERROR: 'Internal server error'
  }
}
