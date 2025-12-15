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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 rounded-full outline-none border-2 border-white focus:border-black ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
        style={{
          height: '44px',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: 400,
          boxShadow: '0px 0px 30px 0px #385DA41A',
          WebkitAppearance: 'none',
          appearance: 'none',
          minWidth: 0,
        }}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
