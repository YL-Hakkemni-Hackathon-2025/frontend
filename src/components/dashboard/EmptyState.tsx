import circlesIcon from '@/assets/Circles.svg'

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center px-6">
      <img src={circlesIcon} alt="circles" className="mb-4" />
      <h2 className="font-bold text-base text-black text-center">Start building your Space</h2>
    </div>
  )
}
