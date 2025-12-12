import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import closeIcon from '@/assets/close.svg'
import { AppointmentSpecialty } from '@/utils/global.types'

export const Route = createFileRoute('/appointment-selection')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: AppointmentSelectionPage,
})

const specialtyOptions = [
  { value: AppointmentSpecialty.GENERAL_PRACTICE, label: 'General Practice', icon: '🩺' },
  { value: AppointmentSpecialty.CARDIOLOGY, label: 'Cardiology', icon: '❤️' },
  { value: AppointmentSpecialty.DERMATOLOGY, label: 'Dermatology', icon: '🧴' },
  { value: AppointmentSpecialty.GASTROENTEROLOGY, label: 'Gastroenterology', icon: '🫃' },
  { value: AppointmentSpecialty.NEUROLOGY, label: 'Neurology', icon: '🧠' },
  { value: AppointmentSpecialty.ORTHOPEDICS, label: 'Orthopedics', icon: '🦴' },
  { value: AppointmentSpecialty.OPHTHALMOLOGY, label: 'Ophthalmology', icon: '👁️' },
  { value: AppointmentSpecialty.PEDIATRICS, label: 'Pediatrics', icon: '👶' },
  { value: AppointmentSpecialty.PSYCHIATRY, label: 'Psychiatry', icon: '🧘' },
  { value: AppointmentSpecialty.PULMONOLOGY, label: 'Pulmonology', icon: '🫁' },
  { value: AppointmentSpecialty.GYNECOLOGY, label: 'Gynecology', icon: '🩷' },
  { value: AppointmentSpecialty.UROLOGY, label: 'Urology', icon: '🚽' },
  { value: AppointmentSpecialty.ONCOLOGY, label: 'Oncology', icon: '🎗️' },
  { value: AppointmentSpecialty.RHEUMATOLOGY, label: 'Rheumatology', icon: '🦵' },
  { value: AppointmentSpecialty.ENDOCRINOLOGY, label: 'Endocrinology', icon: '🦋' },
  { value: AppointmentSpecialty.NEPHROLOGY, label: 'Nephrology', icon: '🫘' },
  { value: AppointmentSpecialty.RADIOLOGY, label: 'Radiology', icon: '📷' },
  { value: AppointmentSpecialty.EMERGENCY, label: 'Emergency', icon: '🚨' },
  { value: AppointmentSpecialty.OTHER, label: 'Other', icon: '➕' },
]

function AppointmentSelectionPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSpecialties = specialtyOptions.filter((specialty) =>
    specialty.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSpecialtySelect = (specialty: AppointmentSpecialty) => {
    // TODO: Navigate to next step with selected specialty
    console.log('Selected specialty:', specialty)
    navigate({ to: '/generate-healthpass', search: { specialty } })
  }

  return (
    <div className="min-h-dvh bg-[#F5F5F5] flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-b from-[#003AAB] to-[#001745] rounded-b-[40px] pb-8">
        {/* Top navigation */}
        <div className="flex items-start justify-between px-4 pt-12">
          {/* Empty space for alignment */}
          <div className="w-12 h-12" />

          {/* Close button */}
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            <img alt="close" src={closeIcon} className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
          </button>
        </div>

        {/* Title section */}
        <div className="flex flex-col items-center justify-center mt-4 mb-2 px-6">
          <h1 className="text-white font-black text-3xl">
            What is your next appointment for?
          </h1>
          <p className="text-white font-medium text-base mt-2">
            Generate a tailored summary for your next appointment
          </p>
        </div>
      </div>

      {/* White content area */}
      <div className="flex-1 -mt-4 mx-4 mb-4 bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="px-4 pt-6 pb-4">
          <div className="w-full h-12 rounded-full flex flex-row items-center px-4 gap-3" style={{ background: '#F1F1F1' }}>
            <svg
              className="w-5 h-5 text-[#AEAEAE]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-[#AEAEAE] text-black"
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Specialty list */}
        <div className="flex-1 px-4 pb-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {filteredSpecialties.map((specialty) => (
              <button
                key={specialty.value}
                onClick={() => handleSpecialtySelect(specialty.value)}
                className="w-full bg-[#F9F9F9] rounded-xl px-4 py-3 flex items-center gap-3 active:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{specialty.icon}</span>
                <span
                  className="text-black font-medium text-sm"
                  style={{ fontFamily: 'Inter' }}
                >
                  {specialty.label}
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}

            {filteredSpecialties.length === 0 && (
              <p className="text-gray-400 text-center py-8 text-sm">
                No specialties found for "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

