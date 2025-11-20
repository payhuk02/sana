-- Script SQL pour mettre à jour la table profiles avec les colonnes phone et address
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne phone si elle n'existe pas
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Ajouter la colonne address (JSONB) si elle n'existe pas
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address JSONB;

-- S'assurer que la colonne email existe (au cas où)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- S'assurer que les colonnes created_at et updated_at existent
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Créer le trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

