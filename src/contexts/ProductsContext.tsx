import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CategoryInfo } from '@/types/product';
import { products as initialProducts, categories as initialCategories } from '@/data/products';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface ProductsContextType {
  products: Product[];
  categories: CategoryInfo[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: CategoryInfo) => void;
  updateCategory: (id: string, category: Partial<CategoryInfo>) => void;
  deleteCategory: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('id, name, category, price, originalPrice, image, description, specifications, brand, stock, rating, reviews, featured, isNew, discount'),
          supabase.from('categories').select('id, name, icon, description')
        ]);

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        } else {
          // Initialize with default data if empty
          const { error } = await supabase.from('products').insert(initialProducts);
          if (!error) setProducts(initialProducts);
        }

        if (categoriesRes.data && categoriesRes.data.length > 0) {
          setCategories(categoriesRes.data);
        } else {
          // Initialize with default data if empty
          const { error } = await supabase.from('categories').insert(initialCategories);
          if (!error) setCategories(initialCategories);
        }
      } catch (error) {
        logger.error('Error fetching products and categories', error, 'ProductsContext');
        // Fallback to initial data on error
        setProducts(initialProducts);
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Listen for real-time updates avec cleanup optimisé
  useEffect(() => {
    let isMounted = true; // Flag pour éviter les mises à jour après unmount

    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        // Recharger uniquement les colonnes nécessaires
        if (isMounted) {
          supabase
            .from('products')
            .select('id, name, category, price, originalPrice, image, description, specifications, brand, stock, rating, reviews, featured, isNew, discount')
            .then(({ data }) => {
              if (isMounted && data) setProducts(data);
            })
            .catch((error) => {
              if (isMounted) {
                logger.error('Error in products realtime subscription', error, 'ProductsContext');
              }
            });
        }
      })
      .subscribe();

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        if (isMounted) {
          supabase.from('categories').select('id, name, icon, description').then(({ data }) => {
            if (isMounted && data) setCategories(data);
          })
          .catch((error) => {
            if (isMounted) {
              logger.error('Error in categories realtime subscription', error, 'ProductsContext');
            }
          });
        }
      })
      .subscribe();

    return () => {
      isMounted = false; // Marquer comme unmounted
      // Cleanup des channels
      supabase.removeChannel(productsChannel).catch(() => {
        // Ignorer les erreurs de cleanup
      });
      supabase.removeChannel(categoriesChannel).catch(() => {
        // Ignorer les erreurs de cleanup
      });
    };
  }, []);

  const addProduct = useCallback(async (product: Product) => {
    try {
      const { data, error } = await supabase.from('products').insert([product]).select().single();
      if (error) {
        logger.error('Error adding product to database', error, 'ProductsContext');
        throw error;
      }
      // Ne pas mettre à jour le state local ici - la subscription Realtime le fera automatiquement
      // Cela évite les doubles mises à jour et garantit la cohérence avec la DB
    } catch (error) {
      logger.error('Failed to add product', error, 'ProductsContext');
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const { error } = await supabase.from('products').update(updatedProduct).eq('id', id);
      if (error) {
        logger.error('Error updating product in database', error, 'ProductsContext');
        throw error;
      }
      // Ne pas mettre à jour le state local ici - la subscription Realtime le fera automatiquement
      // Cela évite les doubles mises à jour et garantit la cohérence avec la DB
    } catch (error) {
      logger.error('Failed to update product', error, 'ProductsContext');
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        logger.error('Error deleting product from database', error, 'ProductsContext');
        throw error;
      }
      // Ne pas mettre à jour le state local ici - la subscription Realtime le fera automatiquement
      // Cela évite les doubles mises à jour et garantit la cohérence avec la DB
    } catch (error) {
      logger.error('Failed to delete product', error, 'ProductsContext');
      throw error;
    }
  }, []);

  const addCategory = useCallback(async (category: CategoryInfo) => {
    try {
      const { error } = await supabase.from('categories').insert([category]);
      if (error) {
        logger.error('Error adding category to database', error, 'ProductsContext');
        throw error;
      }
      // Ne pas mettre à jour le state local ici - la subscription Realtime le fera automatiquement
    } catch (error) {
      logger.error('Failed to add category', error, 'ProductsContext');
      throw error;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updatedCategory: Partial<CategoryInfo>) => {
    try {
      const { error } = await supabase.from('categories').update(updatedCategory).eq('id', id);
      if (error) {
        logger.error('Error updating category in database', error, 'ProductsContext');
        throw error;
      }
      // Ne pas mettre à jour le state local ici - la subscription Realtime le fera automatiquement
    } catch (error) {
      logger.error('Failed to update category', error, 'ProductsContext');
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        logger.error('Error deleting category from database', error, 'ProductsContext');
        throw error;
      }
      // Ne pas mettre à jour le state local ici - la subscription Realtime le fera automatiquement
    } catch (error) {
      logger.error('Failed to delete category', error, 'ProductsContext');
      throw error;
    }
  }, []);

  // Séparer les valeurs pour éviter les re-renders inutiles
  // Les données (products, categories) changent moins souvent que les fonctions
  const dataValue = useMemo(() => ({
    products,
    categories,
  }), [products, categories]);

  // Les fonctions sont stables grâce à useCallback
  const actionsValue = useMemo(() => ({
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  }), [addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory]);

  // Combiner les valeurs
  const value = useMemo(() => ({
    ...dataValue,
    ...actionsValue,
  }), [dataValue, actionsValue]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};
