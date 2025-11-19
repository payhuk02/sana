import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const stats = [
  { title: 'Total Produits', value: '156', icon: Package, color: 'text-primary' },
  { title: 'Commandes', value: '48', icon: ShoppingCart, color: 'text-accent' },
  { title: 'Clients', value: '234', icon: Users, color: 'text-secondary' },
  { title: 'Revenus', value: '45 230 000 FCFA', icon: DollarSign, color: 'text-primary' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de votre boutique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">Commande #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Client {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{(Math.random() * 1000 + 100).toFixed(0)} FCFA</p>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      En cours
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">Produit {i}</p>
                    <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50 + 10)} ventes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{(Math.random() * 500 + 200).toFixed(0)} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
