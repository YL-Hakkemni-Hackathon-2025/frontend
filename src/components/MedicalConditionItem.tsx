import { useState } from 'react'

interface MedicalConditionItemProps {
  title: string
  description: string
  isRelevant?: boolean
  isLast?: boolean
  showToggle?: boolean
  icon?: string
  itemId?: string
  onToggle?: (itemId: string, isEnabled: boolean) => Promise<void>
  onClick?: () => void
}

export function MedicalConditionItem({
  title,
  description,
  isRelevant = true,
  isLast = false,
  showToggle = true,
  icon,
  itemId,
  onToggle,
  onClick,
}: MedicalConditionItemProps) {
  const [isEnabled, setIsEnabled] = useState(isRelevant)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (!itemId || !onToggle) {
      // If no callback, just toggle locally
      setIsEnabled(!isEnabled)
      return
    }

    setIsLoading(true)
    try {
      await onToggle(itemId, !isEnabled)
      setIsEnabled(!isEnabled)
    } catch (error) {
      console.error('Failed to toggle item:', error)
      // Don't change the state if the API call failed
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex flex-row items-center justify-between w-full"
      style={{
        paddingTop: '16px',
        paddingBottom: isLast ? '0' : '16px',
        borderBottom: isLast ? 'none' : '1px solid #F5F5F5',
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      {/* Icon for doctor view */}
      {!showToggle && icon && <img src={icon} alt="Medical Condition" className="w-6 h-6 mr-3" />}

      {/* Left section */}
      <div
        className="flex flex-col flex-1"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <h4
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '16px',
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
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '121%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: !showToggle ? '#AEAEAE' : (isRelevant ? '#0057FF' : '#000000'),
          }}
        >
          {description}
        </p>
      </div>

      {/* Right section - Toggle switch */}
      {showToggle && (
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="relative w-12 h-7 rounded-full transition-colors duration-300"
          style={{
            background: isEnabled ? '#00A210' : '#EFEFEF',
            cursor: isLoading ? 'wait' : 'pointer',
          }}
        >
          <div
            className="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300"
            style={{
              left: isEnabled ? '24px' : '4px',
            }}
          />
        </button>
      )}
    </div>
  )
}
