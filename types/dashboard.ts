export interface MessageStats {
  total: number
  delivered: number
  read: number
  failed: number
}

export interface SalesStats {
  totalLeads: number
  totalDeals: number
  totalValue: number
  conversionRate: number
}

export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

