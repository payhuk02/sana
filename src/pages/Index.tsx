import { useMemo } from 'react';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCardSkeleton } from '@/components/CategoryCardSkeleton';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { SkipLinks } from '@/components/SkipLinks';
import { useProducts } from '@/contexts/ProductsContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Star } from 'lucide-react';
import { getIcon } from '@/lib/iconMap';

const Index = () => {
  const { products, categories } = useProducts();
  const { settings } = useSiteSettings();
  const isLoading = products.length === 0 || categories.length === 0;
  
  // Optimisation : useMemo pour éviter les recalculs
  const featuredProducts = useMemo(
    () => products.filter(p => p.featured).slice(0, 3),
    [products]
  );
  const newProducts = useMemo(
    () => products.filter(p => p.isNew).slice(0, 4),
    [products]
  );
  const promoProducts = useMemo(
    () => products.filter(p => p.discount).slice(0, 4),
    [products]
  );
  
  // Utiliser les features depuis les settings
  const features = useMemo(() => 
    (settings.features_content || []).map(feature => ({
      ...feature,
      icon: getIcon(feature.icon),
    })),
    [settings.features_content]
  );
  
  // Utiliser les témoignages depuis les settings
  const testimonials = useMemo(() => 
    settings.testimonials_content || [],
    [settings.testimonials_content]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Accueil"
        description="Découvrez notre sélection complète de consommables informatiques : ordinateurs, téléphones, tablettes, TV et accessoires aux meilleurs prix. Livraison rapide et paiement sécurisé."
        keywords="informatique, ordinateurs, téléphones, tablettes, consommables, high-tech, livraison rapide"
      />
      <SkipLinks />
      <Navbar />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <HeroBanner />
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {settings.homepage_sections?.categories?.title || 'Nos Catégories'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              {settings.homepage_sections?.categories?.description || 'Explorez notre sélection complète de produits high-tech'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            ) : (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {settings.homepage_sections?.featured?.title || 'Produits Populaires'}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {settings.homepage_sections?.featured?.description || 'Découvrez nos meilleures ventes'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* New Products */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {settings.homepage_sections?.new?.title || 'Nouveautés'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {settings.homepage_sections?.new?.description || 'Les derniers produits ajoutés'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : (
              newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Promotions */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {settings.homepage_sections?.promo?.title || 'Promotions'}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {settings.homepage_sections?.promo?.description || 'Profitez de nos offres exceptionnelles'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                promoProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {settings.homepage_sections?.testimonials?.title || 'Avis Clients'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {settings.homepage_sections?.testimonials?.description || 'Ce que nos clients disent de nous'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? testimonials.map((testimonial, i) => (
              <div key={i} className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            )) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                Aucun témoignage configuré pour le moment.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
