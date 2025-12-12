import { createFileRoute } from '@tanstack/react-router'
import AppStoreDownload from '@/assets/AppStoreDownload.svg'
import PlayStoreDownload from '@/assets/PlayStoreDownload.svg'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'

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
      <div className="px-6">
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

        {/* Medical conditions section */}
        <MedicalInfoSection
          title="Medical conditions"
          items={[
            {
              title: 'Eczema',
              description: 'Relevant to dermatology care',
              isRelevant: true,
            },
            {
              title: 'Migraine',
              description: 'Not relevant to dermatology care',
              isRelevant: false,
            },
          ]}
        />

        {/* Medications section */}
        <MedicalInfoSection
          title="Medications"
          items={[
            {
              title: 'Paracetamol (Doliprane)',
              description: 'Relevant for skin treatment decisions',
              isRelevant: true,
            },
          ]}
        />
      </div>
    </div>
  )
}
