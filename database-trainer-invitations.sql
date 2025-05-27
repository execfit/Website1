-- Create trainer_invitations table
CREATE TABLE IF NOT EXISTS trainer_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  temporary_password VARCHAR(255) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255),
  invited_by VARCHAR(255) DEFAULT 'admin',
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE trainer_invitations ENABLE ROW LEVEL SECURITY;

-- Only admins can manage invitations (you'll need to set admin role)
CREATE POLICY "admin_manage_invitations" ON trainer_invitations
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'your-admin-email@execfitnow.com'
  );

-- Trainers can only read their own invitation during signup
CREATE POLICY "trainers_read_own_invitation" ON trainer_invitations
  FOR SELECT USING (email = auth.jwt() ->> 'email');
