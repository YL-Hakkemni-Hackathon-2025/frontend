import { DocumentItem } from './DocumentItem'

interface DocumentInfo {
  title: string
  date: string
  aiSummary: string
  fileUrl?: string
}

interface DocumentSectionProps {
  title: string
  items: DocumentInfo[]
}

export function DocumentSection({ title, items }: DocumentSectionProps) {
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
          key={index}
          title={item.title}
          date={item.date}
          aiSummary={item.aiSummary}
          fileUrl={item.fileUrl}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  )
}
