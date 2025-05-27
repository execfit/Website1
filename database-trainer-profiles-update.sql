-- Add new columns to coaches table for enhanced trainer profiles
ALTER TABLE coaches 
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb;

-- Update existing coaches to have complete profiles
UPDATE coaches 
SET is_profile_complete = TRUE 
WHERE is_trainer_account = FALSE OR is_trainer_account IS NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_coaches_trainer_account ON coaches(is_trainer_account) WHERE is_trainer_account = TRUE;
CREATE INDEX IF NOT EXISTS idx_coaches_profile_complete ON coaches(is_profile_complete) WHERE is_trainer_account = TRUE;
