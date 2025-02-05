import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iptjebccpueqamhngjaw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwdGplYmNjcHVlcWFtaG5namF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMTEyNTEsImV4cCI6MjA0OTc4NzI1MX0.Ydw8-wRifWEQKioRoS-qdmwQ7yB0LP_cll6jneWOCZk'

export const supabase = createClient(supabaseUrl, supabaseKey)

