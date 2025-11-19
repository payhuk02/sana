import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Votre panier est vide</h1>
            <p className="text-muted-foreground">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button asChild size="lg">
              <Link to="/categories">Voir les produits</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Panier' }]} />
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg p-3 sm:p-4 md:p-6 flex gap-3 sm:gap-4 shadow-sm relative"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border/50"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-2"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start pr-8 sm:pr-0">
                      <Link to={`/product/${item.id}`} className="block truncate pr-2">
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                        <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 h-8 w-8"
                        aria-label={`Retirer ${item.name} du panier`}
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                    <p className="text-base sm:text-xl font-bold text-primary order-1 sm:order-2">
                      {item.price.toFixed(0)} <span className="text-xs font-normal text-foreground">FCFA</span>
                    </p>

                    <div className="flex items-center border rounded-md h-8 w-fit order-2 sm:order-1" role="group" aria-label={`Quantité de ${item.name}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Moins"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 sm:w-12 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Plus"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{getTotal().toFixed(0)} FCFA</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{getTotal().toFixed(0)} FCFA</span>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="w-full mb-4">
                <Link to="/checkout">Passer la commande</Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/categories">Continuer mes achats</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
