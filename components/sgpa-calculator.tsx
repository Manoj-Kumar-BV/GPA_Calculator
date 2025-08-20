'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface Subject {
  id: string
  name: string
  credits: number
  grade: string
  gradePoints: number
}

const gradeMapping = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
}

export function SGPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 }
  ])
  const [sgpa, setSgpa] = useState<number | null>(null)
  const [totalCredits, setTotalCredits] = useState(0)
  const [totalGradePoints, setTotalGradePoints] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      grade: '',
      gradePoints: 0,
    }
    setSubjects([...subjects, newSubject])
  }

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id))
    }
  }

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: value }
        
        // Auto-calculate grade points when grade is selected
        if (field === 'grade' && typeof value === 'string') {
          updated.gradePoints = gradeMapping[value as keyof typeof gradeMapping] || 0
        }
        
        return updated
      }
      return subject
    }))
  }

  const calculateSGPA = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      let totalCreds = 0
      let totalGradeP = 0

      subjects.forEach(subject => {
        if (subject.credits > 0 && subject.gradePoints >= 0) {
          totalCreds += subject.credits
          totalGradeP += subject.gradePoints * subject.credits
        }
      })

      if (totalCreds > 0) {
        const calculatedSgpa = totalGradeP / totalCreds
        setSgpa(calculatedSgpa)
        setTotalCredits(totalCreds)
        setTotalGradePoints(totalGradeP)
        toast.success(`SGPA calculated: ${calculatedSgpa.toFixed(2)}`)
      } else {
        toast.error('Please enter valid data for at least one subject')
      }
      
      setIsLoading(false)
    }, 800)
  }

  const saveSGPA = async () => {
    if (!sgpa) {
      toast.error('Please calculate SGPA first')
      return
    }

    try {
      const response = await fetch('/api/save-sgpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sgpa,
          totalCredits,
          totalGradePoints,
          subjects: subjects.filter(s => s.credits > 0),
        }),
      })

      if (response.ok) {
        toast.success('SGPA saved successfully!')
      } else {
        toast.error('Failed to save SGPA')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const resetCalculator = () => {
    setSubjects([{ id: '1', name: '', credits: 0, grade: '', gradePoints: 0 }])
    setSgpa(null)
    setTotalCredits(0)
    setTotalGradePoints(0)
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
              <Calculator className="text-blue-400" />
              SGPA Calculator
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Calculate your Semester Grade Point Average with detailed subject breakdown
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4 mb-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-lg">
                          📖 Subject {index + 1}
                        </CardTitle>
                        {subjects.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubject(subject.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-white/90">Subject Name (Optional)</Label>
                        <Input
                          type="text"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                          placeholder="e.g., Mathematics, Physics"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white/90">Credits</Label>
                          <Input
                            type="number"
                            value={subject.credits || ''}
                            onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                            placeholder="e.g., 3"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            min="1"
                            step="1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-white/90">Letter Grade</Label>
                          <Select
                            value={subject.grade}
                            onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                          >
                            <option value="">Select Grade</option>
                            <option value="O">O (Outstanding) → 10</option>
                            <option value="A+">A+ (Excellent) → 9</option>
                            <option value="A">A (Very Good) → 8</option>
                            <option value="B+">B+ (Good) → 7</option>
                            <option value="B">B (Above Average) → 6</option>
                            <option value="C">C (Average) → 5</option>
                            <option value="P">P (Pass) → 4</option>
                            <option value="F">F (Fail) → 0</option>
                          </Select>
                        </div>
                      </div>
                      
                      {subject.grade && (
                        <div className="text-sm text-white/70 bg-white/5 p-2 rounded">
                          Grade Points: {subject.gradePoints} × {subject.credits} credits = {subject.gradePoints * subject.credits} points
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 justify-center mb-6">
              <Button
                onClick={addSubject}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
              
              <Button
                onClick={calculateSGPA}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
              >
                {isLoading ? (
                  <div className="loading-spinner mr-2" />
                ) : (
                  <Calculator className="mr-2" />
                )}
                Calculate SGPA
              </Button>
              
              <Button
                onClick={resetCalculator}
                variant="outline"
                className="border-gray-400 text-gray-300 hover:bg-gray-500 hover:text-white"
              >
                Reset
              </Button>
            </div>

            {sgpa && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Results Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-white text-lg">📊 Total Credits</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-white">{totalCredits}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-white text-lg">📈 Total Grade Points</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-white">{totalGradePoints}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/50">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-white text-lg">🎯 Your SGPA</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-4xl font-bold text-white">{sgpa.toFixed(2)}</div>
                      <p className="text-white/80 text-sm mt-2">
                        Based on {subjects.filter(s => s.credits > 0).length} subject(s)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Grade Classification */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="text-center py-6">
                    <p className="text-white text-lg">
                      Performance Level: {' '}
                      <span className={`font-bold text-xl ${
                        sgpa >= 9 ? 'text-green-400' :
                        sgpa >= 8 ? 'text-blue-400' :
                        sgpa >= 7 ? 'text-yellow-400' :
                        sgpa >= 6 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {sgpa >= 9 ? '🏆 Outstanding' :
                         sgpa >= 8 ? '⭐ Excellent' :
                         sgpa >= 7 ? '👍 Very Good' :
                         sgpa >= 6 ? '📈 Good' :
                         sgpa >= 5 ? '📊 Average' : '📉 Below Average'}
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={saveSGPA}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Result
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
