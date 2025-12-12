import { RouterProvider } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { router } from './router'
import { userAtom } from '@/atoms/user.atom'

function App() {
  const user = useAtomValue(userAtom)
  const isAuthenticated = true

  return (
    <>
      {/* Desktop warning - hidden on mobile (md breakpoint and up shows this) */}
      <div className="hidden md:flex h-screen w-screen items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-bold mb-4">Mobile Only</h1>
          <p className="text-gray-400">
            This application is designed for mobile devices only. Please open it on your phone or resize your browser window.
          </p>
        </div>
      </div>

      {/* Mobile app container - visible only on mobile (hidden on md and up) */}
      <div className="md:hidden min-h-screen bg-white">
        <RouterProvider router={router} context={{ isAuthenticated }} />
      </div>
    </>
  )
}

export default App
