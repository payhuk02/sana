-- Script de correction pour le type de product_id dans order_items
-- À exécuter si vous avez déjà créé la table avec UUID au lieu de TEXT

-- 1. Supprimer la contrainte de clé étrangère existante si elle existe
ALTER TABLE IF EXISTS public.order_items 
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- 2. Modifier le type de la colonne product_id de UUID à TEXT
ALTER TABLE IF EXISTS public.order_items 
  ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

-- 3. Recréer la contrainte de clé étrangère avec le bon type
ALTER TABLE IF EXISTS public.order_items
  ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES public.products(id) 
  ON DELETE SET NULL;

