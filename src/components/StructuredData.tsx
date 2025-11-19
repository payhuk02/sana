import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from '@/types/product';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface StructuredDataProps {
  type?: 'website' | 'product' | 'organization';
  product?: Product;
}

/**
 * Composant pour injecter du structured data JSON-LD dans le head
 * Améliore le SEO avec des données structurées pour les moteurs de recherche
 */
export function StructuredData({ type = 'website', product }: StructuredDataProps) {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    if (type === 'product' && product) {
      // Structured data pour un produit
      const productData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}/product/${product.id}`,
          priceCurrency: 'XOF',
          price: product.price,
          availability: product.stock > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        aggregateRating: product.reviews > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviews,
        } : undefined,
        category: product.category,
      };

      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'structured-data-product';
      script.textContent = JSON.stringify(productData);
      document.head.appendChild(script);
    } else if (type === 'organization') {
      // Structured data pour l'organisation
      const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.siteName,
        url: baseUrl,
        logo: settings.logo || `${baseUrl}/logo.png`,
        description: settings.slogan,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: settings.phone,
          contactType: 'customer service',
          email: settings.email,
        },
        sameAs: [
          settings.facebook,
          settings.instagram,
        ].filter(Boolean),
      };

      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'structured-data-organization';
      script.textContent = JSON.stringify(organizationData);
      document.head.appendChild(script);
    } else {
      // Structured data pour le site web
      const websiteData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: settings.siteName,
        url: baseUrl,
        description: settings.slogan,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/categories?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };

      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'structured-data-website';
      script.textContent = JSON.stringify(websiteData);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup: remove script on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [type, product, location.pathname, settings, baseUrl]);

  return null;
}

