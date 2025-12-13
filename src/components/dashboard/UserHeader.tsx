import menuIcon from '@/assets/dashboard/menu.svg'

interface UserHeaderProps {
  firstName: string
  onMenuClick: () => void
}

export function UserHeader({ firstName, onMenuClick }: UserHeaderProps) {
  return (
    <div className="min-h-[33vh] bg-gradient-to-b from-[#003AAB] to-[#001745] rounded-b-[40px] pb-20">
      {/* Top navigation row */}
      <div className="flex items-center justify-between px-4 pt-12">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="w-12 h-12 bg-[#011A4B] rounded-full flex items-center justify-center shadow-[0_0_30px_0_#385DA41A]"
        >
          <img alt="menu" src={menuIcon} className="w-6 h-6" />
        </button>

        {/* Find a doctor button */}
        <button className="h-12 px-5 bg-[#011A4B] rounded-full flex items-center justify-center shadow-[0_0_30px_0_#385DA41A]">
          <p className="text-white font-black text-sm">Find a doctor</p>
        </button>
      </div>

      {/* Welcome text section */}
      <div className="flex flex-col items-center justify-center mt-6 px-6">
        <h1 className="text-white font-black text-2xl sm:text-3xl text-center">Welcome {firstName}</h1>
        <p className="text-white font-bold text-xs sm:text-sm text-center mt-2">
          This is your private medical space. Nothing is shared without your approval.
        </p>
      </div>
    </div>
  )
}
