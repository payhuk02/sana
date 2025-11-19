import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/contexts/ProductsContext';
import { useCart } from '@/contexts/CartContext';
import { Star, ShoppingCart, TruckIcon, ShieldCheck, ChevronLeft, Plus, Minus } from 'lucide-react';
import NotFound from './NotFound';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <NotFound />;
  }

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/categories" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux produits
          </Link>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                  -{product.discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Nouveau
                </Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    {product.originalPrice.toFixed(0)} FCFA
                  </span>
                )}
                <span className="text-4xl font-bold text-primary">
                  {product.price.toFixed(0)} FCFA
                </span>
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ En stock ({product.stock} disponibles)
                  </p>
                ) : (
                  <p className="text-sm text-destructive font-medium">
                    Rupture de stock
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{product.description}</p>
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
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
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
