import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import toast from 'react-hot-toast'
import { HealthPassCard } from '@/components/HealthPassCard'
import AppleWalletIcon from '@/assets/AppleWallet.svg'
import UserDataIcon from '@/assets/UserDataIcon.svg'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { userAtom } from '@/atoms/user.atom'
import { userDetailsAtom } from '@/atoms/userDetails.atom'
import { HealthPassResponseDto } from '@/dtos/health-pass.dto'
import { AppointmentSpecialty } from '@/utils/global.types'
import { apiUrl } from '@/utils/api'

interface SearchParams {
  healthPassId?: string
}

export const Route = createFileRoute('/healthpass-results')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      healthPassId: search.healthPassId as string | undefined,
    }
  },
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: HealthPassResultsPage,
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
  return names[specialty] || 'Medical'
}

// Helper function to format dates
function formatDate(date: Date | string | undefined | null): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-GB')
}

function HealthPassResultsPage() {
  const { healthPassId } = Route.useSearch()
  const navigate = useNavigate()
  const authData = useAtomValue(userAtom)
  const userDetails = useAtomValue(userDetailsAtom)

  const [healthPass, setHealthPass] = useState<HealthPassResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch health pass data
  useEffect(() => {
    const fetchHealthPass = async () => {
      if (!healthPassId || !authData?.accessToken) {
        setError('Invalid health pass ID or not authenticated')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(apiUrl(`/api/v1/health-passes/${healthPassId}`), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
          },
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setHealthPass(result.data)
        } else {
          setError(result.message || 'Failed to fetch health pass')
        }
      } catch (err) {
        console.error('Error fetching health pass:', err)
        setError('An error occurred while loading your HealthPass')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthPass()
  }, [healthPassId, authData])

  // Toggle item handler - creates a handler for a specific item type
  const createToggleHandler = (itemType: 'medicalCondition' | 'medication' | 'allergy' | 'lifestyle' | 'document') => {
    return async (itemId: string, isEnabled: boolean) => {
      if (!healthPassId || !authData?.accessToken) {
        toast.error('Not authenticated')
        throw new Error('Not authenticated')
      }

      const response = await fetch(apiUrl(`/api/v1/health-passes/${healthPassId}/toggle-item`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.accessToken}`,
        },
        body: JSON.stringify({
          itemType,
          itemId,
          isEnabled,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to update item')
        throw new Error(result.message || 'Failed to toggle item')
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading your HealthPass...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !healthPass) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <p className="text-gray-500">{error || 'Failed to load HealthPass'}</p>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const specialtyName = getSpecialtyDisplayName(healthPass.appointmentSpecialty)

  return (
    <div className="relative min-h-dvh bg-white">
      {/* Top curved section with gradient - 30% of screen - BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[35vh] w-full overflow-hidden z-0">
        <div
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[220%] h-full"
          style={{
            background: 'linear-gradient(to bottom left, #FF0000 10%, #001568 60%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Close button - top right */}
      <button
        onClick={() => navigate({ to: '/dashboard' })}
        className="absolute top-6 right-6 w-[45px] h-[45px] rounded-full flex items-center justify-center z-20"
        style={{
          background: '#FFFFFF80',
          boxShadow: '0px 0px 30px 0px #385DA41A',
        }}
      >
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content section - ON TOP */}
      <div className="relative z-10 flex flex-col items-start px-6 pt-20 pb-16">
        {/* Title */}
        <h1
          className="text-white"
          style={{
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: '24px',
            lineHeight: '150%',
            letterSpacing: '0%',
          }}
        >
          {specialtyName} HealthPass
        </h1>

        {/* Subtitle */}
        <p
          className="text-white mb-8"
          style={{
            marginTop: '8px',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '150%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
          }}
        >
          Share this before or during your visit so your doctor sees exactly what matters
        </p>

        {/* Health Pass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full mb-8"
        >
          <HealthPassCard
            name={userDetails?.fullName || authData?.user?.fullName || ''}
            dob={formatDate(userDetails?.dateOfBirth)}
            showButton={true}
            qrCode={healthPass.qrCode}
            accessCode={healthPass.accessCode}
          />
        </motion.div>

      {/* Action button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full h-[55px] rounded-xl flex items-center justify-center gap-3"
        style={{ background: '#000000', marginBottom: '45px' }}
      >
        <img src={AppleWalletIcon} alt="Apple Wallet" className="w-8 h-6" />
        <p
          className="text-white"
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '121%',
            letterSpacing: '0%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          Add to Apple Wallet
        </p>
      </motion.button>

      {/* Section title */}
      <h2
        className="text-black"
        style={{
          fontFamily: 'Inter',
          fontWeight: 900,
          fontSize: '18px',
          lineHeight: '121%',
          letterSpacing: '0%',
          verticalAlign: 'middle',
        }}
      >
        Included in your Pass
      </h2>

      {/* Information box */}
      <div
        className="w-full h-[70px] bg-white rounded-xl flex flex-row items-center justify-between px-6"
        style={{
          marginTop: '16px',
          boxShadow: '0px 0px 30px 0px #0000000D',
        }}
      >
        {/* Left section */}
        <div className="flex flex-col">
          <h3
            className="text-black"
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '121%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
            }}
          >
            Name, Gender, DOB
          </h3>
          <p
            className="text-[#0057FF]"
            style={{
              marginTop: '4px',
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '121%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
            }}
          >
            Required for all medical visits
          </p>
        </div>

        {/* Right section - Icon */}
        <img src={UserDataIcon} alt="User Data" className="w-6 h-6" />
      </div>


      {/* Medical conditions section */}
      {healthPass.medicalConditions.length > 0 && (
        <MedicalInfoSection
          title="Medical conditions"
          items={healthPass.medicalConditions.map(item => ({
            id: item.data.id,
            title: item.data.name,
            description: item.aiRecommendation || (item.isRelevant ? `Relevant to ${specialtyName.toLowerCase()} care` : `Not relevant to ${specialtyName.toLowerCase()} care`),
            isRelevant: item.isRelevant,
          }))}
          onToggle={createToggleHandler('medicalCondition')}
        />
      )}

      {/* Medications section */}
      {healthPass.medications.length > 0 && (
        <MedicalInfoSection
          title="Medications"
          items={healthPass.medications.map(item => ({
            id: item.data.id,
            title: item.data.medicationName,
            description: item.aiRecommendation || (item.isRelevant ? 'Relevant for treatment decisions' : 'Not currently relevant'),
            isRelevant: item.isRelevant,
          }))}
          onToggle={createToggleHandler('medication')}
        />
      )}

      {/* Allergies section */}
      {healthPass.allergies.length > 0 && (
        <MedicalInfoSection
          title="Allergies"
          items={healthPass.allergies.map(item => ({
            id: item.data.id,
            title: item.data.allergen,
            description: item.aiRecommendation || (item.isRelevant ? 'Important for treatment safety' : 'Not currently relevant'),
            isRelevant: item.isRelevant,
          }))}
          onToggle={createToggleHandler('allergy')}
        />
      )}

      {/* Lifestyle section */}
      {healthPass.habits && healthPass.habits.length > 0 && (
        <MedicalInfoSection
          title="Lifestyle"
          items={healthPass.habits.map(item => ({
            id: item.data.category,
            title: item.data.category.charAt(0).toUpperCase() + item.data.category.slice(1),
            description: item.aiRecommendation || (item.isRelevant ? 'Relevant lifestyle factor' : 'Not currently relevant'),
            isRelevant: item.isRelevant,
          }))}
          onToggle={createToggleHandler('lifestyle')}
        />
      )}

      {/* Documents section */}
      {healthPass.documents.length > 0 && (
        <MedicalInfoSection
          title="Documents"
          items={healthPass.documents.map(item => ({
            id: item.data.id,
            title: item.data.documentName,
            description: item.aiRecommendation || (item.isRelevant ? 'Relevant document' : 'Not currently relevant'),
            isRelevant: item.isRelevant,
          }))}
          onToggle={createToggleHandler('document')}
        />
      )}
      </div>
    </div>
  )
}
