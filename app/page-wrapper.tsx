'use client'

import { Suspense } from 'react'
import HomePage from './page-content'

function PageWithParams() {
  return <HomePage />
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PageWithParams />
    </Suspense>
  )
}
