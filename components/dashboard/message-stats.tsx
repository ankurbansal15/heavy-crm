import { Card, CardContent } from "@/components/ui/card"
import { MessageStats } from "@/types/dashboard"
import { Mail, MessageSquare, MessagesSquare } from 'lucide-react'

interface MessageStatsCardProps {
  title: string
  stats: MessageStats
  icon: React.ReactNode
}

function MessageStatsCard({ title, stats, icon }: MessageStatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold truncate mr-2">{title}</h3>
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            {icon}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Sent</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Delivered</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.delivered}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Read</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.read}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.failed}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MessageStatsGroup({ whatsapp, email, sms }: { 
  whatsapp: MessageStats
  email: MessageStats
  sms: MessageStats
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MessageStatsCard
        title="WhatsApp Messages"
        stats={whatsapp}
        icon={<MessagesSquare className="h-5 w-5" />}
      />
      <MessageStatsCard
        title="Email Messages"
        stats={email}
        icon={<Mail className="h-5 w-5" />}
      />
      <MessageStatsCard
        title="SMS Messages"
        stats={sms}
        icon={<MessageSquare className="h-5 w-5" />}
      />
    </div>
  )
}

