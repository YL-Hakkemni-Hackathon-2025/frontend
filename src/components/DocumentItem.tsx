import { useState } from 'react'
import DocumentIcon from '@/assets/DocumentIcon.svg'
import DownloadIcon from '@/assets/download.svg'
import AIIcon from '@/assets/AIIcon.svg'

interface DocumentItemProps {
  title: string
  date: string
  aiSummary: string
  isLast?: boolean
  fileUrl?: string
  onClick?: () => void
}

export function DocumentItem({ title, date, aiSummary, isLast, fileUrl, onClick }: DocumentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!fileUrl) return

    setIsDownloading(true)

    // Detect if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    try {
      if (isIOS) {
        // For iOS, directly open in new tab - Safari doesn't support programmatic downloads well
        window.open(fileUrl, '_blank')
      } else {
        // For other browsers, try to download
        const response = await fetch(fileUrl)
        const blob = await response.blob()

        // Create a download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = title || 'document.pdf'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()

        // Clean up after a short delay
        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }, 100)
      }
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback to opening in new tab
      window.open(fileUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className={`flex flex-col w-full ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
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
          onClick={(e) => handleDownload(e)}
          disabled={!fileUrl || isDownloading}
          className="flex items-center justify-center"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#F7F7F7',
            cursor: fileUrl && !isDownloading ? 'pointer' : 'not-allowed',
            opacity: fileUrl && !isDownloading ? 1 : 0.5,
          }}
        >
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <img src={DownloadIcon} alt="Download" className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* AI Summary section */}
      <div className="flex flex-col" style={{ marginLeft: '36px' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <img src={AIIcon} alt="AI" className="w-4 h-4" />
          <h5
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
            AI summary
          </h5>
        </div>
        {isExpanded ? (
          <p
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#5C5C5C',
            }}
          >
            {aiSummary}
            {aiSummary && aiSummary.length > 100 && (
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#000000',
                  marginLeft: '4px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                View less
              </button>
            )}
          </p>
        ) : (
          <p
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#5C5C5C',
            }}
          >
            {aiSummary && aiSummary.length > 100 ? (
              <>
                {aiSummary.substring(0, 100)}...{' '}
                <button
                  onClick={() => setIsExpanded(true)}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#000000',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  View more
                </button>
              </>
            ) : (
              aiSummary
            )}
          </p>
        )}
      </div>
    </div>
  )
}
