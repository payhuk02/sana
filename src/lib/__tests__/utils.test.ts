import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'not-included');
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('not-included');
    });

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'valid');
      expect(result).toContain('base');
      expect(result).toContain('valid');
    });
  });
});

