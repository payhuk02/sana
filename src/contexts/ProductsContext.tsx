import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CategoryInfo } from '@/types/product';
import { products as initialProducts, categories as initialCategories } from '@/data/products';
import { supabase } from '@/lib/supabase';

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
          supabase.from('products').select('*'),
          supabase.from('categories').select('*')
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
        console.error('Error fetching data:', error);
        // Fallback to initial data on error
        setProducts(initialProducts);
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        supabase.from('products').select('*').then(({ data }) => {
          if (data) setProducts(data);
        });
      })
      .subscribe();

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        supabase.from('categories').select('*').then(({ data }) => {
          if (data) setCategories(data);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  const addProduct = async (product: Product) => {
    try {
      const { error } = await supabase.from('products').insert([product]);
      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
      setProducts(prev => [...prev, product]);
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const { error } = await supabase.from('products').update(updatedProduct).eq('id', id);
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const addCategory = async (category: CategoryInfo) => {
    try {
      const { error } = await supabase.from('categories').insert([category]);
      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }
      setCategories(prev => [...prev, category]);
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updatedCategory: Partial<CategoryInfo>) => {
    try {
      const { error } = await supabase.from('categories').update(updatedCategory).eq('id', id);
      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      setCategories(prev =>
        prev.map(c => (c.id === id ? { ...c, ...updatedCategory } : c))
      );
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
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
