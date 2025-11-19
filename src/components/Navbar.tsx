import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const { settings } = useSiteSettings();
  const itemCount = getItemCount();

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/categories', label: 'Catégories' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.siteName} 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-xl">{settings.siteName.charAt(0)}</span>
              </div>
            )}
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-foreground">{settings.siteName}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link to="/categories?search=true">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/categories?search=true"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
