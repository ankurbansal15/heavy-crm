export type Channel = 'email' | 'sms' | 'whatsapp'
export type Direction = 'outbound' | 'inbound'
export type MessageStatus = 'pending' | 'queued' | 'sending' | 'sent' | 'failed' | 'received'

export interface Message {
  id: string
  user_id: string
  channel: Channel
  direction: Direction
  to: string | null
  from: string | null
  subject?: string | null
  body_text?: string | null
  body_html?: string | null
  status: MessageStatus
  error?: string | null
  provider_message_id?: string | null
  metadata?: any
  scheduled_at?: string | null
  sent_at?: string | null
  created_at: string
}

export type MessageInsert = Partial<Message> & { channel: Channel, direction: Direction }
