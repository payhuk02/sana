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
import { CreditCard, Landmark, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createOrder } from '@/lib/orders';
import { useProducts } from '@/contexts/ProductsContext';
import { logger } from '@/lib/logger';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations';
import { z } from 'zod';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Maroc',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Valider les données du formulaire avec Zod
      const validationData = {
        ...formData,
        paymentMethod,
      };

      const validatedData = checkoutSchema.parse(validationData);

      // Créer la commande (le stock est géré automatiquement dans createOrder)
      const orderData = {
        customer_email: validatedData.email,
        customer_name: `${validatedData.firstName} ${validatedData.lastName}`,
        customer_phone: validatedData.phone,
        shipping_address: {
          street: validatedData.address,
          city: validatedData.city,
          postal_code: validatedData.postalCode,
          country: validatedData.country,
        },
        payment_method: validatedData.paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const order = await createOrder(orderData);

      toast.success(`Commande #${order.order_number} validée avec succès !`);
      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Gérer les erreurs de validation
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        
        // Afficher le premier message d'erreur
        const firstError = error.errors[0];
        if (firstError) {
          toast.error(firstError.message);
        }
      } else {
        logger.error('Error creating order', error, 'Checkout');
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la commande. Veuillez réessayer.';
        toast.error(errorMessage);
      }
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Panier', href: '/cart' },
            { label: 'Commande' }
          ]}
        />
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
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        handleInputChange('firstName', e.target.value);
                        if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: '' }));
                      }}
                      required
                      className={formErrors.firstName ? 'border-destructive' : ''}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-destructive mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        handleInputChange('lastName', e.target.value);
                        if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: '' }));
                      }}
                      required
                      className={formErrors.lastName ? 'border-destructive' : ''}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-destructive mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleInputChange('email', e.target.value);
                        if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                      }}
                      required
                      className={formErrors.email ? 'border-destructive' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        handleInputChange('phone', e.target.value);
                        if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      required
                      className={formErrors.phone ? 'border-destructive' : ''}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => {
                        handleInputChange('address', e.target.value);
                        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: '' }));
                      }}
                      required
                      className={formErrors.address ? 'border-destructive' : ''}
                    />
                    {formErrors.address && (
                      <p className="text-sm text-destructive mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => {
                          handleInputChange('city', e.target.value);
                          if (formErrors.city) setFormErrors(prev => ({ ...prev, city: '' }));
                        }}
                        required
                        className={formErrors.city ? 'border-destructive' : ''}
                      />
                      {formErrors.city && (
                        <p className="text-sm text-destructive mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => {
                          handleInputChange('postalCode', e.target.value);
                          if (formErrors.postalCode) setFormErrors(prev => ({ ...prev, postalCode: '' }));
                        }}
                        required
                        className={formErrors.postalCode ? 'border-destructive' : ''}
                      />
                      {formErrors.postalCode && (
                        <p className="text-sm text-destructive mt-1">{formErrors.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => {
                          handleInputChange('country', e.target.value);
                          if (formErrors.country) setFormErrors(prev => ({ ...prev, country: '' }));
                        }}
                        required
                        className={formErrors.country ? 'border-destructive' : ''}
                      />
                      {formErrors.country && (
                        <p className="text-sm text-destructive mt-1">{formErrors.country}</p>
                      )}
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
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          // Formater le numéro de carte avec des espaces
                          const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                          handleInputChange('cardNumber', value);
                          if (formErrors.cardNumber) setFormErrors(prev => ({ ...prev, cardNumber: '' }));
                        }}
                        maxLength={19}
                        required
                        className={formErrors.cardNumber ? 'border-destructive' : ''}
                      />
                      {formErrors.cardNumber && (
                        <p className="text-sm text-destructive mt-1">{formErrors.cardNumber}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Date d'expiration</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={formData.expiry}
                          onChange={(e) => {
                            // Formater la date d'expiration
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            handleInputChange('expiry', value);
                            if (formErrors.expiry) setFormErrors(prev => ({ ...prev, expiry: '' }));
                          }}
                          maxLength={5}
                          required
                          className={formErrors.expiry ? 'border-destructive' : ''}
                        />
                        {formErrors.expiry && (
                          <p className="text-sm text-destructive mt-1">{formErrors.expiry}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                            handleInputChange('cvv', value);
                            if (formErrors.cvv) setFormErrors(prev => ({ ...prev, cvv: '' }));
                          }}
                          maxLength={4}
                          required
                          className={formErrors.cvv ? 'border-destructive' : ''}
                        />
                        {formErrors.cvv && (
                          <p className="text-sm text-destructive mt-1">{formErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  'Confirmer la commande'
                )}
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
                        loading="lazy"
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
