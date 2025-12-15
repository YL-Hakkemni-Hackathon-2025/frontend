import { DocumentItem } from './DocumentItem'

interface DocumentInfo {
  id: string
  title: string
  date: string
  aiSummary: string
  fileUrl?: string
}

interface DocumentSectionProps {
  title: string
  items: DocumentInfo[]
  onItemClick?: (id: string) => void
}

export function DocumentSection({ title, items, onItemClick }: DocumentSectionProps) {
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
        }}
      >
        {title}
      </h3>

      {items.map((item, index) => (
        <DocumentItem
          key={item.id}
          title={item.title}
          date={item.date}
          aiSummary={item.aiSummary}
          fileUrl={item.fileUrl}
          isLast={index === items.length - 1}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        />
      ))}
    </div>
  )
}
