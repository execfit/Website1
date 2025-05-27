-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update coaches table to support trainer accounts
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS session_rate DECIMAL(10,2);
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS is_trainer_account BOOLEAN DEFAULT false;

-- Create trainer_certifications table
CREATE TABLE IF NOT EXISTS trainer_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(100),
  credential_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trainer_testimonials table
CREATE TABLE IF NOT EXISTS trainer_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trainer_gallery table (for transformation photos, etc.)
CREATE TABLE IF NOT EXISTS trainer_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  image_type VARCHAR(50) DEFAULT 'transformation', -- 'transformation', 'profile', 'facility', etc.
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  apartment_building VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_packages table (for different session bundles)
CREATE TABLE IF NOT EXISTS session_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- e.g., "4 Session Package", "8 Session Package"
  session_count INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_session_banks table (tracks remaining sessions for each client)
CREATE TABLE IF NOT EXISTS client_session_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  sessions_remaining INTEGER NOT NULL DEFAULT 0,
  sessions_purchased INTEGER NOT NULL DEFAULT 0,
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, trainer_id)
);

-- Create training_sessions table (individual session bookings)
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled_by_trainer', 'cancelled_by_client', 'no_show')),
  notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_purchases table (track all purchases)
CREATE TABLE IF NOT EXISTS session_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  package_id UUID REFERENCES session_packages(id),
  sessions_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trainer_availability table (for blocking off times)
CREATE TABLE IF NOT EXISTS trainer_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id VARCHAR(50) REFERENCES coaches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true, -- false means blocked off
  recurring_pattern VARCHAR(50), -- 'weekly', 'daily', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE trainer_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_session_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for trainers to manage their own data
CREATE POLICY "trainers_manage_own_certifications" ON trainer_certifications
  FOR ALL USING (
    trainer_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "trainers_manage_own_testimonials" ON trainer_testimonials
  FOR ALL USING (
    trainer_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "trainers_manage_own_gallery" ON trainer_gallery
  FOR ALL USING (
    trainer_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  );

-- Public read access for trainer profiles
CREATE POLICY "public_read_certifications" ON trainer_certifications
  FOR SELECT USING (true);

CREATE POLICY "public_read_testimonials" ON trainer_testimonials
  FOR SELECT USING (true);

CREATE POLICY "public_read_gallery" ON trainer_gallery
  FOR SELECT USING (true);

-- Policies for session management
CREATE POLICY "trainers_manage_own_sessions" ON training_sessions
  FOR ALL USING (
    trainer_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "trainers_view_own_clients" ON client_session_banks
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  );

-- Insert sample session packages for existing trainers
INSERT INTO session_packages (trainer_id, name, session_count, price, description) VALUES
('gabriela', '4 Session Package', 4, 320.00, 'Perfect starter package for new clients'),
('gabriela', '8 Session Package', 8, 600.00, 'Best value - save $40 compared to individual sessions'),
('maddy', '4 Session Package', 4, 300.00, 'Get started with personalized training'),
('maddy', '8 Session Package', 8, 560.00, 'Commit to your fitness journey'),
('yosof', '4 Session Package', 4, 340.00, 'Intensive strength and physique training'),
('yosof', '8 Session Package', 8, 640.00, 'Complete transformation package');

-- Update coaches with session rates
UPDATE coaches SET 
  session_rate = 85.00,
  bio = 'Passionate about helping busy professionals achieve their fitness goals through personalized training and nutrition guidance.',
  is_trainer_account = true
WHERE id = 'gabriela';

UPDATE coaches SET 
  session_rate = 80.00,
  bio = 'Certified trainer specializing in building strength, confidence, and sustainable healthy habits.',
  is_trainer_account = true
WHERE id = 'maddy';

UPDATE coaches SET 
  session_rate = 90.00,
  bio = 'Expert in physique development, strength training, and mindset coaching for long-term results.',
  is_trainer_account = true
WHERE id = 'yosof';
