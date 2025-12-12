interface FormTextAreaProps {
  label: string
  optional?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

export function FormTextArea({ label, optional = false, placeholder, value, onChange, rows = 4 }: FormTextAreaProps) {
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
          color: '#000000',
        }}
      >
        <span style={{ fontWeight: 900 }}>{label}</span>
        {optional && <span style={{ fontWeight: 400 }}> (Optional)</span>}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-3xl outline-none border-2 border-white focus:border-black resize-none"
        rows={rows}
        style={{
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: 400,
          boxShadow: '0px 0px 30px 0px #385DA41A',
        }}
      />
    </div>
  )
}
