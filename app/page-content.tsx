'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, BookOpen, BarChart3, Users, CheckCircle, Award, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { AuthModal } from '@/components/auth-modal'
import { Dashboard } from '@/components/dashboard'
import { CGPACalculator } from '@/components/cgpa-calculator'
import { SGPACalculator } from '@/components/sgpa-calculator'
import { ProfileSettings } from '@/components/profile-settings'

export default function HomePage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'cgpa' | 'sgpa' | 'profile'>('home')

  // Handle URL parameters
  useEffect(() => {
    const view = searchParams?.get('view')
    if (view && ['dashboard', 'cgpa', 'sgpa', 'profile'].includes(view)) {
      setCurrentView(view as any)
    } else {
      setCurrentView('home')
    }
  }, [searchParams])

  // Handle session changes - redirect to home when logged out
  useEffect(() => {
    if (status === 'unauthenticated' && currentView !== 'home') {
      setCurrentView('home')
      router.push('/')
    }
  }, [status, currentView, router])

  // Function to change view and update URL
  const changeView = (view: 'home' | 'dashboard' | 'cgpa' | 'sgpa' | 'profile') => {
    setCurrentView(view)
    if (view === 'home') {
      router.push('/')
    } else {
      router.push(`/?view=${view}`)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const services = [
    {
      icon: Calculator,
      title: "CGPA Calculator",
      description: "Advanced cumulative GPA calculation with semester-wise tracking and predictive analytics.",
      features: ["Real-time calculation", "Grade point mapping", "Performance tracking", "Academic insights"],
      color: "text-blue-500"
    },
    {
      icon: BookOpen,
      title: "SGPA Calculator", 
      description: "Semester-wise GPA calculation with detailed subject analysis and grade recommendations.",
      features: ["Subject-wise analysis", "Credit hour management", "Grade optimization", "Performance reports"],
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive academic analytics with performance insights and improvement suggestions.",
      features: ["Performance trends", "Grade distribution", "Goal tracking", "Progress reports"],
      color: "text-purple-500"
    }
  ]

  const stats = [
    { number: "1000+", label: "Students Registered" },
    { number: "50+", label: "Universities Supported" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation 
        currentView={currentView}
        changeView={changeView}
        setShowAuthModal={setShowAuthModal}
      />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-fit">
                        🎓 Academic Excellence
                      </Badge>
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                        Complete <span className="text-primary">Academic Solutions</span> for Students
                      </h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        Professional GPA tracking and academic analytics platform. Calculate, track, and analyze your 
                        academic performance with precision and get insights for improvement.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      {session ? (
                        <>
                          <Button size="lg" className="h-12" onClick={() => changeView('dashboard')}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="lg" className="h-12 bg-transparent" onClick={() => changeView('cgpa')}>
                            Calculate CGPA
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="lg" className="h-12" onClick={() => setShowAuthModal(true)}>
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="lg" className="h-12 bg-transparent" onClick={() => setShowAuthModal(true)}>
                            Learn More
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Free to Use</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Secure & Private</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 text-center">
                      <div className="text-3xl font-bold text-primary">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge variant="secondary">Our Services</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Comprehensive Academic Solutions</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      We provide cutting-edge academic tools and analytics to help students excel in their educational journey.
                    </p>
                  </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                  {services.map((service, index) => (
                    <Card key={index} className="h-full hover:shadow-lg transition-shadow cursor-pointer" 
                          onClick={() => session ? changeView(index === 0 ? 'cgpa' : index === 1 ? 'sgpa' : 'dashboard') : setShowAuthModal(true)}>
                      <CardHeader>
                        <service.icon className={`h-10 w-10 ${service.color}`} />
                        <CardTitle>{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>• {feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                  <div className="space-y-4">
                    <Badge variant="secondary">About Platform</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Trusted Academic Partner</h2>
                    <p className="text-muted-foreground md:text-lg">
                      Our Student LMS platform has been designed to provide accurate GPA calculations and academic insights 
                      for students across various educational institutions and grading systems.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold">Accurate Calculations</h3>
                          <p className="text-sm text-muted-foreground">Precise GPA calculations following standard academic practices</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold">Student-Focused</h3>
                          <p className="text-sm text-muted-foreground">Designed specifically for student needs and workflows</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold">Always Available</h3>
                          <p className="text-sm text-muted-foreground">Access your academic data anytime, anywhere</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            </motion.div>
          )}

          {currentView === 'dashboard' && session && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-screen bg-background"
            >
              <div className="container px-4 md:px-6 py-8">
                <Dashboard />
              </div>
            </motion.div>
          )}
          
          {currentView === 'cgpa' && session && (
            <motion.div
              key="cgpa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-screen bg-background"
            >
              <div className="container px-4 md:px-6 py-8">
                <CGPACalculator />
              </div>
            </motion.div>
          )}
          
          {currentView === 'sgpa' && session && (
            <motion.div
              key="sgpa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-screen bg-background"
            >
              <div className="container px-4 md:px-6 py-8">
                <SGPACalculator />
              </div>
            </motion.div>
          )}

          {currentView === 'profile' && session && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-screen bg-background"
            >
              <div className="container px-4 md:px-6 py-8">
                <ProfileSettings />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}
