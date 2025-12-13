import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AppStoreDownload from '@/assets/AppStoreDownload.svg'
import PlayStoreDownload from '@/assets/PlayStoreDownload.svg'
import MedicalConditionIcon from '@/assets/MedicalConditionIcon.svg'
import MedicationIcon from '@/assets/MedicationIcon.svg'
import LifeStyleIcon from '@/assets/LifeStyleIcon.svg'
import AllergyIcon from '@/assets/AllergyIcon.svg'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { DocumentSection } from '@/components/DocumentSection'
import { HealthPassPreviewDto } from '@/dtos/health-pass.dto'
import { AppointmentSpecialty } from '@/utils/global.types'
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
  const specialtyName = getSpecialtyDisplayName(healthPass.appointmentSpecialty)

  return (
    <div className="min-h-dvh bg-white">
      {/* Header */}
      <div
        className="w-full p-6"
        style={{
          background: '#003AAB',
        }}
      >
        {/* Top row - Logo and Download buttons */}
        <div className="flex flex-row items-center justify-between mb-[7px]">
          {/* Left - Logo */}
          <img src="/logo.svg" alt="Logo" className="h-12" />

          {/* Right - Download buttons */}
          <div className="flex flex-col gap-[6px]">
            <img src={AppStoreDownload} alt="Download on App Store" className="h-10" />
            <img src={PlayStoreDownload} alt="Get it on Play Store" className="h-10" />
          </div>
        </div>

        {/* Patient Info */}
        {/* Title */}
        <h2
          style={{
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: '24px',
            lineHeight: '128%',
            letterSpacing: '0%',
            color: '#385DA4',
          }}
        >
          {specialtyName} HealthPass
        </h2>

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
            color: '#FFFFFF',
          }}
        >
          {healthPass.gender ? `${healthPass.gender} • ` : ''}DOB: {formatDate(healthPass.dateOfBirth)}
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
      <div className="px-6 pb-16">
        <h2
          style={{
            marginTop: '22px',
            marginBottom: '22px',
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: '18px',
            lineHeight: '121%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: '#000000',
          }}
        >
          Relevant Medical Summary
        </h2>

        {/* AI Profile Summary section */}
        {healthPass.aiProfileSummary && (
          <div
            className="w-full bg-gradient-to-r from-[#001568] to-[#0057FF] rounded-xl flex flex-col px-6 py-4 mb-4"
            style={{
              boxShadow: '0px 0px 30px 0px #0000000D',
            }}
          >
            <h3
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '121%',
                letterSpacing: '0%',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '8px',
              }}
            >
              AI Profile Summary
            </h3>
            <p
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#FFFFFF',
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
        {healthPass.lifestyleChoices && healthPass.lifestyleChoices.length > 0 && (
          <MedicalInfoSection
            title="Lifestyle"
            showToggle={false}
            icon={LifeStyleIcon}
            items={healthPass.lifestyleChoices.map(lifestyle => ({
              title: lifestyle.description,
              description: lifestyle.aiRecommendation || lifestyle.category || 'Lifestyle factor',
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
