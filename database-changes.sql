-- Messages table for email/SMS/WhatsApp
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','whatsapp')),
  direction TEXT NOT NULL CHECK (direction IN ('outbound','inbound')),
  "to" TEXT,
  "from" TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  provider_message_id TEXT,
  metadata JSONB DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert their own outbound messages" ON messages;

CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own outbound messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Template enhancements for WhatsApp synchronization
ALTER TABLE templates ADD COLUMN IF NOT EXISTS provider_template_id TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS review_status TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS raw JSONB DEFAULT '{}'::jsonb;
DO $$ BEGIN
  ALTER TABLE templates ADD CONSTRAINT templates_user_provider_unique UNIQUE (user_id, provider_template_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);

