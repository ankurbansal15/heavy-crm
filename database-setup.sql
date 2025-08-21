-- Database initialization for Heavy CRM
-- Execute this entire script in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trigger function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;

-- Create RLS policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- PIPELINES TABLE
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipelines_user_id ON pipelines(user_id);

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own pipelines" ON pipelines;
DROP POLICY IF EXISTS "Users can create their own pipelines" ON pipelines;
DROP POLICY IF EXISTS "Users can update their own pipelines" ON pipelines;
DROP POLICY IF EXISTS "Users can delete their own pipelines" ON pipelines;

CREATE POLICY "Users can view their own pipelines"
  ON pipelines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pipelines"
  ON pipelines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pipelines"
  ON pipelines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pipelines"
  ON pipelines FOR DELETE
  USING (auth.uid() = user_id);

-- STAGES TABLE
CREATE TABLE IF NOT EXISTS stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stages_user_id ON stages(user_id);
CREATE INDEX IF NOT EXISTS idx_stages_pipeline_id ON stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_stages_position ON stages(position);

ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own stages" ON stages;
DROP POLICY IF EXISTS "Users can create their own stages" ON stages;
DROP POLICY IF EXISTS "Users can update their own stages" ON stages;
DROP POLICY IF EXISTS "Users can delete their own stages" ON stages;

CREATE POLICY "Users can view their own stages"
  ON stages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stages"
  ON stages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stages"
  ON stages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stages"
  ON stages FOR DELETE
  USING (auth.uid() = user_id);

-- OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES stages(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  value DECIMAL(12,2) DEFAULT 0,
  probability INTEGER DEFAULT 0,
  close_date DATE,
  notes TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage_id ON opportunities(stage_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_position ON opportunities(position);
CREATE INDEX IF NOT EXISTS idx_opportunities_close_date ON opportunities(close_date);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON opportunities;

CREATE POLICY "Users can view their own opportunities"
  ON opportunities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opportunities"
  ON opportunities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities"
  ON opportunities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities"
  ON opportunities FOR DELETE
  USING (auth.uid() = user_id);

-- PROJECT_PIPELINES TABLE
CREATE TABLE IF NOT EXISTS project_pipelines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_pipelines_user_id ON project_pipelines(user_id);

ALTER TABLE project_pipelines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own project pipelines" ON project_pipelines;
DROP POLICY IF EXISTS "Users can create their own project pipelines" ON project_pipelines;
DROP POLICY IF EXISTS "Users can update their own project pipelines" ON project_pipelines;
DROP POLICY IF EXISTS "Users can delete their own project pipelines" ON project_pipelines;

CREATE POLICY "Users can view their own project pipelines"
  ON project_pipelines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project pipelines"
  ON project_pipelines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project pipelines"
  ON project_pipelines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project pipelines"
  ON project_pipelines FOR DELETE
  USING (auth.uid() = user_id);

-- PROJECT_STAGES TABLE
CREATE TABLE IF NOT EXISTS project_stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES project_pipelines(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_stages_user_id ON project_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_project_stages_pipeline_id ON project_stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_project_stages_position ON project_stages(position);

ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own project stages" ON project_stages;
DROP POLICY IF EXISTS "Users can create their own project stages" ON project_stages;
DROP POLICY IF EXISTS "Users can update their own project stages" ON project_stages;
DROP POLICY IF EXISTS "Users can delete their own project stages" ON project_stages;

CREATE POLICY "Users can view their own project stages"
  ON project_stages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project stages"
  ON project_stages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project stages"
  ON project_stages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project stages"
  ON project_stages FOR DELETE
  USING (auth.uid() = user_id);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES project_stages(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  deadline DATE,
  budget DECIMAL(12,2) DEFAULT 0,
  spent DECIMAL(12,2) DEFAULT 0,
  priority VARCHAR(20) DEFAULT 'Medium',
  assigned_to VARCHAR(255),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_stage_id ON projects(stage_id);
CREATE INDEX IF NOT EXISTS idx_projects_position ON projects(position);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- CONTACT_LISTS TABLE
CREATE TABLE IF NOT EXISTS contact_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_lists_user_id ON contact_lists(user_id);

ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own contact lists" ON contact_lists;
DROP POLICY IF EXISTS "Users can create their own contact lists" ON contact_lists;
DROP POLICY IF EXISTS "Users can update their own contact lists" ON contact_lists;
DROP POLICY IF EXISTS "Users can delete their own contact lists" ON contact_lists;

CREATE POLICY "Users can view their own contact lists"
  ON contact_lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contact lists"
  ON contact_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact lists"
  ON contact_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contact lists"
  ON contact_lists FOR DELETE
  USING (auth.uid() = user_id);

-- CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  contact_group VARCHAR(100),
  list_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can create their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON contacts;

CREATE POLICY "Users can view their own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

-- TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'whatsapp'
  category VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  header_type VARCHAR(50),
  header_media TEXT,
  body_text TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  character_count INTEGER DEFAULT 0,
  message_segments INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own templates" ON templates;
DROP POLICY IF EXISTS "Users can create their own templates" ON templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON templates;

CREATE POLICY "Users can view their own templates"
  ON templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON templates FOR DELETE
  USING (auth.uid() = user_id);

-- CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled', -- 'Scheduled', 'Active', 'Completed', 'Paused'
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'whatsapp'
  sent INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  read INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON campaigns;

CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- CHATBOT_FLOWS TABLE
CREATE TABLE IF NOT EXISTS chatbot_flows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_keywords TEXT[] DEFAULT '{}',
  steps JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_flows_user_id ON chatbot_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_active ON chatbot_flows(is_active);

ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own chatbot flows" ON chatbot_flows;
DROP POLICY IF EXISTS "Users can create their own chatbot flows" ON chatbot_flows;
DROP POLICY IF EXISTS "Users can update their own chatbot flows" ON chatbot_flows;
DROP POLICY IF EXISTS "Users can delete their own chatbot flows" ON chatbot_flows;

CREATE POLICY "Users can view their own chatbot flows"
  ON chatbot_flows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chatbot flows"
  ON chatbot_flows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbot flows"
  ON chatbot_flows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbot flows"
  ON chatbot_flows FOR DELETE
  USING (auth.uid() = user_id);

-- API_CONFIG TABLE
CREATE TABLE IF NOT EXISTS api_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  base_url TEXT,
  is_active BOOLEAN DEFAULT false,
  config_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_name)
);

CREATE INDEX IF NOT EXISTS idx_api_config_user_id ON api_config(user_id);
CREATE INDEX IF NOT EXISTS idx_api_config_service ON api_config(service_name);

ALTER TABLE api_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own api config" ON api_config;
DROP POLICY IF EXISTS "Users can create their own api config" ON api_config;
DROP POLICY IF EXISTS "Users can update their own api config" ON api_config;
DROP POLICY IF EXISTS "Users can delete their own api config" ON api_config;

CREATE POLICY "Users can view their own api config"
  ON api_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own api config"
  ON api_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own api config"
  ON api_config FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own api config"
  ON api_config FOR DELETE
  USING (auth.uid() = user_id);

-- TRIGGERS FOR UPDATED_AT COLUMNS
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pipelines_updated_at ON pipelines;
CREATE TRIGGER update_pipelines_updated_at
  BEFORE UPDATE ON pipelines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stages_updated_at ON stages;
CREATE TRIGGER update_stages_updated_at
  BEFORE UPDATE ON stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON opportunities;
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_pipelines_updated_at ON project_pipelines;
CREATE TRIGGER update_project_pipelines_updated_at
  BEFORE UPDATE ON project_pipelines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_stages_updated_at ON project_stages;
CREATE TRIGGER update_project_stages_updated_at
  BEFORE UPDATE ON project_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_lists_updated_at ON contact_lists;
CREATE TRIGGER update_contact_lists_updated_at
  BEFORE UPDATE ON contact_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chatbot_flows_updated_at ON chatbot_flows;
CREATE TRIGGER update_chatbot_flows_updated_at
  BEFORE UPDATE ON chatbot_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_api_config_updated_at ON api_config;
CREATE TRIGGER update_api_config_updated_at
  BEFORE UPDATE ON api_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database tables created successfully!' as message;
