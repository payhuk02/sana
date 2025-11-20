import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { settings } = useSiteSettings();

  // Formater le numéro WhatsApp (enlever espaces et caractères spéciaux sauf +)
  const formatWhatsAppNumber = (phone: string) => {
    return phone.replace(/[\s\-\(\)]/g, '');
  };

  // Créer le lien WhatsApp avec message pré-rempli
  const getWhatsAppLink = () => {
    const phone = formatWhatsAppNumber(settings.whatsapp || settings.phone);
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par le produit : ${product.name}`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <Card className="group overflow-hidden hover-lift h-full flex flex-col max-w-full">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-muted">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.discount && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{product.discount}%
          </Badge>
        )}
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            Nouveau
          </Badge>
        )}
      </Link>

      <CardContent className="flex-1 p-3 sm:p-4 min-w-0">
        <Link to={`/product/${product.id}`} className="block min-w-0">
          <p className="text-xs text-muted-foreground mb-1 truncate">{product.brand}</p>
          <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors min-w-0">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm ml-1 font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            ({product.reviews} avis)
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toFixed(0)} FCFA
            </span>
          )}
          <span className="text-xl font-bold text-primary">
            {product.price.toFixed(0)} FCFA
          </span>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-destructive mt-2">
            Plus que {product.stock} en stock
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-destructive mt-2">Rupture de stock</p>
        )}
      </CardContent>

      <CardFooter className="p-2 sm:p-3 md:p-4 pt-0">
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 w-full">
          <Button
            asChild
            variant="outline"
            className="flex-1 w-full sm:flex-1 min-w-0 overflow-hidden"
            size="sm"
          >
            <Link 
              to={`/product/${product.id}`} 
              className="flex items-center justify-center gap-1.5 min-w-0 w-full"
            >
              <Eye className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-sm truncate whitespace-nowrap">Voir</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 w-full sm:flex-1 min-w-0 overflow-hidden"
            size="sm"
            onClick={() => {
              window.open(getWhatsAppLink(), '_blank');
            }}
          >
            <span className="flex items-center justify-center gap-1.5 min-w-0 w-full">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-sm truncate whitespace-nowrap">Contacter</span>
            </span>
          </Button>
          <Button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="flex-1 w-full sm:flex-1 min-w-0 overflow-hidden"
            size="sm"
          >
            <span className="flex items-center justify-center gap-1.5 min-w-0 w-full">
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-sm truncate whitespace-nowrap">Ajouter</span>
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
