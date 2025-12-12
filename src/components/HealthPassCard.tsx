import qrTemplate from '@/assets/onboarding/qr_template.png'
import shareIcon from '@/assets/share.svg'

interface HealthPassCardProps {
  name?: string
  dob?: string
  specialty?: string
  validUntil?: string
  showButton?: boolean
}

export function HealthPassCard({ name = "Melissa Keyrouz", dob = "30/05/1990", specialty, validUntil, showButton = false }: HealthPassCardProps) {
  const cardHeight = showButton ? "h-[239px]" : "h-44"

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
          <p className="font-bold text-white">{name}</p>
          <p className="font-black text-[#3C7BF5] mt-2">DOB</p>
          <p className="font-bold text-white">{dob}</p>
        </div>

        <img src={qrTemplate} alt="qrcode" className="rounded-xl" />
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
