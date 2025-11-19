import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import { SkipLinks } from '@/components/SkipLinks';
import { useProducts } from '@/contexts/ProductsContext';
import { useCart } from '@/contexts/CartContext';
import { Star, ShoppingCart, TruckIcon, ShieldCheck, Plus, Minus } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import NotFound from './NotFound';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, categories } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Optimisation : useMemo pour éviter les recalculs
  const product = useMemo(
    () => products.find(p => p.id === id),
    [products, id]
  );

  const similarProducts = useMemo(
    () => product
      ? products
          .filter(p => p.category === product.category && p.id !== product.id)
          .slice(0, 4)
      : [],
    [products, product]
  );

  const categoryName = useMemo(
    () => categories.find(c => c.id === product?.category)?.name || 'Produits',
    [categories, product]
  );

  if (!product) {
    return <NotFound />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const productDescription = product.description.length > 160 
    ? product.description.substring(0, 160) + '...'
    : product.description;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={product.name}
        description={`${product.name} - ${product.brand}. ${productDescription} Prix: ${product.price}€. ${product.stock > 0 ? 'En stock' : 'Rupture de stock'}.`}
        keywords={`${product.name}, ${product.brand}, ${product.category}, informatique, consommables`}
        image={product.image}
        type="product"
        url={`${window.location.origin}/product/${product.id}`}
      />
      <StructuredData type="product" product={product} />
      <SkipLinks />
      <Navbar />

      <main id="main-content" className="flex-1 container mx-auto px-4 py-8" tabIndex={-1}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Catégories', href: '/categories' },
            { label: categoryName, href: `/categories?category=${product.category}` },
            { label: product.name }
          ]}
        />

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-xl sm:rounded-2xl overflow-hidden border border-border/50">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-contain p-4"
              />
              {product.discount && (
                <Badge className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-destructive text-destructive-foreground">
                  -{product.discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-primary-foreground">
                  Nouveau
                </Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1 sm:mb-2">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                {product.originalPrice && (
                  <span className="text-lg sm:text-2xl text-muted-foreground line-through">
                    {product.originalPrice.toFixed(0)} FCFA
                  </span>
                )}
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {product.price.toFixed(0)} <span className="text-lg sm:text-xl font-normal text-foreground/80">FCFA</span>
                </span>
              </div>

              {/* Stock */}
              <div className="mb-4 sm:mb-6">
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <span className="block w-2 h-2 rounded-full bg-green-600" />
                    En stock ({product.stock} disponibles)
                  </p>
                ) : (
                  <p className="text-sm text-destructive font-medium flex items-center gap-2">
                    <span className="block w-2 h-2 rounded-full bg-destructive" />
                    Rupture de stock
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground mb-6">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantité:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <TruckIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Livraison rapide</p>
                  <p className="text-xs text-muted-foreground">Sous 48h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Garantie</p>
                  <p className="text-xs text-muted-foreground">2 ans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mb-16">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Spécifications techniques</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-border pb-3">
                    <dt className="text-sm text-muted-foreground mb-1">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsContent>
          <TabsContent value="description" className="mt-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Description détaillée</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
