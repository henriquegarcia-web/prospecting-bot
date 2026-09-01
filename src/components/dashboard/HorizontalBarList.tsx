import type { DistributionItem } from '@/utils/lead-analytics'

interface HorizontalBarListProps {
  items: DistributionItem[]
  total: number
  valueSuffix?: string
}

export function HorizontalBarList({
  items,
  total,
  valueSuffix = '',
}: HorizontalBarListProps) {
  const largest = Math.max(total, ...items.map((item) => item.value), 1)

  return (
    <div className="bar-list">
      {items.map((item) => (
        <div className="bar-list__item" key={item.key}>
          <div className="bar-list__meta">
            <span>{item.label}</span>
            <strong>
              {item.value}
              {valueSuffix}
            </strong>
          </div>
          <div className="bar-list__track" aria-hidden="true">
            <span
              className="bar-list__fill"
              style={{
                width: `${Math.max((item.value / largest) * 100, item.value ? 4 : 0)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
