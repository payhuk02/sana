/**
 * Script pour générer dynamiquement le sitemap.xml
 * À exécuter lors du build ou via un cron job
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Utilise les variables d'environnement Vercel
// Vercel expose VERCEL_URL automatiquement, ou utilise SITE_URL si défini
const SITE_URL = process.env.SITE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                 'https://votre-domaine.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Pages statiques
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/categories', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
];

function generateBasicSitemap() {
  const now = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  
  // Créer le dossier public s'il n'existe pas
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, xml, 'utf-8');
  
  console.log(`✅ Sitemap basique généré avec ${staticPages.length} pages statiques`);
  console.log(`   - Fichier: ${outputPath}`);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️  Variables d\'environnement Supabase manquantes - Génération du sitemap basique uniquement');
  // Générer un sitemap basique sans produits si les variables manquent
  generateBasicSitemap();
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateSitemap() {
  try {
    console.log('🔄 Génération du sitemap...');

    // Récupérer tous les produits
    const { data: products, error } = await supabase
      .from('products')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la récupération des produits:', error);
      throw error;
    }

    const now = new Date().toISOString().split('T')[0];

    // Générer le XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Pages statiques
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Pages produits
    if (products && products.length > 0) {
      for (const product of products) {
        const lastmod = product.updated_at 
          ? new Date(product.updated_at).toISOString().split('T')[0]
          : now;
        
        xml += `  <url>
    <loc>${SITE_URL}/product/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    // Écrire le fichier
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    
    // Créer le dossier public s'il n'existe pas
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, xml, 'utf-8');

    const totalUrls = staticPages.length + (products?.length || 0);
    console.log(`✅ Sitemap généré avec succès!`);
    console.log(`   - ${staticPages.length} pages statiques`);
    console.log(`   - ${products?.length || 0} produits`);
    console.log(`   - Total: ${totalUrls} URLs`);
    console.log(`   - Fichier: ${outputPath}`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    // En cas d'erreur, générer un sitemap basique
    console.log('⚠️  Génération d\'un sitemap basique en fallback...');
    generateBasicSitemap();
    process.exit(0); // Ne pas faire échouer le build
  }
}

generateSitemap();

