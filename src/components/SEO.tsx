import { useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
}: SEOProps) {
  const { settings } = useSiteSettings();
  const siteName = settings.siteName || 'Sana Distribution';
  const siteDescription = settings.slogan || 'Votre boutique de consommables informatiques au meilleur prix';

  // Construire les valeurs finales
  const finalTitle = title ? `${title} | ${siteName}` : `${siteName} - Boutique informatique en ligne`;
  const finalDescription = description || siteDescription;
  const finalImage = image || settings.logo || '/og-image.png';
  const finalUrl = url || window.location.href;
  const canonicalUrl = finalUrl.split('?')[0]; // Enlever les query params

  useEffect(() => {
    // Mettre à jour le titre
    document.title = finalTitle;

    // Fonction helper pour mettre à jour ou créer une meta tag
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta tags de base
    updateMetaTag('description', finalDescription);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    updateMetaTag('author', siteName);

    // Open Graph
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', finalUrl, true);
    updateMetaTag('og:site_name', siteName, true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Robots meta
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
  }, [finalTitle, finalDescription, finalImage, finalUrl, canonicalUrl, type, noindex, keywords, siteName]);

  return null; // Ce composant ne rend rien
}

