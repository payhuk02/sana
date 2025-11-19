-- Script SQL pour ajouter les colonnes de contenu légal et FAQ à la table site_settings
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes pour les contenus légaux et FAQ
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS privacy_policy TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS legal_notices TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS terms_of_sale TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS opening_hours TEXT DEFAULT 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé',
ADD COLUMN IF NOT EXISTS faq_content JSONB DEFAULT '[]'::jsonb;

-- Mettre à jour les valeurs par défaut si la table est vide ou si les colonnes viennent d'être créées
UPDATE public.site_settings
SET 
  privacy_policy = COALESCE(privacy_policy, ''),
  legal_notices = COALESCE(legal_notices, ''),
  terms_of_sale = COALESCE(terms_of_sale, ''),
  opening_hours = COALESCE(opening_hours, 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé'),
  faq_content = COALESCE(faq_content, '[]'::jsonb)
WHERE privacy_policy IS NULL 
   OR legal_notices IS NULL 
   OR terms_of_sale IS NULL 
   OR opening_hours IS NULL 
   OR faq_content IS NULL;

