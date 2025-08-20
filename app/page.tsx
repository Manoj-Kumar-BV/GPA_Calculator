import { Suspense } from 'react'
import PageContent from './page-content'

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  )
}
