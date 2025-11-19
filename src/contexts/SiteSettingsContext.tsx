import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

interface Stat {
  value: string;
  label: string;
}

interface HomepageSection {
  title: string;
  description: string;
}

interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

interface SiteSettings {
  siteName: string;
  slogan: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  heroTitle: string;
  heroSubtitle: string;
  hero_image: string;
  aboutText: string;
  logo: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  foreground_color: string;
  primary_font: string;
  heading_font: string;
  privacy_policy: string;
  legal_notices: string;
  terms_of_sale: string;
  opening_hours: string;
  faq_content: Array<{ question: string; answer: string }>;
  // Nouveaux champs pour page d'accueil
  features_content: Feature[];
  testimonials_content: Testimonial[];
  homepage_stats: Stat[];
  homepage_sections: {
    categories: HomepageSection;
    featured: HomepageSection;
    new: HomepageSection;
    promo: HomepageSection;
    testimonials: HomepageSection;
  };
  // Nouveaux champs pour page À propos
  about_hero_description: string;
  about_values: AboutValue[];
  about_stats: Stat[];
  about_team_text: string;
  about_commitment_text: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Sana Distribution',
  slogan: 'Votre boutique de consommables informatiques au meilleur prix',
  email: 'contact@sanadistribution.com',
  phone: '+212 5 22 12 34 56',
  whatsapp: '+212 5 22 12 34 56',
  address: 'Casablanca, Maroc',
  facebook: 'https://facebook.com/sanadistribution',
  instagram: 'https://instagram.com/sanadistribution',
  heroTitle: 'Votre boutique de consommables informatiques',
  heroSubtitle: 'Des prix imbattables sur toute notre gamme',
  hero_image: '/hero-banner.jpg',
  aboutText: 'Sana Distribution est votre partenaire de confiance pour tous vos besoins en informatique.',
  logo: '',
  primary_color: '262.1 83.3% 57.8%',
  secondary_color: '220 14.3% 95.9%',
  accent_color: '262.1 83.3% 57.8%',
  background_color: '0 0% 100%',
  foreground_color: '224 71.4% 4.1%',
  primary_font: 'Inter',
  heading_font: 'Inter',
  privacy_policy: '',
  legal_notices: '',
  terms_of_sale: '',
  opening_hours: 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé',
  faq_content: [],
  // Nouveaux champs pour page d'accueil
  features_content: [
    { icon: 'TruckIcon', title: 'Livraison rapide', description: 'Sous 48h' },
    { icon: 'ShieldCheck', title: 'Paiement sécurisé', description: '100% sécurisé' },
    { icon: 'HeadphonesIcon', title: 'Support 7j/7', description: 'À votre écoute' },
    { icon: 'Star', title: 'Garantie qualité', description: 'Produits certifiés' },
  ],
  testimonials_content: [
    {
      name: 'Sophie Martin',
      text: 'Excellent service et produits de qualité. Livraison rapide et bien emballée.',
      rating: 5,
    },
    {
      name: 'Thomas Dubois',
      text: 'Meilleurs prix du marché. Je recommande vivement Sana Distribution.',
      rating: 5,
    },
    {
      name: 'Marie Leclerc',
      text: 'Service client très réactif. Mon problème a été résolu rapidement.',
      rating: 5,
    },
  ],
  homepage_stats: [
    { value: '1000+', label: 'Produits' },
    { value: '50+', label: 'Marques' },
    { value: '10k+', label: 'Clients satisfaits' },
  ],
  homepage_sections: {
    categories: {
      title: 'Nos Catégories',
      description: 'Explorez notre sélection complète de produits high-tech',
    },
    featured: {
      title: 'Produits Populaires',
      description: 'Découvrez nos meilleures ventes',
    },
    new: {
      title: 'Nouveautés',
      description: 'Les derniers produits ajoutés',
    },
    promo: {
      title: 'Promotions',
      description: 'Profitez de nos offres exceptionnelles',
    },
    testimonials: {
      title: 'Avis Clients',
      description: 'Ce que nos clients disent de nous',
    },
  },
  // Nouveaux champs pour page À propos
  about_hero_description: 'Votre partenaire de confiance pour tous vos besoins en matériel informatique et high-tech depuis 2015',
  about_values: [
    {
      icon: 'Target',
      title: 'Excellence',
      description: 'Nous sélectionnons uniquement les meilleurs produits pour nos clients',
    },
    {
      icon: 'Users',
      title: 'Service Client',
      description: 'Une équipe dédiée disponible 7j/7 pour vous accompagner',
    },
    {
      icon: 'Award',
      title: 'Qualité',
      description: 'Produits certifiés avec garantie constructeur',
    },
    {
      icon: 'TrendingUp',
      title: 'Innovation',
      description: 'Toujours à la pointe des dernières technologies',
    },
  ],
  about_stats: [
    { value: '10K+', label: 'Clients satisfaits' },
    { value: '1000+', label: 'Produits disponibles' },
    { value: '50+', label: 'Grandes marques' },
    { value: '9 ans', label: "D'expérience" },
  ],
  about_team_text: 'Notre équipe de professionnels expérimentés travaille chaque jour pour vous offrir la meilleure expérience possible. Du service client au support technique, en passant par la logistique, chaque membre contribue à notre succès commun.',
  about_commitment_text: 'Chez Sana Distribution, nous nous engageons à vous fournir des produits authentiques, un service client réactif, une livraison rapide et sécurisée, ainsi qu\'un retour gratuit sous 30 jours. Votre satisfaction est notre priorité absolue.',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Apply theme colors and fonts dynamically
  React.useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      
      // Apply colors if they exist
      if (settings.primary_color) root.style.setProperty('--primary', settings.primary_color);
      if (settings.secondary_color) root.style.setProperty('--secondary', settings.secondary_color);
      if (settings.accent_color) root.style.setProperty('--accent', settings.accent_color);
      if (settings.background_color) root.style.setProperty('--background', settings.background_color);
      if (settings.foreground_color) root.style.setProperty('--foreground', settings.foreground_color);

      // Load Google Fonts dynamically - only if fonts are defined
      const primaryFont = settings.primary_font || 'Inter';
      const headingFont = settings.heading_font || 'Inter';
      
      const fonts = [primaryFont, headingFont].filter((f, i, arr) => f && arr.indexOf(f) === i);
      const fontLinks = fonts.map(font => 
        `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
      );
      
      // Remove old font links
      const existingLinks = document.querySelectorAll('link[data-font-link]');
      existingLinks.forEach(link => link.remove());
      
      // Add new font links
      fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('data-font-link', 'true');
        document.head.appendChild(link);
      });

      // Apply fonts to body
      document.body.style.fontFamily = `'${primaryFont}', sans-serif`;
      
      // Apply heading font
      const style = document.getElementById('heading-font-style') || document.createElement('style');
      style.id = 'heading-font-style';
      style.textContent = `
        h1, h2, h3, h4, h5, h6 {
          font-family: '${headingFont}', sans-serif !important;
        }
      `;
      if (!document.getElementById('heading-font-style')) {
        document.head.appendChild(style);
      }
    }
  }, [settings]);

  // Fetch settings from Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('siteName, slogan, email, phone, whatsapp, address, facebook, instagram, heroTitle, heroSubtitle, hero_image, aboutText, logo, primary_color, secondary_color, accent_color, background_color, foreground_color, primary_font, heading_font, privacy_policy, legal_notices, terms_of_sale, opening_hours, faq_content')
          .single();

        if (data && !error) {
          // Process JSONB fields (handle JSONB from database)
          const processedData = {
            ...data,
            faq_content: Array.isArray(data.faq_content) 
              ? data.faq_content 
              : (typeof data.faq_content === 'string' 
                  ? JSON.parse(data.faq_content || '[]') 
                  : []),
            features_content: Array.isArray(data.features_content)
              ? data.features_content
              : (typeof data.features_content === 'string'
                  ? JSON.parse(data.features_content || '[]')
                  : defaultSettings.features_content),
            testimonials_content: Array.isArray(data.testimonials_content)
              ? data.testimonials_content
              : (typeof data.testimonials_content === 'string'
                  ? JSON.parse(data.testimonials_content || '[]')
                  : defaultSettings.testimonials_content),
            homepage_stats: Array.isArray(data.homepage_stats)
              ? data.homepage_stats
              : (typeof data.homepage_stats === 'string'
                  ? JSON.parse(data.homepage_stats || '[]')
                  : defaultSettings.homepage_stats),
            homepage_sections: data.homepage_sections && typeof data.homepage_sections === 'object'
              ? data.homepage_sections
              : (typeof data.homepage_sections === 'string'
                  ? JSON.parse(data.homepage_sections || '{}')
                  : defaultSettings.homepage_sections),
            about_values: Array.isArray(data.about_values)
              ? data.about_values
              : (typeof data.about_values === 'string'
                  ? JSON.parse(data.about_values || '[]')
                  : defaultSettings.about_values),
            about_stats: Array.isArray(data.about_stats)
              ? data.about_stats
              : (typeof data.about_stats === 'string'
                  ? JSON.parse(data.about_stats || '[]')
                  : defaultSettings.about_stats),
            about_hero_description: data.about_hero_description || defaultSettings.about_hero_description,
            about_team_text: data.about_team_text || defaultSettings.about_team_text,
            about_commitment_text: data.about_commitment_text || defaultSettings.about_commitment_text,
          };
          setSettings(processedData);
        } else {
          // Initialize with default settings if not found
          await supabase.from('site_settings').insert([defaultSettings]);
          setSettings(defaultSettings);
        }
      } catch (error) {
        logger.error('Error fetching site settings', error, 'SiteSettingsContext');
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Listen for real-time updates avec cleanup optimisé
  useEffect(() => {
    let isMounted = true; // Flag pour éviter les mises à jour après unmount

    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_settings' 
      }, () => {
        // Récupérer les données complètes après un changement
        if (isMounted) {
          supabase.from('site_settings').select('siteName, slogan, email, phone, whatsapp, address, facebook, instagram, heroTitle, heroSubtitle, hero_image, aboutText, logo, primary_color, secondary_color, accent_color, background_color, foreground_color, primary_font, heading_font, privacy_policy, legal_notices, terms_of_sale, opening_hours, faq_content, features_content, testimonials_content, homepage_stats, homepage_sections, about_hero_description, about_values, about_stats, about_team_text, about_commitment_text').single().then(({ data, error }) => {
            if (isMounted && data && !error) {
              // Process JSONB fields (handle JSONB from database)
              const processedData = {
                ...data,
                faq_content: Array.isArray(data.faq_content) 
                  ? data.faq_content 
                  : (typeof data.faq_content === 'string' 
                      ? JSON.parse(data.faq_content || '[]') 
                      : []),
                features_content: Array.isArray(data.features_content)
                  ? data.features_content
                  : (typeof data.features_content === 'string'
                      ? JSON.parse(data.features_content || '[]')
                      : defaultSettings.features_content),
                testimonials_content: Array.isArray(data.testimonials_content)
                  ? data.testimonials_content
                  : (typeof data.testimonials_content === 'string'
                      ? JSON.parse(data.testimonials_content || '[]')
                      : defaultSettings.testimonials_content),
                homepage_stats: Array.isArray(data.homepage_stats)
                  ? data.homepage_stats
                  : (typeof data.homepage_stats === 'string'
                      ? JSON.parse(data.homepage_stats || '[]')
                      : defaultSettings.homepage_stats),
                homepage_sections: data.homepage_sections && typeof data.homepage_sections === 'object'
                  ? data.homepage_sections
                  : (typeof data.homepage_sections === 'string'
                      ? JSON.parse(data.homepage_sections || '{}')
                      : defaultSettings.homepage_sections),
                about_values: Array.isArray(data.about_values)
                  ? data.about_values
                  : (typeof data.about_values === 'string'
                      ? JSON.parse(data.about_values || '[]')
                      : defaultSettings.about_values),
                about_stats: Array.isArray(data.about_stats)
                  ? data.about_stats
                  : (typeof data.about_stats === 'string'
                      ? JSON.parse(data.about_stats || '[]')
                      : defaultSettings.about_stats),
                about_hero_description: data.about_hero_description || defaultSettings.about_hero_description,
                about_team_text: data.about_team_text || defaultSettings.about_team_text,
                about_commitment_text: data.about_commitment_text || defaultSettings.about_commitment_text,
              };
              setSettings(processedData);
              logger.info('Site settings updated via Realtime', 'SiteSettingsContext');
            }
          })
          .catch((error) => {
            if (isMounted) {
              logger.error('Error in settings realtime subscription', error, 'SiteSettingsContext');
            }
          });
        }
      })
      .subscribe();

    return () => {
      isMounted = false; // Marquer comme unmounted
      // Cleanup du channel
      supabase.removeChannel(channel).catch(() => {
        // Ignorer les erreurs de cleanup
      });
    };
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      
      // Essayer d'abord de récupérer une ligne existante pour obtenir l'ID
      const { data: existingData, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle(); // maybeSingle() retourne null si aucune ligne n'existe (au lieu de throw)
      
      let error;
      if (existingData?.id) {
        // Si une ligne existe avec un ID, faire un update avec l'ID
        const { error: updateError } = await supabase
          .from('site_settings')
          .update(updated)
          .eq('id', existingData.id);
        error = updateError;
      } else if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (normal si la table est vide)
        // Si c'est une autre erreur, la propager
        logger.error('Error fetching site settings', fetchError, 'SiteSettingsContext');
        throw fetchError;
      } else {
        // Si aucune ligne n'existe, utiliser upsert (créera la ligne)
        // Supabase utilisera automatiquement la clé primaire si elle existe
        const { error: upsertError } = await supabase
          .from('site_settings')
          .upsert(updated, { onConflict: 'id' });
        error = upsertError;
        
        // Si upsert avec onConflict échoue (pas de clé primaire id), essayer sans onConflict
        if (error && error.message?.includes('onConflict')) {
          const { error: upsertError2 } = await supabase
            .from('site_settings')
            .upsert(updated);
          error = upsertError2;
        }
      }
      
      if (error) {
        logger.error('Error updating site settings in database', error, 'SiteSettingsContext');
        throw error;
      }
      
      // Update local state immediately for instant UI feedback (couleurs, polices)
      // La subscription Realtime synchronisera aussi, mais la mise à jour immédiate
      // est importante pour l'expérience utilisateur (feedback visuel instantané)
      setSettings(updated);
      logger.info('Site settings updated successfully', 'SiteSettingsContext');
    } catch (error) {
      logger.error('Failed to update site settings', error, 'SiteSettingsContext');
      throw error;
    }
  }, [settings]);

  const value = useMemo(() => ({
    settings,
    updateSettings,
  }), [settings, updateSettings]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
};
