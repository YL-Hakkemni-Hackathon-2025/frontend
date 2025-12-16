interface FormSelectProps {
  label: string
  optional?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}

export function FormSelect({ label, optional = false, placeholder, value, onChange, options, disabled = false }: FormSelectProps) {
  return (
    <div>
      <label
        className="block mb-2"
        style={{
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '121%',
          letterSpacing: '0%',
          verticalAlign: 'middle',
          color: disabled ? '#9CA3AF' : '#000000',
        }}
      >
        <span style={{ fontWeight: 900 }}>{label}</span>
        {optional && <span style={{ fontWeight: 400 }}> (Optional)</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 pr-10 rounded-full outline-none border-2 border-white focus:border-black ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
          style={{
            height: '44px',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400,
            boxShadow: '0px 0px 30px 0px #385DA41A',
            WebkitAppearance: 'none',
            appearance: 'none',
            minWidth: 0,
            color: value ? '#000000' : '#9E9E9E',
          }}
        >
          <option value="" style={{ color: '#9E9E9E' }}>{placeholder || 'Select...'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ color: '#000000' }}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Dropdown arrow icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
