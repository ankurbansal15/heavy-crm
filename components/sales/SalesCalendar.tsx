import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

interface Opportunity {
  id: string
  name: string
  value: number
  stage: string
  probability: number
  priority: string
  dateAdded: string
}

interface SalesCalendarProps {
  opportunities: Opportunity[]
  selectedDateRange: { from: Date; to: Date }
  onSelectDateRange: (range: { from: Date; to: Date }) => void
}

export function SalesCalendar({ opportunities, selectedDateRange, onSelectDateRange }: SalesCalendarProps) {
  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <Calendar
          mode="range"
          selected={selectedDateRange}
          onSelect={onSelectDateRange}
          className="rounded-md border"
        />
      </div>
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">
          Opportunities for {selectedDateRange.from.toDateString()} 
          {selectedDateRange.to && selectedDateRange.to.getTime() !== selectedDateRange.from.getTime() 
            ? ` - ${selectedDateRange.to.toDateString()}` 
            : ''}
        </h3>
        <ul className="space-y-2">
          {opportunities
            .filter(opp => {
              const oppDate = new Date(opp.dateAdded);
              return oppDate >= selectedDateRange.from && 
                     oppDate <= (selectedDateRange.to || selectedDateRange.from);
            })
            .map(opp => (
              <li key={opp.id} className="bg-secondary p-2 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{opp.name}</span>
                  <Badge>{opp.priority}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  ${opp.value.toLocaleString()} | {opp.probability}% | {opp.stage}
                </div>
                <div className="text-xs text-muted-foreground">
                  Added: {opp.dateAdded}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

