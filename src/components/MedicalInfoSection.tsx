import { MedicalConditionItem } from './MedicalConditionItem'

interface MedicalInfoItem {
  id?: string
  title: string
  description: string
  isRelevant: boolean
}

interface MedicalInfoSectionProps {
  title: string
  items: MedicalInfoItem[]
  showToggle?: boolean
  icon?: string
  onToggle?: (itemId: string, isEnabled: boolean) => Promise<void>
  onItemClick?: (id: string) => void
}

export function MedicalInfoSection({ title, items, showToggle = true, icon, onToggle, onItemClick }: MedicalInfoSectionProps) {
  return (
    <div
      className="w-full bg-white rounded-xl flex flex-col px-6"
      style={{
        marginTop: '12px',
        paddingTop: '16px',
        paddingBottom: '16px',
        boxShadow: '0px 0px 30px 0px #0000000D',
      }}
    >
      <h3
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '121%',
          letterSpacing: '0%',
          verticalAlign: 'middle',
          color: '#B6B6B6',
          // marginBottom: '12px',
        }}
      >
        {title}
      </h3>

      {items.map((item, index) => (
        <MedicalConditionItem
          key={item.id || index}
          title={item.title}
          description={item.description}
          isRelevant={item.isRelevant}
          isLast={index === items.length - 1}
          showToggle={showToggle}
          icon={icon}
          itemId={item.id}
          onToggle={onToggle}
          onClick={item.id && onItemClick ? () => onItemClick(item.id!) : undefined}
        />
      ))}
    </div>
  )
}
