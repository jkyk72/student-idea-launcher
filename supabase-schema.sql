-- Student Idea Launcher Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  university VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'brainstorming', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brainstorm sessions table
CREATE TABLE IF NOT EXISTS brainstorm_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  outline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slides table
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  slide_url TEXT NOT NULL,
  presentation_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table (for PDF storage and hashing)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  pdf_url TEXT NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert requests table
CREATE TABLE IF NOT EXISTS expert_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expert_type VARCHAR(50) NOT NULL CHECK (expert_type IN ('tax_accountant', 'lawyer', 'patent_attorney')),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_brainstorm_sessions_idea_id ON brainstorm_sessions(idea_id);
CREATE INDEX IF NOT EXISTS idx_slides_idea_id ON slides(idea_id);
CREATE INDEX IF NOT EXISTS idx_documents_idea_id ON documents(idea_id);
CREATE INDEX IF NOT EXISTS idx_expert_requests_idea_id ON expert_requests(idea_id);
CREATE INDEX IF NOT EXISTS idx_expert_requests_user_id ON expert_requests(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE brainstorm_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_requests ENABLE ROW LEVEL SECURITY;

-- Users can only view and edit their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Brainstorm sessions policies
CREATE POLICY "Users can view own brainstorm sessions" ON brainstorm_sessions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = brainstorm_sessions.idea_id AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own brainstorm sessions" ON brainstorm_sessions
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = brainstorm_sessions.idea_id AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own brainstorm sessions" ON brainstorm_sessions
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = brainstorm_sessions.idea_id AND ideas.user_id = auth.uid()
  ));

-- Slides policies
CREATE POLICY "Users can view own slides" ON slides
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = slides.idea_id AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own slides" ON slides
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = slides.idea_id AND ideas.user_id = auth.uid()
  ));

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = documents.idea_id AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = documents.idea_id AND ideas.user_id = auth.uid()
  ));

-- Expert requests policies
CREATE POLICY "Users can view own expert requests" ON expert_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expert requests" ON expert_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expert requests" ON expert_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brainstorm_sessions_updated_at
  BEFORE UPDATE ON brainstorm_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_requests_updated_at
  BEFORE UPDATE ON expert_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
