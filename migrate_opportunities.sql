
-- Add missing columns to opportunities table and migrate existing data
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium';

-- Update existing opportunities to set name from company and contact_name
UPDATE opportunities 
SET name = COALESCE(
  CASE 
    WHEN company IS NOT NULL AND contact_name IS NOT NULL THEN company || ' - ' || contact_name
    WHEN company IS NOT NULL THEN company
    WHEN contact_name IS NOT NULL THEN contact_name
    ELSE 'Unnamed Opportunity'
  END
) 
WHERE name IS NULL OR name = '';

-- Make name column NOT NULL after populating it
ALTER TABLE opportunities ALTER COLUMN name SET NOT NULL;

-- Set default priority for existing records that might have NULL
UPDATE opportunities SET priority = 'Medium' WHERE priority IS NULL;
ALTER TABLE opportunities ALTER COLUMN priority SET NOT NULL;

