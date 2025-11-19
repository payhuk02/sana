export type Category = 'ordinateurs' | 'telephones' | 'tablettes' | 'televisions' | 'accessoires' | 'consommables';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  specifications: {
    [key: string]: string;
  };
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
}
