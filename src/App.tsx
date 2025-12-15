import { RouterProvider } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Toaster } from 'react-hot-toast'
import { IPhoneMockup } from 'react-device-mockup'
import { router } from './router'
import { userAtom } from '@/atoms/user.atom'

function App() {
  const user = useAtomValue(userAtom)
  const isAuthenticated = !!user

  return (
    <>
      {/* Toast notifications */}
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

      {/* Desktop - Show mobile UI in iOS mockup */}
      <div className="hidden md:flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <IPhoneMockup screenWidth={370} screenType="island" hideStatusBar hideNavBar>
          <div className="relative w-full h-full overflow-y-auto overflow-x-hidden" style={{ transform: 'translateZ(0)' }}>
            <RouterProvider router={router} context={{ isAuthenticated }} />
          </div>
        </IPhoneMockup>
      </div>

      {/* Mobile - Full screen */}
      <div className="md:hidden min-h-screen bg-white">
        <RouterProvider router={router} context={{ isAuthenticated }} />
      </div>
    </>
  )
}

export default App
