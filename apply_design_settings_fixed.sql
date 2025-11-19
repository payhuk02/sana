-- Script SQL corrigé pour ajouter toutes les fonctionnalités de design
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter les colonnes de personnalisation à la table site_settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '262.1 83.3% 57.8%',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '220 14.3% 95.9%',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '262.1 83.3% 57.8%',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '0 0% 100%',
ADD COLUMN IF NOT EXISTS foreground_color TEXT DEFAULT '224 71.4% 4.1%',
ADD COLUMN IF NOT EXISTS primary_font TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS heading_font TEXT DEFAULT 'Inter';

-- 2. Créer le bucket pour les logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logo-images', 'logo-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public read access for logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for logo images" ON storage.objects;

-- 4. Créer les nouvelles politiques RLS pour le bucket logo-images

-- Accès en lecture public
CREATE POLICY "Public read access for logo images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logo-images');

-- Accès en insertion pour les admins
CREATE POLICY "Admin upload access for logo images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logo-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Accès en mise à jour pour les admins
CREATE POLICY "Admin update access for logo images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logo-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Accès en suppression pour les admins
CREATE POLICY "Admin delete access for logo images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logo-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
