import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export const HeroBanner = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${settings.hero_image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-4 sm:space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            {settings.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link to="/categories">
                Découvrir nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              asChild
            >
              <Link to="/about">En savoir plus</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-primary-foreground/90">
            <div>
              <div className="text-xl sm:text-2xl font-bold">1000+</div>
              <div className="text-xs sm:text-sm">Produits</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">50+</div>
              <div className="text-xs sm:text-sm">Marques</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">10k+</div>
              <div className="text-xs sm:text-sm">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
