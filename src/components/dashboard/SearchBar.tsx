import searchIcon from '@/assets/search (1).svg'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-4 mt-6">
      <div className="w-full h-12 rounded-full flex flex-row items-center px-4 gap-3" style={{ background: '#F1F1F1' }}>
        <img src={searchIcon} alt="search" className="w-6 h-6" />
        <input
          type="text"
          placeholder="Search space"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder:text-[#AEAEAE]"
          style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '121%',
            letterSpacing: '0%',
            color: '#000000',
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">×</span>
          </button>
        )}
      </div>
    </div>
  )
}
