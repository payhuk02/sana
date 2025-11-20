import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { supabase } from '@/lib/supabase';
import { productSchema } from '@/lib/validations';
import { z } from 'zod';
import { logger } from '@/lib/logger';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { products, addProduct, updateProduct } = useProducts();
  
  const existingProduct = isEdit ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    category: existingProduct?.category || 'ordinateurs',
    price: existingProduct?.price.toString() || '',
    originalPrice: existingProduct?.originalPrice?.toString() || '',
    stock: existingProduct?.stock.toString() || '',
    brand: existingProduct?.brand || '',
    description: existingProduct?.description || '',
    specifications: existingProduct?.specifications || {},
    imageUrl: existingProduct?.image || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(existingProduct?.image || '');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Vérifier qu'au moins une image (fichier ou URL) est fournie pour les nouveaux produits
      // Pour l'édition, on garde l'image existante si aucune nouvelle n'est fournie
      if (!isEdit && !imageFile && !formData.imageUrl) {
        toast.error('Veuillez fournir une image (fichier ou URL)');
        setUploading(false);
        return;
      }

      // Préparer les données de validation
      const validationData: any = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        brand: formData.brand,
        description: formData.description,
      };

      // Ajouter imageUrl seulement si fourni ET qu'aucun fichier n'est uploadé
      // Si un fichier est uploadé, on ignore l'URL (le fichier a la priorité)
      if (!imageFile && formData.imageUrl && formData.imageUrl.trim() !== '') {
        validationData.imageUrl = formData.imageUrl;
      } else if (imageFile) {
        // Si un fichier est uploadé, on ne valide pas l'URL (optionnel)
        validationData.imageUrl = '';
      }

      // Valider les données
      const validatedData = productSchema.parse(validationData);

      // Utiliser l'image existante en mode édition si aucune nouvelle n'est fournie
      let imageUrl = isEdit && existingProduct?.image ? existingProduct.image : '/placeholder.svg';

      // Upload image if file is selected (priorité au fichier)
      if (imageFile) {
        // Valider le type de fichier
        if (!imageFile.type.startsWith('image/')) {
          toast.error('Veuillez sélectionner un fichier image valide');
          setUploading(false);
          return;
        }

        // Valider la taille (max 10MB)
        if (imageFile.size > 10 * 1024 * 1024) {
          toast.error('L\'image ne doit pas dépasser 10 MB');
          setUploading(false);
          return;
        }

        // Nettoyer le nom de fichier pour éviter les caractères spéciaux
        const sanitizeFileName = (name: string) => {
          return name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/\s+/g, '_')
            .toLowerCase();
        };

        const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || 'png';
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const sanitizedName = sanitizeFileName(imageFile.name.split('.')[0]);
        const fileName = `${timestamp}-${randomStr}-${sanitizedName}.${fileExt}`;
        
        // Créer un chemin structuré dans le bucket
        const filePath = `products/${fileName}`;

        logger.info(`Uploading image: ${filePath} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`, 'ProductForm');

        // Upload vers Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          logger.error('Error uploading image', {
            error: uploadError,
            filePath,
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
          }, 'ProductForm');
          
          // Messages d'erreur plus spécifiques
          let errorMessage = 'Erreur lors de l\'upload de l\'image';
          if (uploadError.message?.includes('Bucket not found')) {
            errorMessage = 'Le bucket product-images n\'existe pas. Veuillez le créer dans Supabase Storage.';
          } else if (uploadError.message?.includes('new row violates row-level security policy')) {
            errorMessage = 'Permissions insuffisantes. Vérifiez que vous êtes connecté en tant qu\'admin.';
          } else if (uploadError.message?.includes('The resource already exists')) {
            errorMessage = 'Un fichier avec ce nom existe déjà. Veuillez réessayer.';
          } else if (uploadError.message) {
            errorMessage = `Erreur: ${uploadError.message}`;
          }
          
          toast.error(errorMessage);
          setUploading(false);
          return;
        }

        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        logger.info(`Image uploaded successfully: ${publicUrl}`, 'ProductForm');
        imageUrl = publicUrl;
        toast.success('Image uploadée avec succès');
      } else if (formData.imageUrl) {
        // Utiliser l'URL fournie si pas de fichier
        imageUrl = formData.imageUrl;
      }

      const productData = {
        id: isEdit ? id! : `product-${Date.now()}`,
        name: validatedData.name,
        category: validatedData.category as any,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice || undefined,
        stock: validatedData.stock,
        brand: validatedData.brand,
        description: validatedData.description,
        specifications: formData.specifications,
        image: imageUrl,
        rating: existingProduct?.rating || 0,
        reviews: existingProduct?.reviews || 0,
      };

      if (isEdit) {
        await updateProduct(id!, productData);
        toast.success('Produit modifié avec succès');
      } else {
        await addProduct(productData);
        toast.success('Produit ajouté avec succès');
      }
      
      navigate('/admin/products');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          toast.error(`${err.path.join('.')}: ${err.message}`);
        });
      } else {
        logger.error('Error saving product', error, 'ProductForm');
        toast.error('Erreur lors de l\'enregistrement du produit');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Valider le type de fichier immédiatement
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image valide');
        e.target.value = ''; // Réinitialiser l'input
        return;
      }

      // Valider la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 10 MB');
        e.target.value = ''; // Réinitialiser l'input
        return;
      }

      setImageFile(file);
      // Créer un preview du fichier sélectionné
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Si aucun fichier, réinitialiser
      setImageFile(null);
      // Restaurer l'URL ou le preview existant si disponible
      if (formData.imageUrl) {
        setImagePreview(formData.imageUrl);
      } else if (existingProduct?.image) {
        setImagePreview(existingProduct.image);
      } else {
        setImagePreview('');
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? 'Modifiez les informations du produit' : 'Créez un nouveau produit'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ordinateurs">Ordinateurs</SelectItem>
                        <SelectItem value="telephones">Téléphones</SelectItem>
                        <SelectItem value="tablettes">Tablettes</SelectItem>
                        <SelectItem value="televisions">Télévisions</SelectItem>
                        <SelectItem value="accessoires">Accessoires</SelectItem>
                        <SelectItem value="consommables">Consommables</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Marque *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(formData.specifications).map(([key, value], index) => {
                    // Utiliser un identifiant unique pour chaque entrée
                    const entryId = `${key}-${index}`;
                    return (
                      <div key={entryId} className="flex gap-2">
                        <Input
                          placeholder="Nom de la spécification (ex: Processeur)"
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value.trim();
                            if (newKey === key) return; // Pas de changement
                            
                            const newSpecs = { ...formData.specifications };
                            delete newSpecs[key];
                            if (newKey) {
                              newSpecs[newKey] = value;
                            }
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Valeur (ex: Intel Core i7)"
                          value={value}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              specifications: { ...prev.specifications, [key]: e.target.value }
                            }));
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newSpecs = { ...formData.specifications };
                            delete newSpecs[key];
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newKey = `Nouvelle spécification ${Object.keys(formData.specifications).length + 1}`;
                    setFormData(prev => ({
                      ...prev,
                      specifications: { ...prev.specifications, [newKey]: '' }
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une spécification
                </Button>
                {Object.keys(formData.specifications).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Aucune spécification. Cliquez sur "Ajouter une spécification" pour en ajouter.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prix et stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Prix original (FCFA)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleChange('originalPrice', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Uploader une image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: JPG, PNG, WebP (max 10 MB)
                  </p>
                  {imageFile && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✓ Fichier sélectionné: {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      ou
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">
                    URL de l'image {!imageFile && !isEdit ? <span className="text-muted-foreground">(optionnel)</span> : ''}
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => {
                      handleChange('imageUrl', e.target.value);
                      // Mettre à jour le preview seulement si pas de fichier sélectionné
                      if (!imageFile) {
                        setImagePreview(e.target.value);
                      }
                    }}
                    disabled={!!imageFile}
                  />
                  {imageFile && (
                    <p className="text-xs text-muted-foreground">
                      L'URL est désactivée car un fichier est sélectionné. Le fichier sera utilisé.
                    </p>
                  )}
                  {!imageFile && !isEdit && (
                    <p className="text-xs text-muted-foreground">
                      Si vous n'uploadez pas de fichier, fournissez une URL d'image valide.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Ajouter'} le produit
          </Button>
        </div>
      </form>
    </div>
  );
}
