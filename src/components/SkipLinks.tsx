import { Link } from 'react-router-dom';

/**
 * Composant SkipLinks pour l'accessibilité
 * Permet aux utilisateurs de clavier d'accéder rapidement au contenu principal
 */
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:z-[100] focus-within:top-4 focus-within:left-4">
      <Link
        to="#main-content"
        className="block px-4 py-2 bg-primary text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        Aller au contenu principal
      </Link>
      <Link
        to="#navigation"
        className="block px-4 py-2 bg-primary text-primary-foreground rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          const navigation = document.getElementById('navigation');
          if (navigation) {
            navigation.focus();
            navigation.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        Aller à la navigation
      </Link>
    </div>
  );
}

