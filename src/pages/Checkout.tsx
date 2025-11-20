import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/profile';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Maroc',
  });

  // Pré-remplir les champs avec les données du profil si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const profile = await getProfile(user.id);
        if (profile) {
          // Séparer le nom complet en prénom et nom
          const fullNameParts = (profile.full_name || '').split(' ');
          const firstName = fullNameParts[0] || '';
          const lastName = fullNameParts.slice(1).join(' ') || '';

          setFormData((prev) => ({
            ...prev,
            email: profile.email || user.email || prev.email,
            phone: profile.phone || prev.phone,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            address: profile.address?.street || prev.address,
            city: profile.address?.city || prev.city,
            postalCode: profile.address?.postal_code || prev.postalCode,
            country: profile.address?.country || prev.country || 'Maroc',
          }));
        }
      };
      loadProfile();
    }
  }, [user]);

  // Formater le numéro WhatsApp (enlever espaces et caractères spéciaux sauf +)
  const formatWhatsAppNumber = (phone: string) => {
    return phone.replace(/[\s\-\(\)]/g, '');
  };

  // Créer le message WhatsApp avec les détails de la commande
  const createWhatsAppMessage = () => {
    const subtotal = getTotal();
    const tax = subtotal * 0.2;
    const total = subtotal + tax;

    let message = `🛒 *NOUVELLE COMMANDE*\n\n`;
    message += `*Informations client:*\n`;
    message += `👤 Nom: ${formData.firstName} ${formData.lastName}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Téléphone: ${formData.phone}\n\n`;
    
    message += `*Adresse de livraison:*\n`;
    message += `📍 ${formData.address}\n`;
    message += `🏙️ ${formData.city}, ${formData.postalCode}\n`;
    message += `🌍 ${formData.country}\n\n`;
    
    message += `*Produits commandés:*\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qté: ${item.quantity} × ${item.price.toFixed(0)} FCFA = ${(item.price * item.quantity).toFixed(0)} FCFA\n`;
    });
    
    message += `\n*Résumé:*\n`;
    message += `💰 Sous-total: ${subtotal.toFixed(0)} FCFA\n`;
    message += `📦 Livraison: Gratuite\n`;
    message += `📊 TVA (20%): ${tax.toFixed(0)} FCFA\n`;
    message += `✨ *TOTAL: ${total.toFixed(0)} FCFA*\n`;

    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      toast.error('Veuillez compléter votre adresse de livraison');
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le message WhatsApp
      const message = createWhatsAppMessage();
      
      // Obtenir le numéro WhatsApp du site
      const whatsappNumber = formatWhatsAppNumber(settings.whatsapp || settings.phone);
      
      // Encoder le message pour l'URL
      const encodedMessage = encodeURIComponent(message);
      
      // Créer le lien WhatsApp
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappLink, '_blank');
      
      // Afficher un message de confirmation
      toast.success('Redirection vers WhatsApp... Votre commande sera traitée par notre équipe.');
      
      // Vider le panier après un court délai
      setTimeout(() => {
        clearCart();
        setIsSubmitting(false);
        navigate('/');
      }, 2000);
      
    } catch (error) {
      toast.error('Erreur lors de la préparation de la commande. Veuillez réessayer.');
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
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
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
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Comment ça fonctionne ?</p>
                    <p className="text-muted-foreground">
                      En cliquant sur "Confirmer la commande", vous serez redirigé vers WhatsApp pour finaliser votre commande avec notre équipe. 
                      Nous traiterons votre demande dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4 animate-pulse" />
                    Redirection vers WhatsApp...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Confirmer la commande
                  </>
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
