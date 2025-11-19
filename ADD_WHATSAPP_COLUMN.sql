-- Script SQL pour ajouter la colonne WhatsApp à la table site_settings
-- À exécuter dans le SQL Editor de votre projet Supabase

-- Ajouter la colonne whatsapp si elle n'existe pas
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '+212 5 22 12 34 56';

