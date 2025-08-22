export interface Pipeline {
  id: string
  name: string
  stages: Stage[]
}

export interface Stage {
  id: string
  name: string
  position: number
  pipeline_id?: string
  user_id?: string
}

export interface Opportunity {
  id: string
  name: string
  company?: string
  contact_name?: string
  email?: string
  phone?: string
  value: number
  stage_id: string
  probability: number
  priority: string
  position: number
  close_date?: string
  notes?: string
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface NewLeadForm {
  name: string
  company: string
  contact_name: string
  email: string
  phone: string
  value: string
  probability: string
  stage_id: string
  priority: string
  notes: string
}

export interface SortConfig {
  key: keyof Opportunity | null
  direction: 'ascending' | 'descending'
}

export interface DateRange {
  from: Date
  to: Date
}

export interface DragResult {
  active: any
  over: any
}
