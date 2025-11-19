import { Order } from '@/types/order';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, CreditCard, Calendar } from 'lucide-react';

interface OrderDetailsProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const statusColors: Record<string, string> = {
  pending: 'default',
  paid: 'secondary',
  processing: 'default',
  shipped: 'outline',
  delivered: 'outline',
  cancelled: 'destructive',
};

const paymentMethodLabels: Record<string, string> = {
  card: 'Carte bancaire',
  bank: 'Virement bancaire',
};

export function OrderDetails({ order, open, onOpenChange }: OrderDetailsProps) {
  if (!order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Commande {order.order_number}</span>
            <Badge variant={statusColors[order.status] as any}>
              {statusLabels[order.status] || order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Date de commande: {new Date(order.created_at).toLocaleString('fr-FR')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Informations client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Informations client
              </h3>
              <div className="text-sm space-y-1 pl-6">
                <p><strong>Nom:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Téléphone:</strong> {order.customer_phone}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse de livraison
              </h3>
              <div className="text-sm space-y-1 pl-6">
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.postal_code} {order.shipping_address.city}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations de paiement */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Informations de paiement
            </h3>
            <div className="text-sm space-y-1 pl-6">
              <p>
                <strong>Méthode:</strong> {paymentMethodLabels[order.payment_method] || order.payment_method}
              </p>
              <p>
                <strong>Statut:</strong>{' '}
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
                  {order.payment_status === 'paid' ? 'Payé' : order.payment_status === 'pending' ? 'En attente' : 'Échoué'}
                </Badge>
              </p>
            </div>
          </div>

          <Separator />

          {/* Produits commandés */}
          <div className="space-y-2">
            <h3 className="font-semibold">Produits commandés</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {item.quantity} × {formatCurrency(item.price)} FCFA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(item.subtotal)} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Récapitulatif */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Récapitulatif
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>{formatCurrency(order.subtotal)} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA (20%):</span>
                <span>{formatCurrency(order.tax)} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison:</span>
                <span>
                  {order.shipping_cost === 0 ? (
                    <span className="text-green-600">Gratuite</span>
                  ) : (
                    `${formatCurrency(order.shipping_cost)} FCFA`
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(order.total)} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

