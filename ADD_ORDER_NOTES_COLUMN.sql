-- Script SQL pour ajouter la colonne notes à la table orders
-- À exécuter dans le SQL Editor de votre projet Supabase

-- Ajouter la colonne notes si elle n'existe pas
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- Créer un index pour améliorer les recherches (optionnel)
CREATE INDEX IF NOT EXISTS idx_orders_notes ON public.orders(notes) WHERE notes != '';

