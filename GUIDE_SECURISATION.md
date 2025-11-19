# 🔒 Guide de Sécurisation - Clés Supabase

## Problème actuel

Les clés Supabase sont actuellement hardcodées dans `src/lib/supabase.ts` :

```typescript
const supabaseUrl = 'https://hjsooexrohigahdqjqkp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Solution : Variables d'environnement

### Étape 1 : Créer le fichier `.env`

À la racine du projet, créez un fichier `.env` :

```bash
# .env
VITE_SUPABASE_URL=https://hjsooexrohigahdqjqkp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc29vZXhyb2hpZ2FoZHFqcWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzE1NDAsImV4cCI6MjA3OTAwNzU0MH0.8prXQQgZvaxWjrZxsBOMzbh2--ySqjpFvV4gEu_P0_0
```

**⚠️ Important**: Le préfixe `VITE_` est requis pour que Vite expose ces variables côté client.

### Étape 2 : Créer le fichier `.env.example`

Créez un fichier `.env.example` (sans valeurs sensibles) :

```bash
# .env.example
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Ce fichier peut être commité dans Git pour documenter les variables nécessaires.

### Étape 3 : Vérifier `.gitignore`

Assurez-vous que `.gitignore` contient :

```
.env
.env.local
.env.*.local
```

### Étape 4 : Mettre à jour `src/lib/supabase.ts`

Remplacez le contenu par :

```typescript
import { createClient } from '@supabase/supabase-js';

// Validation des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Étape 5 : Mettre à jour `vite-env.d.ts` (optionnel mais recommandé)

Ajoutez les types pour les variables d'environnement :

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Étape 6 : Tester

1. Redémarrez le serveur de développement : `npm run dev`
2. Vérifiez que l'application fonctionne correctement
3. Vérifiez que les variables sont bien chargées (elles apparaîtront dans la console si vous les loggez en dev)

## Pour la production

### Vercel / Netlify / Autres plateformes

1. Allez dans les paramètres de votre projet
2. Ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redéployez l'application

### Variables d'environnement par environnement

Vous pouvez créer différents fichiers :
- `.env.development` - Pour le développement local
- `.env.production` - Pour la production (ne pas commiter)
- `.env.staging` - Pour le staging (ne pas commiter)

Vite chargera automatiquement le bon fichier selon le mode.

## Sécurité supplémentaire

### 1. Row Level Security (RLS)

Assurez-vous que RLS est activé sur toutes vos tables Supabase :

```sql
-- Exemple pour la table products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique pour lecture publique
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Politique pour écriture admin uniquement
CREATE POLICY "Admin write access" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

### 2. Service Role Key

⚠️ **JAMAIS** exposer la Service Role Key côté client. Elle doit rester uniquement côté serveur (Edge Functions, API routes, etc.).

### 3. Rate Limiting

Configurez le rate limiting dans Supabase Dashboard pour protéger vos endpoints.

## Vérification

Après avoir appliqué ces changements :

- [ ] Le fichier `.env` existe et contient les bonnes valeurs
- [ ] Le fichier `.env` est dans `.gitignore`
- [ ] Le fichier `.env.example` existe (sans valeurs sensibles)
- [ ] `src/lib/supabase.ts` utilise `import.meta.env`
- [ ] L'application fonctionne en développement
- [ ] Les variables sont configurées en production
- [ ] RLS est activé sur Supabase

## En cas de problème

Si vous obtenez une erreur `Missing Supabase environment variables` :

1. Vérifiez que le fichier `.env` existe à la racine du projet
2. Vérifiez que les variables commencent par `VITE_`
3. Redémarrez le serveur de développement
4. Vérifiez l'orthographe des noms de variables

