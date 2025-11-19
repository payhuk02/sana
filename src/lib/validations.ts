import { z } from 'zod';

export const productSchema = z.object({
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .trim(),
  
  category: z.string()
    .refine((val) => ['ordinateurs', 'telephones', 'tablettes', 'televisions', 'accessoires', 'consommables'].includes(val), {
      message: 'Catégorie invalide'
    }),
  
  price: z.number()
    .positive('Le prix doit être supérieur à 0')
    .max(99999999, 'Le prix est trop élevé'),
  
  originalPrice: z.number()
    .positive('Le prix original doit être supérieur à 0')
    .max(99999999, 'Le prix original est trop élevé')
    .optional()
    .nullable(),
  
  stock: z.number()
    .int('Le stock doit être un nombre entier')
    .min(0, 'Le stock ne peut pas être négatif')
    .max(999999, 'Le stock est trop élevé'),
  
  brand: z.string()
    .min(2, 'La marque doit contenir au moins 2 caractères')
    .max(100, 'La marque ne peut pas dépasser 100 caractères')
    .trim(),
  
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .trim(),
  
  imageUrl: z.string()
    .url('URL d\'image invalide')
    .optional()
    .or(z.literal('')),
});

export const authSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .max(255, 'Email trop long')
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(72, 'Le mot de passe ne peut pas dépasser 72 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  
  fullName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim()
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
