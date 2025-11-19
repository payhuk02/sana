-- Script SQL pour ajouter les colonnes manquantes dans site_settings
-- Permet de gérer tout le contenu depuis l'administration

-- Colonnes pour la page d'accueil
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS features_content JSONB DEFAULT '[
  {
    "icon": "TruckIcon",
    "title": "Livraison rapide",
    "description": "Sous 48h"
  },
  {
    "icon": "ShieldCheck",
    "title": "Paiement sécurisé",
    "description": "100% sécurisé"
  },
  {
    "icon": "HeadphonesIcon",
    "title": "Support 7j/7",
    "description": "À votre écoute"
  },
  {
    "icon": "Star",
    "title": "Garantie qualité",
    "description": "Produits certifiés"
  }
]'::jsonb;

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS testimonials_content JSONB DEFAULT '[
  {
    "name": "Sophie Martin",
    "text": "Excellent service et produits de qualité. Livraison rapide et bien emballée.",
    "rating": 5
  },
  {
    "name": "Thomas Dubois",
    "text": "Meilleurs prix du marché. Je recommande vivement Sana Distribution.",
    "rating": 5
  },
  {
    "name": "Marie Leclerc",
    "text": "Service client très réactif. Mon problème a été résolu rapidement.",
    "rating": 5
  }
]'::jsonb;

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS homepage_stats JSONB DEFAULT '[
  {
    "value": "1000+",
    "label": "Produits"
  },
  {
    "value": "50+",
    "label": "Marques"
  },
  {
    "value": "10k+",
    "label": "Clients satisfaits"
  }
]'::jsonb;

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS homepage_sections JSONB DEFAULT '{
  "categories": {
    "title": "Nos Catégories",
    "description": "Explorez notre sélection complète de produits high-tech"
  },
  "featured": {
    "title": "Produits Populaires",
    "description": "Découvrez nos meilleures ventes"
  },
  "new": {
    "title": "Nouveautés",
    "description": "Les derniers produits ajoutés"
  },
  "promo": {
    "title": "Promotions",
    "description": "Profitez de nos offres exceptionnelles"
  },
  "testimonials": {
    "title": "Avis Clients",
    "description": "Ce que nos clients disent de nous"
  }
}'::jsonb;

-- Colonnes pour la page À propos
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS about_hero_description TEXT DEFAULT 'Votre partenaire de confiance pour tous vos besoins en matériel informatique et high-tech depuis 2015';

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS about_values JSONB DEFAULT '[
  {
    "icon": "Target",
    "title": "Excellence",
    "description": "Nous sélectionnons uniquement les meilleurs produits pour nos clients"
  },
  {
    "icon": "Users",
    "title": "Service Client",
    "description": "Une équipe dédiée disponible 7j/7 pour vous accompagner"
  },
  {
    "icon": "Award",
    "title": "Qualité",
    "description": "Produits certifiés avec garantie constructeur"
  },
  {
    "icon": "TrendingUp",
    "title": "Innovation",
    "description": "Toujours à la pointe des dernières technologies"
  }
]'::jsonb;

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS about_stats JSONB DEFAULT '[
  {
    "value": "10K+",
    "label": "Clients satisfaits"
  },
  {
    "value": "1000+",
    "label": "Produits disponibles"
  },
  {
    "value": "50+",
    "label": "Grandes marques"
  },
  {
    "value": "9 ans",
    "label": "D''expérience"
  }
]'::jsonb;

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS about_team_text TEXT DEFAULT 'Notre équipe de professionnels expérimentés travaille chaque jour pour vous offrir la meilleure expérience possible. Du service client au support technique, en passant par la logistique, chaque membre contribue à notre succès commun.';

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS about_commitment_text TEXT DEFAULT 'Chez Sana Distribution, nous nous engageons à vous fournir des produits authentiques, un service client réactif, une livraison rapide et sécurisée, ainsi qu''un retour gratuit sous 30 jours. Votre satisfaction est notre priorité absolue.';

-- Commentaires pour documentation
COMMENT ON COLUMN site_settings.features_content IS 'Contenu des features affichées sur la page d''accueil (icône, titre, description)';
COMMENT ON COLUMN site_settings.testimonials_content IS 'Témoignages clients affichés sur la page d''accueil (nom, texte, note)';
COMMENT ON COLUMN site_settings.homepage_stats IS 'Statistiques affichées dans le Hero Banner (valeur, label)';
COMMENT ON COLUMN site_settings.homepage_sections IS 'Titres et descriptions des sections de la page d''accueil';
COMMENT ON COLUMN site_settings.about_hero_description IS 'Description affichée dans le hero de la page À propos';
COMMENT ON COLUMN site_settings.about_values IS 'Valeurs de l''entreprise affichées sur la page À propos (icône, titre, description)';
COMMENT ON COLUMN site_settings.about_stats IS 'Statistiques affichées sur la page À propos (valeur, label)';
COMMENT ON COLUMN site_settings.about_team_text IS 'Texte de présentation de l''équipe';
COMMENT ON COLUMN site_settings.about_commitment_text IS 'Texte d''engagement de l''entreprise';

