-- Add design customization columns to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '262.1 83.3% 57.8%',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '220 14.3% 95.9%',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '262.1 83.3% 57.8%',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '0 0% 100%',
ADD COLUMN IF NOT EXISTS foreground_color TEXT DEFAULT '224 71.4% 4.1%',
ADD COLUMN IF NOT EXISTS primary_font TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS heading_font TEXT DEFAULT 'Inter';

-- Create logo-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logo-images', 'logo-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for logo-images bucket
CREATE POLICY IF NOT EXISTS "Public read access for logo images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logo-images');

CREATE POLICY IF NOT EXISTS "Admin upload access for logo images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logo-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin update access for logo images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logo-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admin delete access for logo images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logo-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
