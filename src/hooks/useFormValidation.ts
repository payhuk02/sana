import { useState, useCallback, useRef } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface UseFormValidationOptions {
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  debounceMs?: number;
}

/**
 * Hook personnalisé pour validation de formulaire optimisée
 * Validation différée pour améliorer les performances
 */
export function useFormValidation<T>(
  schema: ZodSchema<T>,
  options: UseFormValidationOptions = {}
) {
  const { mode = 'onBlur', debounceMs = 300 } = options;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateField = useCallback(
    async (fieldName: string, value: unknown) => {
      if (mode === 'onSubmit') {
        return;
      }

      // Debounce la validation pour éviter trop de calculs
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          // Valider seulement le champ spécifique si possible
          const fieldSchema = (schema as any).shape?.[fieldName];
          if (fieldSchema) {
            await fieldSchema.parseAsync(value);
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          } else {
            // Fallback : validation complète mais optimisée
            const testData = { [fieldName]: value };
            await schema.partial().parseAsync(testData);
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }
        } catch (error) {
          if (error instanceof ZodError) {
            const fieldError = error.errors.find((e) => e.path[0] === fieldName);
            if (fieldError) {
              setErrors((prev) => ({
                ...prev,
                [fieldName]: fieldError.message,
              }));
            }
          }
        }
      }, debounceMs);
    },
    [schema, mode, debounceMs]
  );

  const validateForm = useCallback(
    async (data: Partial<T>): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
      try {
        await schema.parseAsync(data);
        setErrors({});
        return { isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof ZodError) {
          const formErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const fieldName = err.path[0] as string;
            if (fieldName) {
              formErrors[fieldName] = err.message;
            }
          });
          setErrors(formErrors);
          return { isValid: false, errors: formErrors };
        }
        return { isValid: false, errors: {} };
      }
    },
    [schema]
  );

  const handleBlur = useCallback(
    (fieldName: string, value: unknown) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      if (mode === 'onBlur' || mode === 'onChange') {
        validateField(fieldName, value);
      }
    },
    [mode, validateField]
  );

  const handleChange = useCallback(
    (fieldName: string, value: unknown) => {
      if (mode === 'onChange' && touched[fieldName]) {
        validateField(fieldName, value);
      }
    },
    [mode, touched, validateField]
  );

  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    reset,
  };
}

