import { HeroBanner } from '@/components/HeroBanner';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProducts } from '@/contexts/ProductsContext';
import { Star, TruckIcon, ShieldCheck, HeadphonesIcon } from 'lucide-react';

const Index = () => {
  const { products, categories } = useProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  const promoProducts = products.filter(p => p.discount).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <HeroBanner />
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: TruckIcon, title: 'Livraison rapide', desc: 'Sous 48h' },
                { icon: ShieldCheck, title: 'Paiement sécurisé', desc: '100% sécurisé' },
                { icon: HeadphonesIcon, title: 'Support 7j/7', desc: 'À votre écoute' },
                { icon: Star, title: 'Garantie qualité', desc: 'Produits certifiés' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Nos Catégories</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Explorez notre sélection complète de produits high-tech
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits Populaires</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos meilleures ventes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* New Products */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nouveautés</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les derniers produits ajoutés
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Promotions */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Promotions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Profitez de nos offres exceptionnelles
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Avis Clients</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ce que nos clients disent de nous
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
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
            ].map((testimonial, i) => (
              <div key={i} className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
