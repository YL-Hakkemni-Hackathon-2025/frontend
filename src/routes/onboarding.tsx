import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSetAtom } from 'jotai'
import backgroundImg from '@/assets/onboarding/background.png'
import logoImg from '@/assets/onboarding/logo.svg'
import lebanonFlagImg from '@/assets/onboarding/lebanon.svg'
import arrowForwardImg from '@/assets/onboarding/arrow_forward.svg'
import { ScannerModal } from '@/components/ScannerModal'
import { HealthPassCard } from '@/components/HealthPassCard'
import { userAtom } from '@/atoms/user.atom'
import { userDetailsAtom } from '@/atoms/userDetails.atom'
import { AuthTokenResponseDto } from '@/dtos/auth.dto'
import { UserResponseDto } from '@/dtos/user.dto'

export const Route = createFileRoute('/onboarding')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userDetails, setUserDetailsState] = useState<UserResponseDto | null>(null)
  const [showSuccessSheet, setShowSuccessSheet] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setUserDetails = useSetAtom(userDetailsAtom)
  const navigate = useNavigate()
  const setUser = useSetAtom(userAtom)

  const handleScanComplete = async (imageData: string) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData)
      const blob = await base64Response.blob()

      // Save the image for debugging - creates a download link
      const debugUrl = URL.createObjectURL(blob)
      const debugLink = document.createElement('a')
      debugLink.href = debugUrl
      debugLink.download = `id-card-${Date.now()}.jpg`
      debugLink.click()
      URL.revokeObjectURL(debugUrl)
      console.log('Image saved for debugging. Base64 length:', imageData.length, 'Blob size:', blob.size)

      // Create FormData and append the image
      const formData = new FormData()
      formData.append('image', blob, 'id-card.jpg')

      // Call the verify-id API (uses Vite proxy in development)
      const response = await fetch('/api/v1/auth/verify-id', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to verify ID card')
      }

      // Update user atom with auth token response
      const authData: AuthTokenResponseDto = {
        accessToken: result.data.token.accessToken,
        refreshToken: result.data.token.refreshToken,
        expiresIn: result.data.token.expiresIn,
        user: {
          id: result.data.user.id,
          fullName: result.data.user.fullName,
          governmentId: result.data.user.governmentId || '',
        },
      }
      setUser(authData)

      // Fetch user details
      const userDetailsResponse = await fetch('/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.accessToken}`,
        },
      })

      const userDetailsResult = await userDetailsResponse.json()

      if (userDetailsResponse.ok && userDetailsResult.success) {
        const details: UserResponseDto = userDetailsResult.data
        setUserDetails(details)
        setUserDetailsState(details)
      }

      // Show success sheet
      setShowSuccessSheet(true)
    } catch (err) {
      console.error('Failed to verify ID:', err)
      setError(err instanceof Error ? err.message : 'Failed to verify ID card. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-[100dvh] bg-cover bg-[25%_50%] flex flex-col items-center"
      style={{ backgroundImage: `linear-gradient(to bottom, transparent, #000000), url(${backgroundImg})` }}
    >
        <div className={"flex flex-col w-[92.5%] flex-1 items-center justify-between"}>
            <img alt={"hakkemni-logo"} src={logoImg} className="mt-[10%]"/>
            <div className={"flex flex-col items-start mb-[10%] gap-6"}>
                <img alt={"lebanon-flag"} src={lebanonFlagImg}/>
                <p className={"font-black text-[42px] leading-tight text-white"}>Hakkemni<br/>Health Space</p>
                <p className={"font-medium text-base text-white"}>Your health information, organized and ready to share when it matters</p>
                <button
                    onClick={() => setIsScannerOpen(true)}
                    disabled={isSubmitting}
                    className={"w-full h-14 bg-white rounded-full flex items-center justify-center disabled:opacity-50"}
                >
                    <p className={"text-base font-black text-black"}>
                        {isSubmitting ? 'Processing...' : 'Scan my Lebanese ID'}
                    </p>
                </button>
                {error && (
                    <p className="text-red-400 text-sm text-center w-full">{error}</p>
                )}
            </div>
        </div>

        <ScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanComplete={handleScanComplete}
        />

        <AnimatePresence>
          {showSuccessSheet && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[55%] bg-white rounded-t-3xl z-50 flex flex-col items-center px-6 py-4"
            >
              <div className="w-12 h-12 bg-[#00970F] rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="font-black text-2xl text-black text-center mb-3">
                Your profile is ready
              </h2>

              <p className="font-medium text-base text-black text-center mb-6">
                This is your personal place to store medical information and prepare Health Passes for your medical visits
              </p>

              {/* Card with layered boxes */}
              <div className="mb-6 w-full">
                <HealthPassCard
                  name={userDetails?.fullName || ''}
                  dob={userDetails?.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : ''}
                />
              </div>

              <button
                onClick={() => navigate({ to: '/dashboard' })}
                className="w-full h-12 bg-black rounded-full flex items-center justify-between px-6 mt-2"
              >
                <span></span>
                <p className="text-base font-black text-white">Get started</p>
                <img alt={"arrow-forward"} src={arrowForwardImg}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}

