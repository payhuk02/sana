-- Script SQL pour créer le bucket de stockage des bannières
-- À exécuter dans le SQL Editor de votre projet Supabase

-- 1. Créer le bucket pour les images de bannière
insert into storage.buckets
  (id, name, public)
values
  ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

-- 2. Politique pour permettre la lecture publique des images
create policy "Public Access to Banner Images"
on storage.objects for select
using ( bucket_id = 'banner-images' );

-- 3. Politique pour permettre aux admins d'uploader des images
create policy "Admins can upload banner images"
on storage.objects for insert
with check (
  bucket_id = 'banner-images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
);

-- 4. Politique pour permettre aux admins de modifier des images
create policy "Admins can update banner images"
on storage.objects for update
using (
  bucket_id = 'banner-images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
);

-- 5. Politique pour permettre aux admins de supprimer des images
create policy "Admins can delete banner images"
on storage.objects for delete
using (
  bucket_id = 'banner-images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
);

-- 6. Ajouter la colonne hero_image à la table site_settings si elle n'existe pas
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS hero_image TEXT DEFAULT '/hero-banner.jpg';
