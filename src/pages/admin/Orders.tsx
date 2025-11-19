import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockOrders = [
  { id: 1001, customer: 'Jean Dupont', total: 859.99, status: 'pending', date: '2025-01-15' },
  { id: 1002, customer: 'Marie Martin', total: 1299.99, status: 'paid', date: '2025-01-14' },
  { id: 1003, customer: 'Pierre Durand', total: 459.99, status: 'delivered', date: '2025-01-13' },
  { id: 1004, customer: 'Sophie Bernard', total: 2199.99, status: 'paid', date: '2025-01-12' },
];

const statusColors: Record<string, string> = {
  pending: 'default',
  paid: 'secondary',
  delivered: 'outline',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  delivered: 'Livrée',
};

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Commandes</h1>
        <p className="text-muted-foreground mt-2">Gérez les commandes clients</p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">ID</TableHead>
                    <TableHead className="min-w-[150px]">Client</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[120px]">Montant</TableHead>
                    <TableHead className="min-w-[150px]">Statut</TableHead>
                    <TableHead className="text-right w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium whitespace-nowrap">#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="whitespace-nowrap">{new Date(order.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.total.toFixed(0)} FCFA</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="paid">Payée</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
