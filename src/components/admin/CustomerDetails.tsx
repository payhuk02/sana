import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/lib/customers';
import { getCustomerOrders } from '@/lib/customers';
import { Order } from '@/types/order';
import { useState, useEffect } from 'react';
import { Loader2, Mail, Phone, MapPin, Calendar, DollarSign, Package } from 'lucide-react';

// Helper function pour formater la devise
const formatCurrencyAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface CustomerDetailsProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetails({ customer, open, onOpenChange }: CustomerDetailsProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer && open) {
      setLoading(true);
      getCustomerOrders(customer.email)
        .then((ordersData) => {
          // Convertir les données en format Order
          const formattedOrders = ordersData.map((order: any) => ({
            ...order,
            items: [], // Les items seront chargés séparément si nécessaire
          }));
          setOrders(formattedOrders);
        })
        .catch((error) => {
          console.error('Error fetching customer orders', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [customer, open]);

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
          <DialogDescription>
            Informations complètes et historique des commandes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-sm">{customer.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Téléphone</span>
              </div>
              <p className="text-sm">{customer.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Première commande</span>
              </div>
              <p className="text-sm">
                {new Date(customer.firstOrderDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dernière commande</span>
              </div>
              <p className="text-sm">
                {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{customer.totalOrders}</span>
              </div>
              <p className="text-sm text-muted-foreground">Commandes</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{formatCurrencyAmount(customer.totalSpent)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total dépensé</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {formatCurrencyAmount(Math.round(customer.totalSpent / customer.totalOrders))}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Panier moyen</p>
            </div>
          </div>

          {/* Adresses */}
          {customer.addresses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Adresses de livraison</h3>
              <div className="space-y-2">
                {customer.addresses.map((address, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">{address.street}</p>
                        <p className="text-muted-foreground">
                          {address.postal_code} {address.city}
                        </p>
                        <p className="text-muted-foreground">{address.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique des commandes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Historique des commandes</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune commande trouvée
              </p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrencyAmount(order.total)} FCFA</p>
                        <Badge variant="outline" className="mt-1">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

