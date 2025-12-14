import qrTemplate from '@/assets/onboarding/qr_template.png'
import shareIcon from '@/assets/share.svg'

interface HealthPassCardProps {
  name?: string
  dob?: string
  specialty?: string
  validUntil?: string
  showButton?: boolean
  qrCode?: string
  accessCode?: string
  onEditName?: () => void
}

export function HealthPassCard({
  name = "Melissa Keyrouz",
  dob = "30/05/1990",
  specialty,
  validUntil,
  showButton = false,
  qrCode,
  accessCode,
  onEditName,
}: HealthPassCardProps) {
  const cardHeight = showButton ? "h-[239px]" : "h-44"

  const handleShareWhatsApp = async () => {
    if (!accessCode) return

    // Create the share URL - use production domain or current origin
    const baseUrl = import.meta.env.PROD
      ? 'https://hakkemni.internalizable.dev'
      : window.location.origin
    const shareUrl = `${baseUrl}/health-summary?code=${accessCode}`
    const shareText = `View my HealthPass: ${shareUrl}`

    // Try to use Web Share API if available (mobile)
    if (navigator.share && qrCode) {
      try {
        // Convert base64 QR code to blob for sharing
        const response = await fetch(qrCode)
        const blob = await response.blob()
        const file = new File([blob], 'healthpass-qr.png', { type: 'image/png' })

        await navigator.share({
          title: 'My HealthPass',
          text: shareText,
          files: [file],
        })
        return
      } catch (err) {
        console.log('Web Share API failed, falling back to WhatsApp URL:', err)
      }
    }

    // Fallback: Open WhatsApp with the share URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="relative w-full">
      {/* Background rotated box */}
      <div
        className={`absolute inset-0 bg-[#76A5FF] rounded-2xl ${cardHeight} -rotate-[5deg] shadow-[0_0_30px_0_#385DA4]`}
      />
      {/* Foreground box */}
      <div
        className={`relative bg-[#003AAB] rounded-2xl ${cardHeight} shadow-[0_0_30px_0_#385DA4] flex flex-col`}
      >
        <div className="flex flex-row justify-between items-center px-8 flex-1"
      >
        <div className="flex flex-col">
          {specialty && (
            <>
              <p className="font-black text-[#3C7BF5] text-sm">Specialty</p>
              <p className="font-bold text-white text-lg mb-2">{specialty}</p>
            </>
          )}
          {validUntil && (
            <>
              <p className="font-black text-[#3C7BF5] text-sm">Valid Until</p>
              <p className="font-bold text-white text-lg mb-2">{validUntil}</p>
            </>
          )}
          <p className="font-black text-[#3C7BF5]">Name</p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-white">{name}</p>
            {onEditName && (
              <button
                onClick={onEditName}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[#3C7BF5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="font-black text-[#3C7BF5] mt-2">DOB</p>
          <p className="font-bold text-white">{dob}</p>
        </div>

        <img src={qrCode || qrTemplate} alt="qrcode" className="rounded-xl w-[100px] h-[100px] object-contain bg-white" />
        </div>

        {/* Button section - conditionally rendered */}
        {showButton && (
          <div
            className="h-[95px] rounded-b-2xl flex items-center justify-between px-6"
            style={{
              background: 'linear-gradient(90deg, #003AAB 0%, #001845 100%)',
            }}
          >
            <p className="font-medium text-white text-sm">Scan at clinic or</p>
            <button
              onClick={handleShareWhatsApp}
              className="px-4 h-[44px] rounded-full flex flex-row items-center justify-center gap-2"
              style={{
                background: '#003AAB',
              }}
            >
              <img src={shareIcon} alt="share" className="w-5 h-5" />
              <p className="font-bold text-white text-xs">Share via Whatsapp</p>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
