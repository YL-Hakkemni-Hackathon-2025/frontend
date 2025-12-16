import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import MedicalConditionIcon from '@/assets/MedicalConditionIcon.svg'
import MedicationIcon from '@/assets/MedicationIcon.svg'
import LifeStyleIcon from '@/assets/LifeStyleIcon.svg'
import AllergyIcon from '@/assets/AllergyIcon.svg'
import AIIcon from '@/assets/AIIcon.svg'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { DocumentSection } from '@/components/DocumentSection'
import { HealthPassPreviewDto } from '@/dtos/health-pass.dto'
import { apiUrl } from '@/utils/api'

interface SearchParams {
  code?: string
}

export const Route = createFileRoute('/health-summary')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      code: search.code as string | undefined,
    }
  },
  component: HealthSummaryPage,
})

// Helper function to format dates
function formatDate(date: Date | string | undefined | null): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-GB')
}

// Helper to calculate age from date of birth
function calculateAge(dob: Date | string): number {
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function HealthSummaryPage() {
  const { code } = Route.useSearch()
  const [healthPass, setHealthPass] = useState<HealthPassPreviewDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch health pass data using access code
  useEffect(() => {
    const fetchHealthPass = async () => {
      if (!code) {
        setError('No access code provided')
        toast.error('No access code provided')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(apiUrl(`/api/v1/health-passes/access/${code}`), {
          method: 'GET',
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setHealthPass(result.data)
        } else {
          setError(result.message || 'Failed to fetch health pass')
          toast.error(result.message || 'Failed to load HealthPass')
        }
      } catch (err) {
        console.error('Error fetching health pass:', err)
        setError('An error occurred while loading the HealthPass')
        toast.error('Failed to load HealthPass. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthPass()
  }, [code])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#003AAB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading HealthPass...</p>
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
          <p className="text-gray-400 text-sm">The link may have expired or is invalid.</p>
        </div>
      </div>
    )
  }

  const age = healthPass.dateOfBirth ? calculateAge(healthPass.dateOfBirth) : ''

  return (
    <div className="min-h-dvh bg-white relative">
      {/* Background ellipse - covers half the screen */}
      <div className="absolute top-0 left-0 right-0 h-[65vh] w-full overflow-hidden z-0">
        <div
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[280%] h-full"
          style={{
            background: 'linear-gradient(to bottom, #003AAB 0%, #001745 100%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Header */}
      <div
        className="w-full p-6 relative z-10"
      >
        {/* Top row - Logo and Download buttons */}
        <div className="flex flex-row items-center justify-center mb-[45px] mt-[25px]">
          {/* Left - Logo */}
          <img src="/logo.svg" alt="Logo" className="h-12" />
        </div>

        {/* Patient Name and Age */}
        <h1
          style={{
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: '32px',
            lineHeight: '128%',
            letterSpacing: '0%',
            color: '#FFFFFF',
          }}
        >
          {healthPass.patientName}{age ? `, ${age}` : ''}
        </h1>

        {/* Gender and DOB */}
        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '150%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: '#CFCFCF',
          }}
        >
          {healthPass.gender ? `${healthPass.gender} • ` : ''}HealthPass generated on {formatDate(new Date())}
        </p>

        {/* Appointment info if available */}
        {healthPass.appointmentDate && (
          <p
            style={{
              marginTop: '8px',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '150%',
              color: '#76A5FF',
            }}
          >
            Appointment: {formatDate(healthPass.appointmentDate)}
          </p>
        )}
      </div>

      {/* Medical Summary Section */}
      <div className="px-6 pb-16 relative z-10">

        {/* AI Profile Summary section */}
        {healthPass.aiProfileSummary && (
          <div
            className="w-full bg-white rounded-xl flex flex-col px-6 py-4 mb-4"
            style={{
              boxShadow: '0px 0px 30px 0px #0000000D',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <img src={AIIcon} alt="AI" className="w-4 h-4" />
              <h3
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '121%',
                  letterSpacing: '0%',
                  color: '#000000',
                }}
              >
                AI Profile Summary
              </h3>
            </div>
            <p
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#000000',
              }}
            >
              {healthPass.aiProfileSummary}
            </p>
          </div>
        )}


        {/* Documents section */}
        {healthPass.documents && healthPass.documents.length > 0 && (
          <DocumentSection
            title="Documents"
            items={healthPass.documents.map(doc => ({
              id: doc.id,
              title: doc.documentName,
              date: doc.documentDate ? formatDate(doc.documentDate) : 'No date',
              aiSummary: doc.aiRecommendation || doc.notes || '',
              fileUrl: doc.fileUrl,
            }))}
          />
        )}

        {/* Medical conditions section */}
        {healthPass.medicalConditions && healthPass.medicalConditions.length > 0 && (
          <MedicalInfoSection
            title="Medical conditions"
            showToggle={false}
            icon={MedicalConditionIcon}
            items={healthPass.medicalConditions.map(condition => ({
              title: condition.name,
              description: condition.aiRecommendation || (condition.diagnosedDate ? `Diagnosed: ${formatDate(condition.diagnosedDate)}` : 'No diagnosis date'),
              isRelevant: true,
            }))}
          />
        )}

        {/* Medications section */}
        {healthPass.medications && healthPass.medications.length > 0 && (
          <MedicalInfoSection
            title="Medications"
            showToggle={false}
            icon={MedicationIcon}
            items={healthPass.medications.map(medication => ({
              title: medication.medicationName,
              description: medication.aiRecommendation || (medication.dosageAmount ? `Dosage: ${medication.dosageAmount}` : 'No dosage info'),
              isRelevant: true,
            }))}
          />
        )}

        {/* Lifestyle section */}
        {healthPass.habits && healthPass.habits.length > 0 && (
          <MedicalInfoSection
            title="Lifestyle"
            showToggle={false}
            icon={LifeStyleIcon}
            items={healthPass.habits.map(habit => ({
              title: habit.category.charAt(0).toUpperCase() + habit.category.slice(1),
              description: habit.aiRecommendation || habit.frequency || 'Lifestyle habit',
              isRelevant: true,
            }))}
          />
        )}

        {/* Allergies section */}
        {healthPass.allergies && healthPass.allergies.length > 0 && (
          <MedicalInfoSection
            title="Allergies"
            showToggle={false}
            icon={AllergyIcon}
            items={healthPass.allergies.map(allergy => ({
              title: allergy.allergen,
              description: allergy.aiRecommendation || (allergy.severity ? `Severity: ${allergy.severity}` : 'No severity info'),
              isRelevant: true,
            }))}
          />
        )}

        {/* Appointment notes if available */}
        {healthPass.appointmentNotes && (
          <div
            className="w-full bg-gray-50 rounded-xl p-4 mt-4"
            style={{ border: '1px solid #E5E5E5' }}
          >
            <h3 className="font-bold text-sm text-gray-700 mb-2">Appointment Notes</h3>
            <p className="text-sm text-gray-600">{healthPass.appointmentNotes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
