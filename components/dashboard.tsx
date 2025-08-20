'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { BarChart3, Calculator, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UserData {
  cgpa: number | null
  totalSemesters: number
  recentSgpa: number | null
  totalSubjects: number
}

export function Dashboard() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData>({
    cgpa: null,
    totalSemesters: 0,
    recentSgpa: null,
    totalSubjects: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user-data')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-effect border-white/20 animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-white/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* User Header */}
        <Card className="glass-effect border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Welcome back, {session?.user?.name || 'Student'}! 👋
                  </h2>
                  <p className="text-white/80">
                    Track your academic progress and achieve your goals
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-medium">Current CGPA</CardTitle>
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {userData.cgpa ? userData.cgpa.toFixed(2) : '--'}
                </div>
                <p className="text-white/70 text-sm">
                  {userData.totalSemesters} semesters tracked
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-medium">Recent SGPA</CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {userData.recentSgpa ? userData.recentSgpa.toFixed(2) : '--'}
                </div>
                <p className="text-white/70 text-sm">Last semester</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-medium">Total Subjects</CardTitle>
                  <BookOpen className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {userData.totalSubjects}
                </div>
                <p className="text-white/70 text-sm">Subjects completed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-medium">Performance</CardTitle>
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {userData.cgpa 
                    ? userData.cgpa >= 8 ? '🏆' : userData.cgpa >= 7 ? '⭐' : userData.cgpa >= 6 ? '👍' : '📈'
                    : '📊'
                  }
                </div>
                <p className="text-white/70 text-sm">
                  {userData.cgpa 
                    ? userData.cgpa >= 8 ? 'Excellent' : userData.cgpa >= 7 ? 'Very Good' : userData.cgpa >= 6 ? 'Good' : 'Fair'
                    : 'No data'
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-white/80">
              Jump to your most used tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="h-24 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
                onClick={() => window.location.href = '/?view=cgpa'}
              >
                <div className="flex flex-col items-center gap-2">
                  <Calculator className="h-8 w-8" />
                  <span>Calculate CGPA</span>
                </div>
              </Button>
              
              <Button 
                className="h-24 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
                onClick={() => window.location.href = '/?view=sgpa'}
              >
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-8 w-8" />
                  <span>Calculate SGPA</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">🚀 Coming Soon</CardTitle>
              <CardDescription className="text-white/80">
                Exciting features we're working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/10 rounded-lg text-center">
                  <div className="text-2xl mb-2">🤖</div>
                  <h3 className="text-white font-semibold">AI Predictions</h3>
                  <p className="text-white/70 text-sm">Grade predictions based on your performance</p>
                </div>
                
                <div className="p-4 bg-white/10 rounded-lg text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="text-white font-semibold">Advanced Analytics</h3>
                  <p className="text-white/70 text-sm">Detailed insights and trends</p>
                </div>
                
                <div className="p-4 bg-white/10 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-white font-semibold">Goal Setting</h3>
                  <p className="text-white/70 text-sm">Set and track academic goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
