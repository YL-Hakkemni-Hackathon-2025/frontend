import DocumentIcon from '@/assets/DocumentIcon.svg'
import DownloadIcon from '@/assets/download.svg'

interface DocumentItemProps {
  title: string
  date: string
  aiSummary: string
  isLast?: boolean
}

export function DocumentItem({ title, date, aiSummary, isLast }: DocumentItemProps) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        paddingTop: '16px',
        paddingBottom: isLast ? '0' : '16px',
        borderBottom: isLast ? 'none' : '1px solid #F5F5F5',
      }}
    >
      {/* Top section with icon, title, date, and download button */}
      <div className="flex flex-row items-center w-full mb-4">
        {/* Icon */}
        <img src={DocumentIcon} alt="Document" className="w-6 h-6 mr-3" />

        {/* Title and date */}
        <div className="flex flex-col flex-1">
          <h4
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '121%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              color: '#000000',
            }}
          >
            {title}
          </h4>
          <p
            style={{
              marginTop: '4px',
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '121%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              color: '#AEAEAE',
            }}
          >
            {date}
          </p>
        </div>

        {/* Download button */}
        <button
          className="flex items-center justify-center"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#F7F7F7',
          }}
        >
          <img src={DownloadIcon} alt="Download" className="w-6 h-6" />
        </button>
      </div>

      {/* AI Summary section */}
      <div className="flex flex-col" style={{ marginLeft: '36px' }}>
        <h5
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '121%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: '#000000',
            marginBottom: '8px',
          }}
        >
          AI summary
        </h5>
        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '121%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: '#5C5C5C',
          }}
        >
          {aiSummary}
        </p>
      </div>
    </div>
  )
}
