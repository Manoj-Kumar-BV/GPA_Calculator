import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Student LMS - GPA Calculator',
  description: 'Modern Student Learning Management System with GPA Calculator, Authentication, and Data Storage',
  keywords: ['student', 'lms', 'gpa', 'calculator', 'education', 'grades'],
  authors: [{ name: 'Manoj Kumar BV' }],
  icons: {
    icon: 'https://img.icons8.com/?size=100&id=aqWDxhA3yiU1&format=png&color=000000',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <Providers>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#333',
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
