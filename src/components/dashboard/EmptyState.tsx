import documentsIcon from '@/assets/dashboard/documents.svg'

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center pt-16 px-6">
      <img src={documentsIcon} alt="documents" className="mb-4" />
      <h2 className="font-bold text-base text-black text-center">Start building your Health Space</h2>
      <p className="font-normal text-base text-black text-center mt-1">
        Add your medical information here. We'll use it later to prepare Health Passes for your medical visits
      </p>
    </div>
  )
}
