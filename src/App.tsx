import { RouterProvider } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { userAtom } from '@/atoms/user.atom'

// Check if we're inside the iframe (mobile view mode)
const isEmbedded = new URLSearchParams(window.location.search).get('embedded') === 'true'

// Check if we're on a desktop screen
const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

function MobileApp() {
  const user = useAtomValue(userAtom)
  const isAuthenticated = !!user

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1C1C1C',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          error: {
            iconTheme: {
              primary: '#FF4B4B',
              secondary: '#fff',
            },
          },
          success: {
            iconTheme: {
              primary: '#00970F',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-white">
        <RouterProvider router={router} context={{ isAuthenticated }} />
      </div>
    </>
  )
}

function DesktopWrapper() {
  // iPhone 14 Pro dimensions
  const phoneWidth = 393
  const phoneHeight = 852
  const frameWidth = phoneWidth + 24 // Add frame padding
  const frameHeight = phoneHeight + 24

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* iPhone Frame */}
      <div
        className="relative bg-black rounded-[55px] p-3 shadow-2xl"
        style={{ width: frameWidth, height: frameHeight }}
      >
        {/* Screen */}
        <div
          className="relative bg-white rounded-[45px] overflow-hidden"
          style={{ width: phoneWidth, height: phoneHeight }}
        >
          <iframe
            src={`${window.location.origin}${window.location.pathname}?embedded=true`}
            className="w-full h-full border-0"
            title="Mobile View"
          />
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full"
          style={{ width: 134, height: 5 }}
        />
      </div>
    </div>
  )
}

function App() {
  // If embedded in iframe, just render the mobile app
  if (isEmbedded) {
    return <MobileApp />
  }

  // On desktop without embed param, show the phone mockup
  if (isDesktop) {
    return <DesktopWrapper />
  }

  // On actual mobile devices, show the app directly
  return <MobileApp />
}

export default App
