import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSetAtom, useAtomValue } from 'jotai'
import toast from 'react-hot-toast'
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
import { apiUrl } from '@/utils/api'

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
  const [showEditNameDialog, setShowEditNameDialog] = useState(false)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const setUserDetails = useSetAtom(userDetailsAtom)
  const navigate = useNavigate()
  const setUser = useSetAtom(userAtom)
  const authData = useAtomValue(userAtom)

  // Disable scroll when success sheet is open
  useEffect(() => {
    if (showSuccessSheet) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showSuccessSheet])

  const handleEditName = () => {
    if (userDetails) {
      setEditFirstName(userDetails.firstName || '')
      setEditLastName(userDetails.lastName || '')
      setShowEditNameDialog(true)
    }
  }

  const handleUpdateName = async () => {
    if (!authData?.accessToken) {
      toast.error('Not authenticated')
      return
    }

    setIsUpdatingName(true)
    try {
      const response = await fetch(apiUrl('/api/v1/users/me'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.accessToken}`,
        },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update name')
      }

      // Update local state with new name
      const updatedDetails = {
        ...userDetails!,
        firstName: editFirstName,
        lastName: editLastName,
        fullName: `${editFirstName} ${editLastName}`,
      }
      setUserDetailsState(updatedDetails)
      setUserDetails(updatedDetails)

      // Also update the user atom with new fullName
      setUser({
        ...authData,
        user: {
          ...authData.user,
          fullName: `${editFirstName} ${editLastName}`,
        },
      })

      toast.success('Name updated successfully')
      setShowEditNameDialog(false)
    } catch (err) {
      console.error('Failed to update name:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update name')
    } finally {
      setIsUpdatingName(false)
    }
  }

  const handleScanComplete = async (imageData: string) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert base64 to blob (Safari iOS compatible)
      const base64Data = imageData.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })

      console.log('Image converted. Base64 length:', imageData.length, 'Blob size:', blob.size)

      // Create FormData and append the image
      const formData = new FormData()
      formData.append('image', blob, 'id-card.jpg')

      // Call the verify-id API
      const apiEndpoint = apiUrl('/api/v1/auth/verify-id')
      console.log('Calling API:', apiEndpoint)

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit',
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)

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
      const userDetailsResponse = await fetch(apiUrl('/api/v1/users/me'), {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify ID card. Please try again.'
      setError(errorMessage)
      toast.error('ID verification failed. Please try again.')
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
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-60"
              />
              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-61 max-h-[85vh] overflow-y-auto flex flex-col items-center px-6 py-4"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
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
                  onEditName={handleEditName}
                />
              </div>

              <button
                onClick={() => navigate({ to: '/dashboard' })}
                className="w-full h-12 bg-black rounded-full flex items-center justify-between px-6 mt-auto"
              >
                <span></span>
                <p className="text-base font-black text-white">Get started</p>
                <img alt={"arrow-forward"} src={arrowForwardImg}/>
              </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Edit Name Dialog */}
        <AnimatePresence>
          {showEditNameDialog && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditNameDialog(false)}
                className="fixed inset-0 bg-black z-70"
              />
              {/* Dialog */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-0 flex items-center justify-center z-71 px-6"
              >
                <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                  <h3 className="font-black text-xl text-black text-center mb-4">
                    Edit Name
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#003AAB] focus:ring-1 focus:ring-[#003AAB]"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#003AAB] focus:ring-1 focus:ring-[#003AAB]"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowEditNameDialog(false)}
                      disabled={isUpdatingName}
                      className="flex-1 h-12 border border-gray-300 rounded-full font-semibold text-gray-700 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateName}
                      disabled={isUpdatingName || !editFirstName.trim() || !editLastName.trim()}
                      className="flex-1 h-12 bg-[#003AAB] rounded-full font-semibold text-white disabled:opacity-50"
                    >
                      {isUpdatingName ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </div>
  )
}

