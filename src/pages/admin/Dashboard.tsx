import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, Loader2 } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { getAllOrders, getOrderStats } from '@/lib/orders';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

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

export default function Dashboard() {
  const { products } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    paidOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, statsData] = await Promise.all([
          getAllOrders(),
          getOrderStats(),
        ]);
        setOrders(ordersData.slice(0, 5)); // 5 commandes les plus récentes
        setStats(statsData);
      } catch (error) {
        logger.error('Error fetching dashboard data', error, 'Dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const dashboardStats = [
    {
      title: 'Total Produits',
      value: products.length.toString(),
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-accent',
    },
    {
      title: 'Commandes payées',
      value: stats.paidOrders.toString(),
      icon: Users,
      color: 'text-secondary',
    },
    {
      title: 'Revenus',
      value: `${formatCurrency(stats.totalRevenue)} FCFA`,
      icon: DollarSign,
      color: 'text-primary',
    },
  ];

  // Produits les plus vendus (basé sur les commandes)
  const getPopularProducts = () => {
    const productSales: Record<string, { name: string; sales: number; price: number }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.product_id]) {
          const product = products.find(p => p.id === item.product_id);
          productSales[item.product_id] = {
            name: item.product_name,
            sales: 0,
            price: item.price,
          };
        }
        productSales[item.product_id].sales += item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);
  };

  const popularProducts = getPopularProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de votre boutique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune commande pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatCurrency(order.total)} FCFA
                      </p>
                      <Badge
                        variant={statusColors[order.status] as any}
                        className="text-xs mt-1"
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            {popularProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune vente pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {popularProducts.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} vente{product.sales > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatCurrency(product.price)} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
