import { supabase } from './supabase';
import { Product, Category } from '@/types/product';
import { logger } from './logger';

export interface ProductFilters {
  search?: string;
  category?: Category | Category[];
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  inStock?: boolean;
}

export interface ProductSort {
  field: 'price' | 'rating' | 'reviews' | 'name';
  order: 'asc' | 'desc';
  isNew?: boolean; // Pour le tri "newest"
}

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Récupère les produits avec pagination et filtres côté serveur
 */
export async function fetchProductsPaginated(
  page: number = 1,
  pageSize: number = 12,
  filters?: ProductFilters,
  sort?: ProductSort
): Promise<PaginatedProductsResult> {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Appliquer les filtres
    if (filters) {
      // Recherche textuelle (nom, marque, description)
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Catégorie
      if (filters.category) {
        if (Array.isArray(filters.category)) {
          query = query.in('category', filters.category);
        } else {
          query = query.eq('category', filters.category);
        }
      }

      // Marques
      if (filters.brands && filters.brands.length > 0) {
        query = query.in('brand', filters.brands);
      }

      // Prix min
      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin);
      }

      // Prix max
      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax);
      }

      // Rating minimum
      if (filters.minRating !== undefined && filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }

      // En stock
      if (filters.inStock) {
        query = query.gt('stock', 0);
      }
    }

    // Appliquer le tri
    if (sort) {
      if (sort.isNew) {
        // Pour "newest", filtrer d'abord par isNew puis trier par reviews
        query = query.eq('isNew', true);
        query = query.order('reviews', { ascending: false });
      } else {
        query = query.order(sort.field, { ascending: sort.order === 'asc' });
      }
    } else {
      // Tri par défaut : par popularité (reviews)
      query = query.order('reviews', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error('Error fetching paginated products', error, 'products');
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      products: data || [],
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    logger.error('Failed to fetch paginated products', error, 'products');
    throw error;
  }
}

/**
 * Récupère les marques disponibles (pour les filtres)
 */
export async function fetchAvailableBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .order('brand', { ascending: true });

    if (error) {
      logger.error('Error fetching brands', error, 'products');
      return [];
    }

    // Retourner les marques uniques et triées
    return [...new Set((data || []).map(p => p.brand))].sort();
  } catch (error) {
    logger.error('Failed to fetch brands', error, 'products');
    return [];
  }
}

