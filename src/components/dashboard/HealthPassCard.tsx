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
      <div
        className="w-full bg-white rounded-xl px-6 py-6 shadow-lg border border-gray-100 flex flex-col gap-4"
      >
        <div className="flex flex-row items-center gap-6">
          <img src={qrCodeIcon} alt="qrCodImage" />
          <div className="flex flex-col">
            {/* <h2 className="font-black text-base text-black">HealthPass</h2> */}
            <p className="text-black font-medium text-sm leading-[121%] mt-0">
              {hasHealthData
                ? 'Create a tailored summary for your next appointment'
                : "Prepare a visit summary once you've added medical information"}
            </p>
          </div>
        </div>
        <button
          onClick={handleClick}
          disabled={!hasHealthData}
          className="w-full h-[45px] bg-[#012366] text-white rounded-full flex items-center justify-center font-bold text-sm leading-[121%]"
        >
          Create new healthpass
        </button>
      </div>
    </div>
  )
}
