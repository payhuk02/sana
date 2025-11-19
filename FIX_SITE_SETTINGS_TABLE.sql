-- Script SQL pour corriger/améliorer la table site_settings
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier et créer la colonne id si elle n'existe pas
-- (Supabase crée généralement un id UUID par défaut, mais vérifions)

-- 2. S'assurer que la table a une clé primaire
-- Si la table n'a pas de clé primaire, cette commande échouera
-- Dans ce cas, il faudra créer manuellement une clé primaire

-- 3. Vérifier que toutes les colonnes nécessaires existent
-- D'abord, ajouter la colonne id si elle n'existe pas
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- Ensuite, ajouter toutes les autres colonnes
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS siteName TEXT DEFAULT 'Sana Distribution',
ADD COLUMN IF NOT EXISTS slogan TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS facebook TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS instagram TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS heroTitle TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS heroSubtitle TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS hero_image TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS aboutText TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '262.1 83.3% 57.8%',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '220 14.3% 95.9%',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '262.1 83.3% 57.8%',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '0 0% 100%',
ADD COLUMN IF NOT EXISTS foreground_color TEXT DEFAULT '224 71.4% 4.1%',
ADD COLUMN IF NOT EXISTS primary_font TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS heading_font TEXT DEFAULT 'Inter';

-- 4. Si la table n'a pas de clé primaire, créer une contrainte
-- (Cette commande échouera si une clé primaire existe déjà, c'est normal)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'site_settings_pkey' 
    AND conrelid = 'public.site_settings'::regclass
  ) THEN
    -- Si aucun ID n'existe, créer une colonne id et la définir comme clé primaire
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'site_settings' 
      AND column_name = 'id'
    ) THEN
      ALTER TABLE public.site_settings ADD COLUMN id UUID DEFAULT gen_random_uuid();
    END IF;
    ALTER TABLE public.site_settings ADD PRIMARY KEY (id);
  END IF;
END $$;

-- 5. S'assurer qu'il y a au moins une ligne dans la table
INSERT INTO public.site_settings (id, siteName, slogan, email, phone, whatsapp, address, facebook, instagram, heroTitle, heroSubtitle, hero_image, aboutText, logo, primary_color, secondary_color, accent_color, background_color, foreground_color, primary_font, heading_font)
SELECT 
  gen_random_uuid(),
  'Sana Distribution',
  'Votre boutique de consommables informatiques au meilleur prix',
  'contact@sanadistribution.com',
  '+212 5 22 12 34 56',
  '+212 5 22 12 34 56',
  'Casablanca, Maroc',
  'https://facebook.com/sanadistribution',
  'https://instagram.com/sanadistribution',
  'Votre boutique de consommables informatiques',
  'Des prix imbattables sur toute notre gamme',
  '/hero-banner.jpg',
  'Sana Distribution est votre partenaire de confiance pour tous vos besoins en informatique.',
  '',
  '262.1 83.3% 57.8%',
  '220 14.3% 95.9%',
  '262.1 83.3% 57.8%',
  '0 0% 100%',
  '224 71.4% 4.1%',
  'Inter',
  'Inter'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings LIMIT 1);

