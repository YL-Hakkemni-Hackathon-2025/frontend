import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import backgroundImg from '@/assets/onboarding/background.png'
import logoImg from '@/assets/onboarding/logo.svg'
import lebanonFlagImg from '@/assets/onboarding/lebanon.svg'
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

  const handleScanComplete = async (imageData: string) => {
    setIsSubmitting(true)

    // Mock sending to backend
    console.log('Scanned image data:', imageData.substring(0, 100) + '...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock backend response
      console.log('Image successfully sent to backend')

      // TODO: Handle successful scan - navigate to next step or save token
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
    </div>
  )
}

