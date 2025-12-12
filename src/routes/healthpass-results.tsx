import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HealthPassCard } from '@/components/HealthPassCard'
import AppleWalletIcon from '@/assets/AppleWallet.svg'
import UserDataIcon from '@/assets/UserDataIcon.svg'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'

export const Route = createFileRoute('/healthpass-results')({
  component: HealthPassResultsPage,
})

function HealthPassResultsPage() {
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
          Dermatology HealthPass
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
            name="Ms. Melissa Keyrouz"
            dob="30/05/1990"
            showButton={true}
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
        Relevant information for this visit
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
