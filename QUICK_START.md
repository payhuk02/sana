# 🚀 Démarrage Rapide - Administrateur Principal

## Étapes pour créer l'administrateur principal

### ✅ Étape 1: Exécuter la migration de sécurité

1. Ouvrez votre projet Supabase: https://supabase.com
2. Allez dans **SQL Editor**
3. Ouvrez le fichier `secure_production.sql` (à la racine du projet)
4. Copiez tout le contenu et collez-le dans le SQL Editor
5. Cliquez sur **Run** pour exécuter la migration

> ⚠️ Cette étape est cruciale - elle crée le système de rôles et sécurise toutes les tables.

### ✅ Étape 2: Créer le compte administrateur

1. Allez sur la page de connexion: `/admin/login`
2. Cliquez sur l'onglet **"Inscription"**
3. Remplissez le formulaire:
   - **Nom complet**: Admin Edigit (ou autre)
   - **Email**: `contact@edigit-agence.com`
   - **Mot de passe**: `Edigit@8000`
4. Cliquez sur **S'inscrire**

> 📧 Si la confirmation par email est activée, allez vérifier votre boîte mail.
> Pour désactiver temporairement: Supabase → Authentication → Settings → Décochez "Enable email confirmations"

### ✅ Étape 3: Attribuer le rôle admin

1. Retournez dans Supabase **SQL Editor**
2. Ouvrez le fichier `create_first_admin.sql` (à la racine du projet)
3. Copiez le contenu et collez-le dans le SQL Editor
4. Cliquez sur **Run**
5. Vérifiez le résultat - vous devriez voir:
   ```
   email: contact@edigit-agence.com
   role: admin
   created_at: [date et heure]
   ```

### ✅ Étape 4: Vérifier l'accès admin

1. Retournez sur `/admin/login`
2. Connectez-vous avec:
   - Email: `contact@edigit-agence.com`
   - Mot de passe: `Edigit@8000`
3. Vous devriez être redirigé vers `/admin/dashboard` ✨

---

## 🎉 C'est fait !

Vous avez maintenant accès à toute l'administration:
- ✅ Gestion des produits
- ✅ Gestion des catégories
- ✅ Paramètres du site
- ✅ Upload d'images

## 🔒 Sécurité

Votre application est maintenant sécurisée:
- ✅ Seuls les admins peuvent modifier les produits
- ✅ Seuls les admins peuvent uploader des images
- ✅ Les visiteurs peuvent uniquement consulter
- ✅ Validation stricte de tous les formulaires

## ➕ Ajouter d'autres administrateurs

Pour ajouter un nouvel admin:

1. Le nouvel utilisateur s'inscrit via `/admin/login`
2. Vous (en tant qu'admin principal) exécutez dans Supabase:
   ```sql
   -- Remplacez 'email@exemple.com' par l'email du nouvel admin
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role
   FROM auth.users
   WHERE email = 'email@exemple.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

## 🆘 Problèmes courants

### "Table user_roles n'existe pas"
→ Vous n'avez pas exécuté `secure_production.sql`. Retournez à l'Étape 1.

### "User not found"
→ Vous n'avez pas créé le compte via l'inscription. Retournez à l'Étape 2.

### Redirection vers "/" au lieu de "/admin/dashboard"
→ Le rôle admin n'a pas été attribué. Retournez à l'Étape 3.

### "Invalid login credentials"
→ Vérifiez l'email et le mot de passe. Sensible à la casse!

---

Pour plus de détails, consultez `SETUP_PRODUCTION.md`
