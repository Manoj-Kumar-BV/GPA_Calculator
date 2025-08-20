"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Calculator, GraduationCap, BookOpen, BarChart3, User, LogOut, Settings } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

interface NavigationProps {
  currentView: 'home' | 'dashboard' | 'cgpa' | 'sgpa' | 'profile'
  changeView: (view: 'home' | 'dashboard' | 'cgpa' | 'sgpa' | 'profile') => void
  setShowAuthModal: (show: boolean) => void
}

export function Navigation({ currentView, changeView, setShowAuthModal }: NavigationProps) {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    changeView('home')
  }

  const navItems = session ? [
    { key: 'dashboard', label: "Dashboard", icon: BarChart3 },
    { key: 'cgpa', label: "CGPA Calculator", icon: Calculator },
    { key: 'sgpa', label: "SGPA Calculator", icon: BookOpen },
  ] : []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div 
            className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center cursor-pointer"
            onClick={() => changeView('home')}
          >
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <button 
            onClick={() => changeView('home')}
            className="font-bold text-xl hover:text-primary transition-colors"
          >
            Student LMS
          </button>
        </div>

        {session && (
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => changeView(item.key as any)}
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                  currentView === item.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeView('profile')}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <div className="text-sm text-muted-foreground">
                  {session.user?.name || session.user?.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Button size="sm" onClick={() => setShowAuthModal(true)}>
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
