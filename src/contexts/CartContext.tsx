import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, Product } from '@/types/product';
import { toast } from 'sonner';
import { useProducts } from './ProductsContext';
import { logger } from '@/lib/logger';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { products } = useProducts();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sana-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      logger.error('Error reading cart from localStorage', error, 'CartContext');
      return [];
    }
  });

  // Debounce localStorage writes pour éviter les écritures excessives
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('sana-cart', JSON.stringify(cart));
      } catch (error) {
        logger.error('Error saving cart to localStorage', error, 'CartContext');
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      // Vérifier le stock disponible
      const currentProduct = products.find(p => p.id === product.id);
      if (!currentProduct) {
        toast.error('Produit introuvable');
        return prev;
      }

      const currentCartItem = prev.find(item => item.id === product.id);
      const currentQuantity = currentCartItem?.quantity || 0;
      const requestedQuantity = currentQuantity + quantity;

      if (requestedQuantity > currentProduct.stock) {
        toast.error(
          `Stock insuffisant. Stock disponible : ${currentProduct.stock} unité(s)`
        );
        return prev;
      }

      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success('Quantité mise à jour');
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success('Produit ajouté au panier');
      return [...prev, { ...product, quantity }];
    });
  }, [products]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success('Produit retiré du panier');
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => {
      // Vérifier le stock disponible
      const currentProduct = products.find(p => p.id === productId);
      if (!currentProduct) {
        toast.error('Produit introuvable');
        return prev;
      }

      let finalQuantity = quantity;
      if (quantity > currentProduct.stock) {
        toast.error(
          `Stock insuffisant. Stock disponible : ${currentProduct.stock} unité(s)`
        );
        // Ajuster à la quantité maximale disponible
        finalQuantity = currentProduct.stock;
      }

      return prev.map(item =>
        item.id === productId ? { ...item, quantity: finalQuantity } : item
      );
    });
  }, [products, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('sana-cart');
  }, []);

  const getTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Séparer les valeurs pour éviter les re-renders inutiles
  // Les données (cart) changent plus souvent que les fonctions
  const dataValue = useMemo(() => ({
    cart,
  }), [cart]);

  // Les fonctions sont stables grâce à useCallback
  const actionsValue = useMemo(() => ({
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  }), [addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount]);

  // Combiner les valeurs
  const value = useMemo(() => ({
    ...dataValue,
    ...actionsValue,
  }), [dataValue, actionsValue]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
