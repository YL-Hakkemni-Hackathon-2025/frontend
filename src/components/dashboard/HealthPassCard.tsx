import { useNavigate } from '@tanstack/react-router'
import qrCodeIcon from '@/assets/dashboard/qr-code.svg'

interface HealthPassCardProps {
  hasHealthData: boolean
}

export function HealthPassCard({ hasHealthData }: HealthPassCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (hasHealthData) {
      navigate({ to: '/appointment-selection' })
    }
  }

  return (
    <div className="px-4 -mt-16">
      <button
        onClick={handleClick}
        disabled={!hasHealthData}
        className={`w-full bg-white rounded-xl px-6 py-4 shadow-lg border border-gray-100 flex flex-row items-center justify-between gap-6 text-left ${
          hasHealthData ? 'cursor-pointer active:scale-[0.98] transition-transform' : 'cursor-default'
        }`}
      >
        <img src={qrCodeIcon} alt="qrCodImage" />
        <div className="flex flex-col">
          <h2 className="font-black text-base text-black">HealthPass</h2>
          <p className="text-black font-regular text-xs sm:text-xs mt-0">
            {hasHealthData
              ? 'Create a tailored summary for your next appointment'
              : "Prepare a visit summary once you've added medical information"}
          </p>
        </div>
      </button>
    </div>
  )
}
