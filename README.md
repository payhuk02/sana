# Sana Distribution - Site e-commerce

Site web e-commerce de consommables informatiques avec un design professionnel fluide et réactif.

## 🚀 Technologies utilisées

Ce projet est construit avec:

- **Vite** - Build tool rapide et moderne
- **TypeScript** - Typage statique pour JavaScript
- **React 18** - Bibliothèque UI moderne
- **shadcn-ui** - Composants UI de haute qualité
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend as a Service (Auth, Database, Storage)
- **React Router DOM** - Routing côté client
- **TanStack Query** - Gestion des données côté client

## 📋 Prérequis

- Node.js (version 18 ou supérieure) - [Installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm ou yarn
- Un compte Supabase pour la base de données et l'authentification

## 🔧 Installation

```sh
# Cloner le dépôt
git clone <YOUR_GIT_URL>

# Naviguer vers le dossier du projet
cd sanadistribution

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Scripts disponibles

```sh
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Build pour Vercel (avec génération de sitemap)
npm run build:vercel

# Preview de la production
npm run preview

# Linter le code
npm run lint

# Tests
npm run test
npm run test:ui
npm run test:coverage
```

## 🌐 Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel
```

Le projet est configuré pour Vercel avec:
- Build optimisé
- CDN mondial
- HTTPS automatique
- Domaine personnalisé disponible
- Sitemap automatique

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Node.js:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps

## 📁 Structure du projet

```
sanadistribution/
├── src/
│   ├── components/      # Composants React réutilisables
│   ├── contexts/        # Contextes React (Auth, Cart, etc.)
│   ├── hooks/           # Hooks personnalisés
│   ├── lib/             # Utilitaires et configurations
│   ├── pages/           # Pages de l'application
│   ├── types/           # Types TypeScript
│   └── main.tsx         # Point d'entrée
├── public/              # Fichiers statiques
├── scripts/             # Scripts utilitaires
└── *.sql                # Scripts SQL pour Supabase
```

## 🔐 Configuration Supabase

Consultez `SETUP_PRODUCTION.md` pour les instructions complètes de configuration de Supabase.

## 📝 Documentation

- `SETUP_PRODUCTION.md` - Guide de configuration production
- `CREATE_PRODUCT_IMAGES_BUCKET.sql` - Création du bucket Storage pour les images
- `UPDATE_PROFILES_TABLE.sql` - Mise à jour de la table profiles
- Autres fichiers `.sql` - Scripts de configuration de la base de données

## 👥 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est privé et propriétaire de Sana Distribution.
