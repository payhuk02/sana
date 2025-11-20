import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, Home, Grid, Info, Phone as PhoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const Navbar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const itemCount = getItemCount();

  const navLinks = useMemo(() => [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/categories', label: 'Catégories', icon: Grid },
    { to: '/about', label: 'À propos', icon: Info },
    { to: '/contact', label: 'Contact', icon: PhoneIcon },
  ], []);


  return (
    <nav 
      id="navigation"
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label={`${settings.siteName} - Retour à l'accueil`}
          >
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.siteName} 
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">{settings.siteName.charAt(0)}</span>
              </div>
            )}
            <div className="block">
              <span className="font-bold text-lg sm:text-xl text-foreground truncate max-w-[120px] sm:max-w-none block">{settings.siteName}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 lg:px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                role="menuitem"
                onMouseEnter={() => {
                  if (link.to === '/') import('../pages/Index').catch(() => {});
                  else if (link.to === '/categories') import('../pages/Categories').catch(() => {});
                  else if (link.to === '/about') import('../pages/About').catch(() => {});
                  else if (link.to === '/contact') import('../pages/Contact').catch(() => {});
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="hidden sm:flex"
              aria-label="Rechercher des produits"
            >
              <Link to="/categories?search=true">
                <Search className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>

            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                className="hidden sm:flex"
                aria-label="Mon compte"
              >
                <Link to="/account">
                  <User className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="relative"
              aria-label={`Panier${itemCount > 0 ? ` (${itemCount} article${itemCount > 1 ? 's' : ''})` : ''}`}
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {itemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    aria-label={`${itemCount} article${itemCount > 1 ? 's' : ''} dans le panier`}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile menu (Sheet) */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu principal">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
                  <SheetHeader className="px-1 text-left">
                    <SheetTitle className="font-bold text-xl flex items-center gap-2">
                      {settings.siteName}
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col space-y-4 mt-8 h-full pb-20 overflow-y-auto px-1">
                    <div className="relative mb-4">
                       <Link 
                        to="/categories?search=true" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium bg-muted/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        <Search className="h-4 w-4 mr-3" />
                        Rechercher un produit...
                      </Link>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Menu</h3>
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <link.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {user && (
                      <div className="space-y-1 pt-4 border-t">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Compte</h3>
                        <Link
                          to="/account"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <User className="h-5 w-5 mr-3 text-muted-foreground" />
                          Mon compte
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
