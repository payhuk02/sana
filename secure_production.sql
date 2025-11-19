-- Migration de sécurisation pour la production
-- Ce script corrige tous les problèmes de sécurité critiques
-- À exécuter dans le SQL Editor de votre projet Supabase

-- 1. Créer l'enum pour les rôles (avec vérification)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- 2. Créer la table user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Créer la fonction de vérification de rôle (SECURITY DEFINER pour éviter la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Créer une fonction helper pour vérifier si l'utilisateur actuel est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- 5. SUPPRIMER les anciennes policies trop permissives
DROP POLICY IF EXISTS "Allow public write access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public write access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public write access on site_settings" ON public.site_settings;

-- 6. CRÉER les nouvelles policies sécurisées pour PRODUCTS
-- Lecture publique
CREATE POLICY "Anyone can read products"
  ON public.products
  FOR SELECT
  USING (true);

-- Écriture réservée aux admins
CREATE POLICY "Only admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. CRÉER les nouvelles policies sécurisées pour CATEGORIES
CREATE POLICY "Anyone can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8. CRÉER les nouvelles policies sécurisées pour SITE_SETTINGS
CREATE POLICY "Anyone can read site_settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site_settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. Policy pour user_roles (seuls les admins peuvent gérer les rôles)
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users can read their own roles
CREATE POLICY "Users can read their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 10. SÉCURISER LE STORAGE
-- Supprimer les anciennes policies trop permissives
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Lecture publique OK (pour afficher les images)
-- Upload/Update/Delete réservés aux admins
CREATE POLICY "Admins can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images' AND
    public.is_admin()
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images' AND
    public.is_admin()
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images' AND
    public.is_admin()
  );

-- 11. Créer une table de profiles (optionnel mais recommandé)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 12. Trigger pour créer automatiquement un profile lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 13. Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Configurer REPLICA IDENTITY
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- 14. Créer un index pour optimiser les requêtes de rôles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ============================================================================
-- INSTRUCTIONS POST-MIGRATION
-- ============================================================================
-- 
-- Après avoir exécuté cette migration, vous devez créer votre premier admin:
-- 
-- ÉTAPE 1: Créez un compte via l'interface de signup de votre application
-- 
-- ÉTAPE 2: Récupérez l'UUID de l'utilisateur depuis la table auth.users
-- SELECT id, email FROM auth.users;
-- 
-- ÉTAPE 3: Donnez-lui le rôle admin (remplacez VOTRE_UUID par l'ID réel)
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('VOTRE_UUID', 'admin');
-- 
-- ============================================================================
