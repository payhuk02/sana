#!/bin/bash
# Script de build pour Vercel avec génération de sitemap
# Ce script peut être utilisé comme Build Command dans Vercel

set -e

echo "🔨 Building application..."

# Build de l'application
npm run build

echo "✅ Build completed successfully"

# Génération du sitemap si les variables sont présentes
if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "🗺️  Generating sitemap..."
  
  # Vérifier si le script de génération existe
  if [ -f "scripts/generate-sitemap.js" ]; then
    # Exporter les variables pour le script Node.js
    export SITE_URL="${SITE_URL:-${VERCEL_URL:-https://votre-domaine.vercel.app}}"
    
    # Générer le sitemap
    node scripts/generate-sitemap.js || echo "⚠️  Sitemap generation failed, but build succeeded"
  else
    echo "⚠️  Sitemap generation script not found, skipping..."
  fi
else
  echo "⚠️  Supabase environment variables not found, skipping sitemap generation"
fi

echo "✅ Build process completed"

