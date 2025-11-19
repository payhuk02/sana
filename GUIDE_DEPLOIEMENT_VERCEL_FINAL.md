# 🚀 Guide de Déploiement Vercel Final - Sana Distribution

**Date**: Janvier 2025  
**Statut**: Configuration optimisée et prête pour production

---

## ✅ Configuration Complète

Le projet est maintenant **entièrement configuré** pour un déploiement optimal sur Vercel avec toutes les optimisations appliquées.

---

## 📋 Checklist de Déploiement

### 1. Configuration Vercel Dashboard

#### Variables d'Environnement (OBLIGATOIRE)

Dans **Vercel Dashboard > Settings > Environment Variables**:

1. **VITE_SUPABASE_URL**
   - **Value**: `https://hjsooexrohigahdqjqkp.supabase.co`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

2. **VITE_SUPABASE_ANON_KEY**
   - **Value**: Votre clé anonyme Supabase
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

3. **SITE_URL** (Optionnel, pour sitemap)
   - **Value**: `https://votre-domaine.vercel.app`
   - **Environments**: ✅ Production
   - **Note**: Si non défini, `VERCEL_URL` sera utilisé automatiquement

**Important**: Après ajout des variables, **redéployer** le projet.

#### Build Settings (Vérifier)

Dans **Vercel Dashboard > Settings > General**:

- **Framework Preset**: Vite (détecté automatiquement)
- **Build Command**: `npm run build` (par défaut)
  - Ou personnalisé: `npm run build:vercel` (avec sitemap)
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x (configuré dans vercel.json)

---

## 🚀 Étapes de Déploiement

### Première Fois

1. **Connecter le Repository**
   - Vercel Dashboard > **Add New Project**
   - Importer votre repository GitHub
   - Vercel détectera automatiquement Vite

2. **Configurer les Variables**
   - Settings > **Environment Variables**
   - Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
   - Cocher tous les environnements

3. **Déployer**
   - Cliquez sur **Deploy**
   - Attendez la fin du build (~2-3 minutes)

### Déploiements Suivants

- **Automatique**: Chaque push sur `main` déclenche un déploiement
- **Preview**: Chaque Pull Request crée un preview deployment
- **Manuel**: Vercel Dashboard > Deployments > **Redeploy**

---

## 🔍 Vérification Post-Déploiement

### Tests Basiques

1. **Accessibilité**
   - [ ] Application accessible sur l'URL Vercel
   - [ ] Pas d'erreur 500
   - [ ] Page d'accueil charge

2. **Routes SPA**
   ```bash
   # Tester ces URLs (ne doivent PAS retourner 404)
   https://votre-domaine.vercel.app/
   https://votre-domaine.vercel.app/categories
   https://votre-domaine.vercel.app/product/[id]
   https://votre-domaine.vercel.app/admin/dashboard
   ```

3. **Connexion Supabase**
   - [ ] Produits chargent sur la page d'accueil
   - [ ] Catégories affichées
   - [ ] Navigation fonctionne

### Tests Techniques

1. **Headers de Sécurité**
   ```bash
   curl -I https://votre-domaine.vercel.app
   ```
   
   Vérifier la présence de:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Content-Security-Policy: ...`
   - `Permissions-Policy: ...`

2. **Sitemap**
   ```bash
   curl https://votre-domaine.vercel.app/sitemap.xml
   ```
   - [ ] Format XML valide
   - [ ] Contient les pages statiques
   - [ ] Contient les produits (si variables configurées)

3. **Cache Headers**
   ```bash
   curl -I https://votre-domaine.vercel.app/assets/js/*.js
   ```
   - [ ] `Cache-Control: public, max-age=31536000, immutable`

4. **Robots.txt**
   ```bash
   curl https://votre-domaine.vercel.app/robots.txt
   ```
   - [ ] Contient la référence au sitemap

---

## 🐛 Résolution de Problèmes

### Problème 1: Build échoue

**Symptômes**:
- Build Vercel échoue avec erreur
- Logs montrent des erreurs

**Solutions**:

1. **Vérifier les logs de build**:
   - Vercel Dashboard > Deployments > [Dernier] > Build Logs
   - Chercher les erreurs spécifiques

2. **Tests locaux**:
   ```bash
   npm run build
   ```
   - Si échoue localement, corriger avant de redéployer

3. **Variables d'environnement**:
   - Vérifier que toutes sont configurées
   - Vérifier qu'elles sont disponibles pour l'environnement de build

4. **Node.js version**:
   - Vérifier que Node.js 20.x est utilisé (configuré dans vercel.json)

---

### Problème 2: Erreur "Missing Supabase environment variables"

**Symptômes**:
- Build réussit mais l'app ne charge pas
- Console browser montre l'erreur

**Solutions**:

1. **Vérifier les variables dans Vercel**:
   - Settings > Environment Variables
   - Vérifier les noms exacts: `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
   - Vérifier qu'elles sont dans Production, Preview, Development

2. **Redéployer**:
   - Après ajout/modification des variables, redéployer

3. **Vérifier les logs runtime**:
   - Vercel Dashboard > Deployments > [Dernier] > Runtime Logs
   - Chercher les erreurs de connexion Supabase

---

### Problème 3: Erreur 404 sur les routes

**Symptômes**:
- Homepage fonctionne
- Routes `/categories`, `/product/[id]` retournent 404

**Solutions**:

1. **Vérifier vercel.json**:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   - Doit être présent
   - Syntaxe JSON valide

2. **Vérifier le fichier index.html**:
   - Doit exister dans `dist/index.html` après build

3. **Redéployer**:
   - Après modification de vercel.json

---

### Problème 4: Sitemap non généré

**Symptômes**:
- `/sitemap.xml` retourne 404 ou ancien contenu
- Pas de produits dans le sitemap

**Solutions**:

1. **Vérifier le postbuild**:
   - Le script `postbuild` dans package.json doit s'exécuter
   - Vérifier les logs de build pour voir si le script s'exécute

2. **Utiliser build:vercel**:
   - Dans Vercel Dashboard > Settings > General
   - Changez Build Command en: `npm run build:vercel`

3. **Variables Supabase**:
   - Vérifier que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont configurées
   - Le script génère un sitemap basique si elles manquent

4. **Vérifier SITE_URL**:
   - Le script utilise `VERCEL_URL` automatiquement
   - Ou `SITE_URL` si défini

---

### Problème 5: Performance lente

**Symptômes**:
- Chargement lent
- Lighthouse score faible

**Solutions**:

1. **Vérifier la taille du bundle**:
   - Vercel Dashboard > Deployments > [Dernier] > Build Logs
   - Chercher les avertissements de taille

2. **Vérifier les cache headers**:
   ```bash
   curl -I https://votre-domaine.vercel.app/assets/js/*.js
   ```
   - Devrait avoir: `Cache-Control: public, max-age=31536000, immutable`

3. **Activer Vercel Analytics**:
   - Settings > Analytics
   - Activer pour monitoring

4. **Optimiser les images**:
   - Utiliser WebP
   - Lazy loading déjà implémenté

---

## 📊 Monitoring et Analytics

### Vercel Analytics (Recommandé)

1. **Activer dans Settings**:
   - Settings > Analytics
   - Activer **Web Analytics**

2. **Métriques disponibles**:
   - Page views
   - Performance metrics
   - Top pages
   - Top referrers

### Logs Vercel

- **Build Logs**: Vercel Dashboard > Deployments > [Dernier] > Build Logs
- **Runtime Logs**: Vercel Dashboard > Deployments > [Dernier] > Runtime Logs
- **Function Logs**: Si vous utilisez des functions

---

## 🔒 Sécurité

### Headers de Sécurité Configurés

✅ **Content-Security-Policy**: Protection XSS  
✅ **X-Frame-Options**: Protection clickjacking  
✅ **X-Content-Type-Options**: Protection MIME sniffing  
✅ **Permissions-Policy**: Limite les APIs sensibles  
✅ **Referrer-Policy**: Contrôle des référents

### Variables d'Environnement

✅ **Jamais hardcodées** dans le code  
✅ **Utilisées via** `import.meta.env`  
✅ **Configurées dans** Vercel Dashboard uniquement  
✅ **Protégées** par Vercel

---

## 📈 Optimisations Appliquées

### Performance

- ✅ **Code splitting**: Vendor chunks séparés
- ✅ **Cache long**: 1 an pour assets statiques
- ✅ **Compression**: Automatique via Vercel
- ✅ **Sourcemaps**: Désactivés en production (sécurité)

### SEO

- ✅ **Sitemap dynamique**: Généré automatiquement
- ✅ **Structured data**: JSON-LD injecté
- ✅ **Meta tags**: Dynamiques via composant SEO
- ✅ **Robots.txt**: Configuré avec référence sitemap

### Build

- ✅ **Node.js 20.x**: Version spécifiée
- ✅ **Build optimisé**: Minification, tree-shaking
- ✅ **Assets optimisés**: Noms de fichiers avec hash

---

## 🎯 Configuration Recommandée Vercel

### Settings > General

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `./` (racine)

### Settings > Environment Variables

- `VITE_SUPABASE_URL` (Production, Preview, Development)
- `VITE_SUPABASE_ANON_KEY` (Production, Preview, Development)
- `SITE_URL` (Production) - Optionnel

### Settings > Domains

- Ajouter votre domaine personnalisé si nécessaire
- Configurer DNS selon les instructions Vercel

---

## ✅ Validation Finale

### Checklist Complète

#### Configuration
- [ ] Repository connecté à Vercel
- [ ] Variables d'environnement configurées
- [ ] Build settings corrects
- [ ] vercel.json présent et valide

#### Build
- [ ] Build réussi dans Vercel
- [ ] Aucune erreur dans les logs
- [ ] Sitemap généré (vérifier dans dist/)

#### Déploiement
- [ ] Application accessible
- [ ] Routes fonctionnent (pas de 404)
- [ ] Connexion Supabase fonctionne
- [ ] Headers de sécurité présents

#### Performance
- [ ] Chargement rapide (< 3s)
- [ ] Assets en cache
- [ ] Lighthouse score > 80

#### SEO
- [ ] Sitemap accessible
- [ ] Robots.txt correct
- [ ] Structured data présent
- [ ] Meta tags corrects

---

## 📝 Commandes Utiles

### Local

```bash
# Build local
npm run build

# Build avec sitemap
npm run build:vercel

# Prévisualiser
npm run preview

# Tests
npm run test
```

### Vercel CLI

```bash
# Installer CLI
npm i -g vercel

# Déployer en preview
vercel

# Déployer en production
vercel --prod

# Voir les logs
vercel logs [deployment-url]

# Inspecter la configuration
vercel inspect
```

---

## 🔗 Liens Utiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation Vercel**: https://vercel.com/docs
- **Vite sur Vercel**: https://vercel.com/docs/frameworks/vite
- **Variables d'environnement**: https://vercel.com/docs/environment-variables

---

## 🎉 Conclusion

Le projet est maintenant **entièrement configuré** pour un déploiement optimal sur Vercel avec:

✅ **Configuration complète et optimisée**  
✅ **Sécurité renforcée**  
✅ **Performance optimale**  
✅ **SEO amélioré**  
✅ **Monitoring en place**

**Prochaines étapes**:
1. Configurer les variables d'environnement dans Vercel
2. Déployer
3. Vérifier la checklist de validation
4. Monitorer les performances

---

*Guide créé le: Janvier 2025*  
*Version: Production-ready*

