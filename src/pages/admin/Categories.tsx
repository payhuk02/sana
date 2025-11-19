import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/contexts/ProductsContext';

export default function Categories() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryData = {
      id: editingCategory?.id || formData.get('name')?.toString().toLowerCase().replace(/\s+/g, '-') || '',
      name: formData.get('name')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      icon: formData.get('icon')?.toString() || '📦',
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      toast.success('Catégorie modifiée');
    } else {
      addCategory(categoryData);
      toast.success('Catégorie ajoutée');
    }
    setOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    toast.success('Catégorie supprimée');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Catégories</h1>
          <p className="text-muted-foreground mt-2">Gérez les catégories de produits</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </DialogTitle>
                <DialogDescription>
                  Renseignez les informations de la catégorie
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la catégorie</Label>
                  <Input id="name" defaultValue={editingCategory?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" defaultValue={editingCategory?.description} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icône (emoji ou nom lucide)</Label>
                  <Input id="icon" defaultValue={editingCategory?.icon} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Modifier' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 md:p-6">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Icône</TableHead>
                    <TableHead className="min-w-[150px]">Nom</TableHead>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="text-2xl">{category.icon}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCategory(category);
                        setOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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
