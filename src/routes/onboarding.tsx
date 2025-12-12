import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import backgroundImg from '@/assets/onboarding/background.png'
import logoImg from '@/assets/onboarding/logo.svg'
import lebanonFlagImg from '@/assets/onboarding/lebanon.svg'
import arrowForwardImg from '@/assets/onboarding/arrow_forward.svg'
import qrTemplate from '@/assets/onboarding/qr_template.png'
import { ScannerModal } from '@/components/ScannerModal'

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
  const [showSuccessSheet, setShowSuccessSheet] = useState(false)
  const navigate = useNavigate()

  const handleScanComplete = async (imageData: string) => {
    setIsSubmitting(true)

    // Mock sending to backend
    console.log('Scanned image data:', imageData.substring(0, 100) + '...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 10000))

      // Mock backend response
      console.log('Image successfully sent to backend')

      // Show success sheet
      setShowSuccessSheet(true)
    } catch (error) {
      console.error('Failed to send image to backend:', error)
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
              <div className="relative w-full mb-6">
                {/* Background rotated box */}
                <div
                  className="absolute inset-0 bg-[#76A5FF] rounded-2xl h-44 -rotate-[5deg] shadow-[0_0_30px_0_#385DA4]"
                />
                {/* Foreground box */}
                <div
                  className="relative bg-[#003AAB] rounded-2xl h-44 shadow-[0_0_30px_0_#385DA4] flex flex-row justify-between items-center px-8"
                >
                    <div className={"flex flex-col"}>
                        <p className={"font-black text-[#3C7BF5]"}>Name</p>
                        <p className={"font-bold text-white"}>Melissa Keyrouz</p>
                        <p className={"font-black text-[#3C7BF5] mt-2"}>DOB</p>
                        <p className={"font-bold text-white"}>30/05/1990</p>
                    </div>

                    <img src={qrTemplate} alt={"qrcode"} className={"rounded-xl"}/>
                </div>
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

