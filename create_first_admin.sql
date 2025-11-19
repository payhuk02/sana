-- Script pour créer le premier administrateur
-- Email: contact@edigit-agence.com
-- 
-- IMPORTANT: Avant d'exécuter ce script:
-- 1. Allez sur /admin/login
-- 2. Créez un compte avec l'email: contact@edigit-agence.com
-- 3. Utilisez le mot de passe: Edigit@8000
-- 4. Puis exécutez ce script dans Supabase SQL Editor

-- Attribuer le rôle admin à l'utilisateur avec cet email
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  'admin'::app_role
FROM auth.users
WHERE email = 'contact@edigit-agence.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Vérifier que l'utilisateur a bien le rôle admin
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'contact@edigit-agence.com';

-- Si la requête ci-dessus retourne une ligne avec role = 'admin', c'est bon!
-- Sinon, vérifiez que:
-- 1. L'utilisateur existe dans auth.users (l'inscription a bien été faite)
-- 2. La migration secure_production.sql a été exécutée
