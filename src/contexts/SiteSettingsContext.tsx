import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

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
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
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
          .select('*')
          .single();

        if (data && !error) {
          setSettings(data);
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

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_settings' 
      }, (payload) => {
        // Récupérer les données complètes après un changement
        supabase.from('site_settings').select('*').single().then(({ data, error }) => {
          if (data && !error) {
            setSettings(data);
            logger.info('Site settings updated via Realtime', 'SiteSettingsContext');
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      
      // Update settings in database (assuming single row table)
      const { error } = await supabase
        .from('site_settings')
        .update(updated)
        .limit(1);
      
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
