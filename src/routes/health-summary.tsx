import { createFileRoute } from '@tanstack/react-router'
import AppStoreDownload from '@/assets/AppStoreDownload.svg'
import PlayStoreDownload from '@/assets/PlayStoreDownload.svg'
import MedicalConditionIcon from '@/assets/MedicalConditionIcon.svg'
import MedicationIcon from '@/assets/MedicationIcon.svg'
import LifeStyleIcon from '@/assets/LifeStyleIcon.svg'
import AllergyIcon from '@/assets/AllergyIcon.svg'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { DocumentSection } from '@/components/DocumentSection'

export const Route = createFileRoute('/health-summary')({
  component: HealthSummaryPage,
})

function HealthSummaryPage() {
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
          HealthPass
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
          Melissa Keyrouz, 27
        </h1>

        {/* Generated Date */}
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
          Generated on 15/12/2025
        </p>
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

        {/* Documents section */}
        <DocumentSection
          title="Documents"
          items={[
            {
              title: 'CBC Complete Blood Count',
              date: '27 October 2025',
              aiSummary: 'CBC shows normal white cells and hemoglobin. Slightly low iron markers noted, consistent with mild iron deficiency.',
            },
          ]}
        />

        {/* Medical conditions section */}
        <MedicalInfoSection
          title="Medical conditions"
          showToggle={false}
          icon={MedicalConditionIcon}
          items={[
            {
              title: 'Eczema',
              description: 'Diagnosed: 12/04/2018',
              isRelevant: true,
            },
            {
              title: 'Migraine',
              description: 'Diagnosed: 12/04/2018',
              isRelevant: true,
            },
          ]}
        />

        {/* Medications section */}
        <MedicalInfoSection
          title="Medications"
          showToggle={false}
          icon={MedicationIcon}
          items={[
            {
              title: 'Paracetamol (Doliprane)',
              description: 'Prescribed: 05/08/2020',
              isRelevant: true,
            },
          ]}
        />

        {/* Lifestyle section */}
        <MedicalInfoSection
          title="Lifestyle"
          showToggle={false}
          icon={LifeStyleIcon}
          items={[
            {
              title: 'Non-smoker',
              description: 'Updated: 01/01/2024',
              isRelevant: true,
            },
          ]}
        />

        {/* Allergies section */}
        <MedicalInfoSection
          title="Allergies"
          showToggle={false}
          icon={AllergyIcon}
          items={[
            {
              title: 'Peanuts',
              description: 'Diagnosed: 15/03/2015',
              isRelevant: true,
            },
          ]}
        />
      </div>
    </div>
  )
}
