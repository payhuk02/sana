# 🚀 Guide de Mise en Production - Sana Distribution

Ce guide explique comment sécuriser et déployer votre application en production.

## ⚠️ ÉTAPES CRITIQUES DE SÉCURISATION

### 📋 Étape 1: Exécuter la migration de sécurité dans Supabase

1. **Allez dans votre projet Supabase**
   - Ouvrez https://supabase.com
   - Sélectionnez votre projet

2. **Ouvrez le SQL Editor**
   - Dans le menu latéral, cliquez sur "SQL Editor"
   - Cliquez sur "+ New query"

3. **Copiez et exécutez le script**
   - Ouvrez le fichier `secure_production.sql` à la racine du projet
   - Copiez tout le contenu
   - Collez-le dans le SQL Editor
   - Cliquez sur "Run" pour exécuter

✅ Cette migration va:
- Créer un système de rôles sécurisé (admin/user)
- Sécuriser toutes les tables avec RLS (Row Level Security)
- Protéger l'upload d'images (admin uniquement)
- Créer une table de profils utilisateurs

### 👤 Étape 2: Créer votre premier administrateur

Après avoir exécuté la migration:

1. **Créez un compte via l'interface**
   - Allez sur `/admin/login`
   - Cliquez sur l'onglet "Inscription"
   - Remplissez le formulaire
   - Créez votre compte

2. **Récupérez votre UUID utilisateur**
   - Retournez dans Supabase SQL Editor
   - Exécutez cette requête:
   ```sql
   SELECT id, email FROM auth.users;
   ```
   - Copiez votre UUID (colonne `id`)

3. **Attribuez-vous le rôle admin**
   - Dans le SQL Editor, exécutez (remplacez `VOTRE_UUID`):
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('VOTRE_UUID', 'admin');
   ```

4. **Déconnectez-vous et reconnectez-vous**
   - Vous avez maintenant accès à l'administration!

### 🔐 Étape 3: Désactiver la confirmation d'email (Optionnel - Dev uniquement)

**⚠️ À faire UNIQUEMENT pour tester en développement**

1. Dans Supabase, allez dans **Authentication > Settings**
2. Désactivez "Enable email confirmations"
3. **IMPORTANT**: Réactivez-le avant la production!

## 📊 Architecture de Sécurité

### Système d'Authentification

```
┌─────────────────────────────────────────┐
│         Supabase Auth (JWT)             │
│  - Email + Password                     │
│  - Session management                   │
│  - Token refresh automatique            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Table user_roles (RLS)           │
│  - user_id → auth.users                 │
│  - role: 'admin' | 'user'               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Fonction is_admin() (SECURITY)      │
│  - Vérifie le rôle admin                │
│  - Utilisée dans toutes les policies    │
└─────────────────────────────────────────┘
```

### Politiques RLS

**Tables publiques (lecture seule pour tous):**
- ✅ `products` - Lecture publique
- ✅ `categories` - Lecture publique  
- ✅ `site_settings` - Lecture publique

**Tables protégées (écriture admin uniquement):**
- 🔒 `products` - INSERT/UPDATE/DELETE → Admin seulement
- 🔒 `categories` - INSERT/UPDATE/DELETE → Admin seulement
- 🔒 `site_settings` - UPDATE → Admin seulement
- 🔒 `user_roles` - Gestion complète → Admin seulement

**Storage:**
- 👁️ `product-images` - Lecture publique (afficher les images)
- 🔒 `product-images` - Upload/Update/Delete → Admin seulement

## 🛡️ Validation et Sécurité

### Validation des formulaires (Zod)

Tous les formulaires utilisent `zod` pour la validation:

**Produits (`productSchema`):**
- ✅ Nom: 3-200 caractères
- ✅ Prix: Positif, max 99M
- ✅ Stock: Entier positif
- ✅ Brand: 2-100 caractères
- ✅ Description: 10-2000 caractères

**Authentification (`authSchema`):**
- ✅ Email: Format valide, max 255 chars
- ✅ Mot de passe: Min 8 chars avec majuscule, minuscule et chiffre

### Gestion des erreurs

Toutes les opérations Supabase incluent:
- ✅ Try-catch blocks
- ✅ Messages d'erreur utilisateur-friendly
- ✅ Console errors pour debugging
- ✅ Toasts de confirmation

## 🔧 Configuration Production

### Variables d'environnement

Vos credentials Supabase sont déjà dans `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'https://hjsooexrohigahdqjqkp.supabase.co';
const supabaseAnonKey = 'eyJhbG...'; // Clé publique - OK
```

**⚠️ IMPORTANT:**
- La `anon key` est publique et peut être dans le code
- Ne JAMAIS mettre la `service_role key` dans le frontend!

### Supabase Settings pour Production

1. **URL Configuration** (Authentication > URL Configuration):
   - Site URL: `https://votre-domaine.com`
   - Redirect URLs: 
     - `https://votre-domaine.com/**`
     - `http://localhost:5173/**` (pour dev)

2. **Email Templates** (Authentication > Email Templates):
   - Personnalisez les emails de confirmation
   - Ajoutez votre branding

3. **Rate Limiting** (API Settings):
   - Activez le rate limiting pour éviter les abus

## 🧪 Tests avant Production

### Checklist de Sécurité

- [ ] Migration SQL exécutée avec succès
- [ ] Premier admin créé et fonctionnel
- [ ] Les utilisateurs non-admin NE PEUVENT PAS:
  - [ ] Modifier des produits
  - [ ] Uploader des images
  - [ ] Accéder à `/admin/*` sans authentification
- [ ] Les utilisateurs admin PEUVENT:
  - [ ] Se connecter
  - [ ] CRUD complet sur les produits
  - [ ] Gérer les catégories
  - [ ] Uploader des images
- [ ] Email confirmation activée
- [ ] URLs de redirection configurées

### Tests Manuels

1. **Test utilisateur non authentifié:**
   ```
   - Visiter / → OK
   - Visiter /admin/dashboard → Redirection vers /admin/login
   - Essayer d'ajouter un produit via API → Erreur RLS
   ```

2. **Test utilisateur sans rôle admin:**
   ```
   - S'inscrire avec un nouveau compte
   - Essayer d'accéder /admin → Redirection
   - Le compte existe dans auth.users mais pas admin
   ```

3. **Test administrateur:**
   ```
   - Se connecter avec compte admin
   - Accéder à /admin/dashboard → OK
   - Créer/Modifier/Supprimer produit → OK
   - Upload image → OK
   ```

## 📱 Déploiement

### Vercel (Recommandé)

Vercel offre:
- ✅ Build optimisé
- ✅ CDN mondial
- ✅ HTTPS automatique
- ✅ Domaine personnalisé disponible
- ✅ Sitemap automatique

### Autres Options

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🆘 Dépannage

### Problème: "Unauthorized" lors de l'ajout de produit

**Solution:**
1. Vérifiez que vous êtes connecté
2. Vérifiez votre rôle dans `user_roles`
3. Reconnectez-vous après avoir ajouté le rôle

### Problème: Images ne s'uploadent pas

**Solution:**
1. Vérifiez que le bucket `product-images` existe
2. Exécutez les policies storage de `secure_production.sql`
3. Vérifiez que vous êtes admin

### Problème: "Invalid login credentials"

**Solution:**
1. Vérifiez l'email et le mot de passe
2. Si compte créé sans email confirmation:
   - Désactivez "Enable email confirmations" dans Supabase
   - Ou vérifiez votre email

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Zod Documentation](https://zod.dev/)

---

## ✅ Checklist Finale

Avant de mettre en production:

- [ ] Migration `secure_production.sql` exécutée
- [ ] Au moins un admin créé et testé
- [ ] Email confirmation activée
- [ ] URLs de redirection configurées
- [ ] Tests de sécurité passés
- [ ] Backup de la base de données effectué
- [ ] Domaine personnalisé configuré (optionnel)

**🎉 Votre application est prête pour la production!**
