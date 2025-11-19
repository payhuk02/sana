import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export const Footer = () => {
  const { settings } = useSiteSettings();
  
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="font-bold text-lg mb-4">{settings.siteName}</h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              {settings.slogan}
            </p>
            <div className="flex space-x-3">
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories?category=ordinateurs" className="hover:text-primary transition-colors">
                  Ordinateurs
                </Link>
              </li>
              <li>
                <Link to="/categories?category=telephones" className="hover:text-primary transition-colors">
                  Téléphones
                </Link>
              </li>
              <li>
                <Link to="/categories?category=tablettes" className="hover:text-primary transition-colors">
                  Tablettes
                </Link>
              </li>
              <li>
                <Link to="/categories?category=televisions" className="hover:text-primary transition-colors">
                  Télévisions
                </Link>
              </li>
              <li>
                <Link to="/categories?category=accessoires" className="hover:text-primary transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Sana Distribution. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-primary transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
