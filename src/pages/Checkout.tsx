import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CreditCard, Landmark } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Commande validée avec succès !');
    clearCart();
    setTimeout(() => navigate('/'), 1500);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" required />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input id="postalCode" required />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" defaultValue="France" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Moyen de paiement</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 mb-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>Carte bancaire</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Landmark className="h-5 w-5" />
                      <span>Virement bancaire</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Date d'expiration</Label>
                        <Input id="expiry" placeholder="MM/AA" required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full">
                Confirmer la commande
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Votre commande</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qté: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        {(item.price * item.quantity).toFixed(0)} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{getTotal().toFixed(0)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (20%)</span>
                  <span>{(getTotal() * 0.2).toFixed(0)} FCFA</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{(getTotal() * 1.2).toFixed(0)} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
