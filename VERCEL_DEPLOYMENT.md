# 🚀 Guide de Déploiement Vercel - Sana Distribution

## ✅ Configuration Vercel

Le projet est configuré pour être déployé sur Vercel avec les fichiers suivants :

- ✅ `vercel.json` - Configuration Vercel
- ✅ `.vercelignore` - Fichiers à ignorer lors du déploiement
- ✅ `package.json` - Scripts de build configurés

---

## 📋 Variables d'environnement requises

**⚠️ IMPORTANT**: Vous devez configurer ces variables dans Vercel Dashboard :

### Variables obligatoires

1. **VITE_SUPABASE_URL**
   - Description: URL de votre projet Supabase
   - Exemple: `https://hjsooexrohigahdqjqkp.supabase.co`
   - Où trouver: Supabase Dashboard > Settings > API > Project URL

2. **VITE_SUPABASE_ANON_KEY**
   - Description: Clé anonyme (publique) de Supabase
   - Exemple: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Où trouver: Supabase Dashboard > Settings > API > Project API keys > anon public

### Comment ajouter les variables dans Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `sanadistribution`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez chaque variable :
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Votre URL Supabase
   - **Environment**: Production, Preview, Development (cochez tous)
5. Répétez pour `VITE_SUPABASE_ANON_KEY`
6. **Redéployez** le projet pour que les variables prennent effet

---

## 🔧 Configuration Vercel

### Fichier `vercel.json`

Le fichier `vercel.json` configure :
- ✅ Framework: Vite (détection automatique)
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Rewrites: Toutes les routes vers `index.html` (SPA)
- ✅ Cache headers: Optimisation des assets statiques

### Build automatique

Vercel détecte automatiquement :
- ✅ Framework: Vite
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Node.js version: Automatique (recommandé: 18.x ou 20.x)

---

## 🚀 Déploiement

### Première fois

1. **Connecter le repository GitHub**
   - Vercel Dashboard > Add New Project
   - Importez `payhuk02/sana`
   - Vercel détectera automatiquement Vite

2. **Configurer les variables d'environnement**
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
   - Cochez Production, Preview, Development

3. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel construira et déploiera automatiquement

### Déploiements suivants

- **Automatique**: Chaque push sur `main` déclenche un déploiement
- **Manuel**: Vercel Dashboard > Deployments > Redeploy

---

## 🔍 Vérification du déploiement

### Checklist

- [ ] Variables d'environnement configurées dans Vercel
- [ ] Build réussi (vérifier les logs)
- [ ] Application accessible sur l'URL Vercel
- [ ] Connexion Supabase fonctionnelle
- [ ] Routes React Router fonctionnent (pas d'erreur 404)

### Problèmes courants

#### Erreur: "Missing Supabase environment variables"
- **Solution**: Vérifiez que les variables sont bien configurées dans Vercel
- **Solution**: Redéployez après avoir ajouté les variables

#### Erreur 404 sur les routes
- **Solution**: Vérifiez que `vercel.json` contient les rewrites
- **Solution**: Vérifiez que toutes les routes pointent vers `index.html`

#### Build échoue
- **Solution**: Vérifiez les logs de build dans Vercel
- **Solution**: Testez `npm run build` localement
- **Solution**: Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📊 Monitoring

### Logs Vercel

- **Build logs**: Vercel Dashboard > Deployments > [Dernier déploiement] > Build Logs
- **Runtime logs**: Vercel Dashboard > Deployments > [Dernier déploiement] > Runtime Logs

### Analytics

- Vercel Analytics (optionnel, à activer dans Settings)
- Performance monitoring
- Error tracking

---

## 🔒 Sécurité

### Variables d'environnement

- ✅ **NE JAMAIS** commiter les variables dans le code
- ✅ Utiliser uniquement les variables Vercel
- ✅ `.env` est dans `.gitignore`
- ✅ `.vercelignore` exclut les fichiers sensibles

### Headers de sécurité

Pour améliorer la sécurité, vous pouvez ajouter dans `vercel.json` :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📝 Commandes utiles

### Déploiement local (test)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

### Vérifier la configuration

```bash
# Test du build local
npm run build

# Prévisualiser le build
npm run preview
```

---

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Variables d'environnement configurées dans Vercel
- [ ] `vercel.json` présent et correct
- [ ] `.vercelignore` configuré
- [ ] Build local réussi (`npm run build`)
- [ ] Routes testées localement
- [ ] Connexion Supabase testée
- [ ] Pas d'erreurs dans les logs
- [ ] Application accessible sur l'URL Vercel

---

## 🔗 Liens utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Configuration Vite sur Vercel](https://vercel.com/docs/frameworks/vite)
- [Variables d'environnement Vercel](https://vercel.com/docs/environment-variables)

---

**Projet prêt pour le déploiement sur Vercel !** 🚀

