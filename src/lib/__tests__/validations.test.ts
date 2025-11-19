import { describe, it, expect } from 'vitest';
import { checkoutSchema, contactSchema, productSchema, authSchema } from '../validations';

describe('Validation Schemas', () => {
  describe('checkoutSchema', () => {
    it('should validate correct checkout data', () => {
      const validData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        paymentMethod: 'card' as const,
        cardNumber: '1234 5678 9012 3456',
        expiry: '12/25',
        cvv: '123',
      };

      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'invalid-email',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        paymentMethod: 'card' as const,
      };

      const result = checkoutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should require card fields when payment method is card', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        paymentMethod: 'card' as const,
        // Missing card fields
      };

      const result = checkoutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept bank transfer without card fields', () => {
      const validData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        paymentMethod: 'bank' as const,
      };

      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validData = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        subject: 'Question produit',
        message: 'Je souhaite en savoir plus sur ce produit.',
      };

      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept optional phone', () => {
      const validData = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        subject: 'Question produit',
        message: 'Je souhaite en savoir plus sur ce produit.',
      };

      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject message too short', () => {
      const invalidData = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        subject: 'Question',
        message: 'Trop court',
      };

      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });
  });

  describe('productSchema', () => {
    it('should validate correct product data', () => {
      const validData = {
        name: 'Ordinateur Portable',
        category: 'ordinateurs',
        price: 999.99,
        stock: 10,
        brand: 'Dell',
        description: 'Un ordinateur portable performant avec écran 15 pouces.',
      };

      const result = productSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const invalidData = {
        name: 'Ordinateur Portable',
        category: 'ordinateurs',
        price: -100,
        stock: 10,
        brand: 'Dell',
        description: 'Un ordinateur portable performant.',
      };

      const result = productSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('authSchema', () => {
    it('should validate correct auth data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'Password123',
        fullName: 'Jean Dupont',
      };

      const result = authSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'weak',
      };

      const result = authSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('password'))).toBe(true);
      }
    });
  });
});

