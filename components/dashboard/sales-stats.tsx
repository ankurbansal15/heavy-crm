import { Card, CardContent } from "@/components/ui/card"
import { SalesStats } from "@/types/dashboard"
import { DollarSign, Users, BadgePercent, Target } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SalesStats({ stats }: { stats: SalesStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        title="Total Leads"
        value={stats.totalLeads}
        description="+12.3% from last month"
        icon={<Users className="h-5 w-5" />}
      />
      <StatCard
        title="Total Deals"
        value={stats.totalDeals}
        description="+5.4% from last month"
        icon={<Target className="h-5 w-5" />}
      />
      <StatCard
        title="Total Value"
        value={`$${stats.totalValue.toLocaleString()}`}
        description="+15.2% from last month"
        icon={<DollarSign className="h-5 w-5" />}
      />
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        description="+2.4% from last month"
        icon={<BadgePercent className="h-5 w-5" />}
      />
    </div>
  )
}

