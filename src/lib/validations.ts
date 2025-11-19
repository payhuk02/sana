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

// Schéma de validation pour le formulaire de checkout
export const checkoutSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom ne peut contenir que des lettres'),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),
  
  email: z.string()
    .email('Email invalide')
    .max(255, 'Email trop long')
    .trim()
    .toLowerCase(),
  
  phone: z.string()
    .min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères')
    .max(20, 'Le numéro de téléphone est trop long')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Format de téléphone invalide')
    .trim(),
  
  address: z.string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .trim(),
  
  city: z.string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'La ville ne peut contenir que des lettres'),
  
  postalCode: z.string()
    .min(4, 'Le code postal doit contenir au moins 4 caractères')
    .max(10, 'Le code postal ne peut pas dépasser 10 caractères')
    .regex(/^[\d\w\s-]+$/, 'Format de code postal invalide')
    .trim(),
  
  country: z.string()
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(100, 'Le pays ne peut pas dépasser 100 caractères')
    .trim(),
  
  paymentMethod: z.enum(['card', 'bank'], {
    errorMap: () => ({ message: 'Méthode de paiement invalide' })
  }),
  
  // Champs optionnels pour carte bancaire
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
}).refine((data) => {
  // Si méthode de paiement est 'card', les champs de carte sont requis
  if (data.paymentMethod === 'card') {
    if (!data.cardNumber || !data.expiry || !data.cvv) {
      return false;
    }
    // Valider le format du numéro de carte
    const cardNumberRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
    if (!cardNumberRegex.test(data.cardNumber)) {
      return false;
    }
    // Valider le format de la date
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(data.expiry)) {
      return false;
    }
    // Valider le CVV
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(data.cvv)) {
      return false;
    }
  }
  return true;
}, {
  message: 'Tous les champs de carte bancaire sont requis et doivent être valides',
  path: ['cardNumber'],
});

// Schéma de validation pour le formulaire de contact
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),
  
  email: z.string()
    .email('Email invalide')
    .max(255, 'Email trop long')
    .trim()
    .toLowerCase(),
  
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Format de téléphone invalide')
    .max(20, 'Le numéro de téléphone est trop long')
    .optional()
    .or(z.literal('')),
  
  subject: z.string()
    .min(3, 'Le sujet doit contenir au moins 3 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères')
    .trim(),
  
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
    .trim(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
