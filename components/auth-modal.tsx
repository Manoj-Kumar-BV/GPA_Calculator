'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { X, Mail, Github, Chrome, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success('Password reset email sent! Check your inbox.')
        setIsForgotPassword(false)
        setIsLogin(true)
        setEmail('')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to send reset email')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast.error('Invalid credentials')
        } else {
          toast.success('Welcome back!')
          onClose()
        }
      } else {
        // Handle registration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })

        if (response.ok) {
          toast.success('Account created successfully!')
          setIsLogin(true)
        } else {
          const data = await response.json()
          toast.error(data.message || 'Registration failed')
        }
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch {
      toast.error('Authentication failed')
    }
  }

  const resetModalState = () => {
    setIsForgotPassword(false)
    setIsLogin(true)
    setEmail('')
    setPassword('')
    setName('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    onClose()
                    resetModalState()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                {isForgotPassword && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setIsForgotPassword(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <CardTitle className="text-2xl font-bold text-center text-gray-800">
                  {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  {isForgotPassword 
                    ? 'Enter your email address and we\'ll send you a password reset link'
                    : isLogin 
                      ? 'Sign in to access your dashboard' 
                      : 'Join thousands of students tracking their progress'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {isForgotPassword ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="loading-spinner mr-2" />
                      ) : (
                        <Mail className="mr-2 h-4 w-4" />
                      )}
                      Send Reset Link
                    </Button>
                  </form>
                ) : (
                  <>
                    {/* Social Login */}
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialAuth('google')}
                      >
                        <Chrome className="mr-2 h-4 w-4" />
                        Continue with Google
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialAuth('github')}
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Continue with GitHub
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      {!isLogin && (
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required={!isLogin}
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          {isLogin && (
                            <Button
                              type="button"
                              variant="link"
                              className="px-0 font-normal text-sm text-gray-600 hover:text-gray-800"
                              onClick={() => setIsForgotPassword(true)}
                            >
                              Forgot password?
                            </Button>
                          )}
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="loading-spinner mr-2" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4" />
                        )}
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </Button>
                    </form>
                  </>
                )}

                {!isForgotPassword && (
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      {isLogin 
                        ? "Don't have an account? Sign up" 
                        : 'Already have an account? Sign in'
                      }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
