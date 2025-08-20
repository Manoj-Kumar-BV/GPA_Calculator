// Database types
export interface User {
  _id?: string
  name: string
  email: string
  password?: string
  image?: string
  createdAt: Date
  updatedAt?: Date
  studentData: StudentData
}

export interface StudentData {
  cgpa?: number | null
  semesters?: Semester[]
  sgpaHistory?: SGPAEntry[]
  lastUpdated?: Date
}

export interface Semester {
  semester: number
  credits: number
  gradePoints: number
}

export interface Subject {
  name: string
  credits: number
  grade: string
  gradePoints: number
}

export interface SGPAEntry {
  sgpa: number
  totalCredits: number
  totalGradePoints: number
  subjects: Subject[]
  createdAt: Date
}

// API request/response types
export interface CGPARequest {
  cgpa: number
  semesters: Semester[]
  studentType: string
}

export interface SGPARequest {
  sgpa: number
  totalCredits: number
  totalGradePoints: number
  subjects: Subject[]
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserDataResponse {
  cgpa: number | null
  totalSemesters: number
  recentSgpa: number | null
  totalSubjects: number
  totalSgpaCalculations: number
  averageCreditsPerSemester: number
  lastUpdated: Date | null
}

export interface AnalyticsResponse {
  analytics: {
    averageSgpa: number
    highestSgpa: number
    lowestSgpa: number
    totalCredits: number
    totalSubjects: number
    performanceTrend: 'improving' | 'declining' | 'stable'
    gradeDistribution: Record<string, number>
    monthlyProgress: Array<{
      month: string
      sgpa: number
      credits: number
    }>
    cgpa: number | null
    totalCalculations: number
  }
}

// Component props types
export interface CalculatorProps {
  onSave?: (data: any) => void
  initialData?: any
}

export interface DashboardProps {
  userData: UserDataResponse
  onRefresh?: () => void
}

// Grade system types
export interface Grade {
  grade: string
  points: number
  description: string
}

export interface PerformanceClassification {
  min: number
  max: number
  label: string
  color: string
}

// Form types
export interface FormErrors {
  [key: string]: string
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

// API error types
export interface APIErrorResponse {
  message: string
  code?: string
  field?: string
  details?: any
}

// Utility types
export type ResponseStatus = 'idle' | 'loading' | 'success' | 'error'

export interface APIResponse<T = any> {
  data?: T
  message?: string
  error?: string
  status: number
}

// Context types
export interface AuthContextType {
  user: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
