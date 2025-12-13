import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import toast from 'react-hot-toast'
import { userAtom } from '@/atoms/user.atom'
import { AppointmentSpecialty } from '@/utils/global.types'
import { apiUrl } from '@/utils/api'

interface SearchParams {
  specialty?: AppointmentSpecialty
}

export const Route = createFileRoute('/generate-healthpass')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      specialty: search.specialty as AppointmentSpecialty | undefined,
    }
  },
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: GenerateHealthPassPage,
})

// Helper to get display name for specialty
function getSpecialtyDisplayName(specialty: AppointmentSpecialty): string {
  const names: Record<AppointmentSpecialty, string> = {
    [AppointmentSpecialty.GASTROENTEROLOGY]: 'Gastroenterology',
    [AppointmentSpecialty.ORTHOPEDICS]: 'Orthopedics',
    [AppointmentSpecialty.CARDIOLOGY]: 'Cardiology',
    [AppointmentSpecialty.DERMATOLOGY]: 'Dermatology',
    [AppointmentSpecialty.NEUROLOGY]: 'Neurology',
    [AppointmentSpecialty.OPHTHALMOLOGY]: 'Ophthalmology',
    [AppointmentSpecialty.PEDIATRICS]: 'Pediatrics',
    [AppointmentSpecialty.PSYCHIATRY]: 'Psychiatry',
    [AppointmentSpecialty.RADIOLOGY]: 'Radiology',
    [AppointmentSpecialty.UROLOGY]: 'Urology',
    [AppointmentSpecialty.GYNECOLOGY]: 'Gynecology',
    [AppointmentSpecialty.ONCOLOGY]: 'Oncology',
    [AppointmentSpecialty.PULMONOLOGY]: 'Pulmonology',
    [AppointmentSpecialty.RHEUMATOLOGY]: 'Rheumatology',
    [AppointmentSpecialty.ENDOCRINOLOGY]: 'Endocrinology',
    [AppointmentSpecialty.NEPHROLOGY]: 'Nephrology',
    [AppointmentSpecialty.GENERAL_PRACTICE]: 'General Practice',
    [AppointmentSpecialty.EMERGENCY]: 'Emergency',
    [AppointmentSpecialty.OTHER]: 'Other',
  }
  return names[specialty] || 'your doctor'
}

function GenerateHealthPassPage() {
  const navigate = useNavigate()
  const { specialty } = Route.useSearch()
  const authData = useAtomValue(userAtom)
  const [error, setError] = useState<string | null>(null)

  const specialtyName = specialty ? getSpecialtyDisplayName(specialty) : 'your doctor'

  const messages = [
    `Preparing your ${specialtyName} HealthPass…`,
    "Analyzing your medical history…",
    `Selecting the information your ${specialtyName.toLowerCase()} actually needs…`,
    "Preparing your HealthPass…"
  ]

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [messages.length])

  // Call the health-pass API
  useEffect(() => {
    const createHealthPass = async () => {
      if (!authData?.accessToken) {
        setError('Not authenticated')
        toast.error('Not authenticated. Please log in again.')
        return
      }

      try {
        const response = await fetch(apiUrl('/api/v1/health-passes'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.accessToken}`,
          },
          body: JSON.stringify({
            appointmentSpecialty: specialty || 'general_practice',
          }),
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Navigate to healthpass-results with the health pass ID
          navigate({
            to: '/healthpass-results',
            search: { healthPassId: result.data.id }
          })
        } else {
          console.error('Failed to create health pass:', result)
          setError(result.message || 'Failed to generate HealthPass')
          toast.error(result.message || 'Failed to generate HealthPass. Please try again.')
        }
      } catch (err) {
        console.error('Error creating health pass:', err)
        setError('An error occurred while generating your HealthPass')
        toast.error('An error occurred. Please try again.')
      }
    }

    createHealthPass()
  }, [authData, specialty, navigate])

  // Show error state
  if (error) {
    return (
      <div className="relative min-h-dvh w-full overflow-hidden bg-[#001568] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-black text-2xl text-white mb-4">Something went wrong</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black font-bold rounded-full"
            >
              Try again
            </button>
            <button
              onClick={() => navigate({ to: '/dashboard' })}
              className="px-6 py-3 bg-white/20 text-white font-bold rounded-full"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#001568]">
      {/* Animated gradient background - scaled larger to create movement effect */}
      <motion.div
        className="absolute -inset-[50%]"
        style={{
          background: 'linear-gradient(225deg, #FF0000 0%, #001568 50%, #001568 100%)',
        }}
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [-50, 50, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-dvh px-6 pt-16 flex justify-start">
        <div className="text-left max-w-xs">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentMessageIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-black text-2xl text-white mb-4"
            >
              {messages[currentMessageIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
