import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';

const mockCustomers = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '06 12 34 56 78', orders: 5 },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@email.com', phone: '06 23 45 67 89', orders: 3 },
  { id: 3, name: 'Pierre Durand', email: 'pierre.durand@email.com', phone: '06 34 56 78 90', orders: 8 },
  { id: 4, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '06 45 67 89 01', orders: 2 },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground mt-2">Gérez vos clients</p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Nom</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Téléphone</TableHead>
                    <TableHead className="w-28">Commandes</TableHead>
                    <TableHead className="text-right w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{customer.phone}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
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
