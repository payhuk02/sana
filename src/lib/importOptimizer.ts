/**
 * Utilitaires pour optimiser les imports
 * Vérifie et optimise les imports pour le tree shaking
 */

/**
 * Vérifie si un import peut être optimisé
 */
export function checkImportOptimization(importStatement: string): {
  canOptimize: boolean;
  suggestion?: string;
} {
  // Détecter les imports wildcard (*)
  if (importStatement.includes('import *')) {
    return {
      canOptimize: true,
      suggestion: 'Utiliser des imports nommés au lieu de import *',
    };
  }

  // Détecter les imports de composants entiers
  if (importStatement.includes('from "@/components/ui"')) {
    return {
      canOptimize: true,
      suggestion: 'Importer les composants individuellement',
    };
  }

  return { canOptimize: false };
}

/**
 * Optimise un import statement
 */
export function optimizeImport(importStatement: string): string {
  // Cette fonction peut être utilisée pour suggérer des optimisations
  // L'implémentation réelle dépendrait d'un parser AST
  return importStatement;
}

/**
 * Liste des imports à éviter (barrel exports non optimisés)
 */
export const BARREL_EXPORTS_TO_AVOID = [
  '@/components/ui', // Préférer importer individuellement
  '@/lib', // Préférer importer les fichiers spécifiques
];

