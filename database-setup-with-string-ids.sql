-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS time_slots CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;

-- Create coaches table with string IDs
CREATE TABLE coaches (
  id VARCHAR(50) PRIMARY KEY, -- Changed from UUID to VARCHAR for specific IDs
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  specialty TEXT,
  image VARCHAR(500),
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE, -- Changed to match coaches.id
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id, date, start_time)
);

-- Create consultations table
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id VARCHAR(50) REFERENCES coaches(id), -- Changed to match coaches.id
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  consultation_date DATE NOT NULL,
  consultation_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  client_goals TEXT,
  client_experience VARCHAR(50),
  notes TEXT,
  calendar_event_id VARCHAR(255),
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all operations
CREATE POLICY "coaches_all_access" ON coaches
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "time_slots_all_access" ON time_slots
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "consultations_all_access" ON consultations
  FOR ALL USING (true) WITH CHECK (true);

-- Insert the coaches with specific IDs
INSERT INTO coaches (id, name, email, specialty, image, is_active) VALUES
('gabriela', 'Gabriela Garcia', 'gabriela@execfitnow.com', 'Personal Trainer | Nutrition Coach', '/images/coach-gabriela.jpg', true),
('maddy', 'Maddy Gold', 'maddy@execfitnow.com', 'Certified Personal Trainer | PN1 Nutrition Coach', '/images/coach-maddy.jpg', true),
('yosof', 'Yosof Abuhasan', 'yosof@execfitnow.com', 'Physique/Strength Training/Mindset Coaching', '/images/coach-yosof.jpg', true);
