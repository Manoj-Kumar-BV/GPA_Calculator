'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Save, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface Semester {
  id: string
  number: number
  credits: number
  gradePoints: number
}

export function CGPACalculator() {
  const [studentType, setStudentType] = useState<'regular' | 'diploma' | ''>('')
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [cgpa, setCgpa] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (studentType) {
      const startSemester = studentType === 'regular' ? 1 : 3
      const endSemester = 8
      const newSemesters: Semester[] = []
      
      for (let i = startSemester; i <= endSemester; i++) {
        newSemesters.push({
          id: `semester-${i}`,
          number: i,
          credits: 0,
          gradePoints: 0,
        })
      }
      
      setSemesters(newSemesters)
      setCgpa(null)
    }
  }, [studentType])

  const updateSemester = (id: string, field: 'credits' | 'gradePoints', value: number) => {
    setSemesters(prev => prev.map(sem => 
      sem.id === id ? { ...sem, [field]: value } : sem
    ))
  }

  const calculateCGPA = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      let totalCredits = 0
      let totalGradePoints = 0

      semesters.forEach(semester => {
        if (semester.credits > 0 && semester.gradePoints >= 0) {
          totalCredits += semester.credits
          totalGradePoints += semester.gradePoints
        }
      })

      if (totalCredits > 0) {
        const calculatedCgpa = totalGradePoints / totalCredits
        setCgpa(calculatedCgpa)
        toast.success(`CGPA calculated: ${calculatedCgpa.toFixed(2)}`)
      } else {
        toast.error('Please enter valid data for at least one semester')
      }
      
      setIsLoading(false)
    }, 800)
  }

  const saveCGPA = async () => {
    if (!cgpa) {
      toast.error('Please calculate CGPA first')
      return
    }

    try {
      const response = await fetch('/api/save-cgpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          semesters: semesters.filter(s => s.credits > 0),
          studentType,
        }),
      })

      if (response.ok) {
        toast.success('CGPA saved successfully!')
      } else {
        toast.error('Failed to save CGPA')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="glass-effect border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Calculator className="text-yellow-400" />
              CGPA Calculator
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Calculate your Cumulative Grade Point Average with advanced analytics
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <Label className="text-white font-semibold">Student Type</Label>
              <Select 
                value={studentType} 
                onChange={(e) => setStudentType(e.target.value as 'regular' | 'diploma')}
                className="mt-2 bg-white/10 border-white/20 text-white"
              >
                <option value="">Choose your student type</option>
                <option value="regular">Regular Student (Semester 1-8)</option>
                <option value="diploma">Diploma Student (Semester 3-8)</option>
              </Select>
            </div>

            {semesters.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {semesters.map((semester, index) => (
                    <motion.div
                      key={semester.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg">
                            📚 Semester {semester.number}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-white/90">Total Credits Earned</Label>
                            <Input
                              type="number"
                              value={semester.credits || ''}
                              onChange={(e) => updateSemester(semester.id, 'credits', parseInt(e.target.value) || 0)}
                              placeholder="e.g., 20"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              min="0"
                              step="1"
                            />
                          </div>
                          <div>
                            <Label className="text-white/90">Total Grade Points Earned</Label>
                            <Input
                              type="number"
                              value={semester.gradePoints || ''}
                              onChange={(e) => updateSemester(semester.id, 'gradePoints', parseFloat(e.target.value) || 0)}
                              placeholder="e.g., 180.5"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  <Button
                    onClick={calculateCGPA}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
                  >
                    {isLoading ? (
                      <div className="loading-spinner mr-2" />
                    ) : (
                      <Calculator className="mr-2" />
                    )}
                    Calculate CGPA
                  </Button>
                  
                  {cgpa && (
                    <Button
                      onClick={saveCGPA}
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-purple-600"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Result
                    </Button>
                  )}
                </div>

                {cgpa && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/50">
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white">
                          🎉 Your CGPA Result
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-6xl font-bold text-white mb-4">
                          {cgpa.toFixed(2)}
                        </div>
                        <p className="text-white/90 text-lg">
                          Based on {semesters.filter(s => s.credits > 0).length} semester(s) with{' '}
                          {semesters.reduce((total, s) => total + s.credits, 0)} total credits
                        </p>
                        
                        {/* Grade Classification */}
                        <div className="mt-6 p-4 bg-white/10 rounded-lg">
                          <p className="text-white font-semibold">
                            Classification: {' '}
                            <span className={`font-bold ${
                              cgpa >= 9 ? 'text-green-400' :
                              cgpa >= 8 ? 'text-blue-400' :
                              cgpa >= 7 ? 'text-yellow-400' :
                              cgpa >= 6 ? 'text-orange-400' :
                              'text-red-400'
                            }`}>
                              {cgpa >= 9 ? 'Outstanding' :
                               cgpa >= 8 ? 'Excellent' :
                               cgpa >= 7 ? 'Very Good' :
                               cgpa >= 6 ? 'Good' :
                               cgpa >= 5 ? 'Average' : 'Below Average'}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
