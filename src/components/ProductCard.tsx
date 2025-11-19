import React from 'react';
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

export const ProductCard = React.memo(({ product }: ProductCardProps) => {
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
    <Card className="group overflow-hidden hover-lift h-full flex flex-col">
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

      <CardContent className="flex-1 p-4">
        <Link to={`/product/${product.id}`}>
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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

      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Link to={`/product/${product.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            size="sm"
            onClick={() => {
              window.open(getWhatsAppLink(), '_blank');
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contacter
          </Button>
        </div>
        <Button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
