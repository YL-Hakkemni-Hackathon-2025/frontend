import qrCodeIcon from '@/assets/dashboard/qr-code.svg'

interface HealthPassCardProps {
  hasHealthData: boolean
}

export function HealthPassCard({ hasHealthData }: HealthPassCardProps) {
  return (
    <div className="px-4 -mt-16">
      <div className="bg-white rounded-xl px-6 py-4 shadow-lg border border-gray-100 flex flex-row items-center justify-between gap-6">
        <img src={qrCodeIcon} alt="qrCodImage" />
        <div className="flex flex-col">
          <h2 className="font-black text-base text-black">HealthPass</h2>
          <p className="font-medium text-base text-black mt-1">
            {hasHealthData
              ? 'Create a tailored summary for your next appointment'
              : "Prepare a visit summary once you've added medical information"}
          </p>
        </div>
      </div>
    </div>
  )
}
