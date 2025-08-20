'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

export function ProfileSettings() {
  const { data: session } = useSession()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (!session?.user?.email) return

    setIsDeleting(true)
    
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Account deleted successfully')
        // Sign out and redirect to home
        await signOut({ callbackUrl: '/' })
      } else {
        toast.error(data.message || 'Failed to delete account')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeletePassword('')
    }
  }

  const isGoogleUser = session?.user?.email && !session.user.image?.includes('gravatar')
  const userJoinDate = new Date().toLocaleDateString() // You can get this from user data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account preferences</p>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{session?.user?.name || 'Student'}</h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {session?.user?.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {userJoinDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Delete Account
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Once you delete your account, there is no going back. This will permanently delete:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 mb-4 space-y-1">
                <li>• All your SGPA calculations and history</li>
                <li>• Your CGPA data and semester records</li>
                <li>• Your profile and account information</li>
                <li>• All associated academic data</li>
              </ul>
              
              {!showDeleteConfirm ? (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete My Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      Confirm Account Deletion
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {isGoogleUser 
                        ? "As a Google user, click confirm to delete your account."
                        : "Please enter your password to confirm account deletion."
                      }
                    </p>
                    
                    {!isGoogleUser && (
                      <div className="mb-4">
                        <Label htmlFor="delete-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="delete-password"
                            type={showPassword ? "text" : "password"}
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || (!isGoogleUser && !deletePassword)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeletePassword('')
                        }}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Export (Future Feature) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>🚀 Coming Soon</CardTitle>
            <CardDescription>
              Features we&apos;re working on for better account management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Data Export</h4>
                <p className="text-sm text-muted-foreground">
                  Download all your academic data as PDF or Excel
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">🔒 Privacy Controls</h4>
                <p className="text-sm text-muted-foreground">
                  Enhanced privacy settings and data controls
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
