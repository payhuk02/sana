/**
 * Messages d'erreur utilisateur-friendly
 * Centralise tous les messages d'erreur pour une meilleure UX
 */

export interface ErrorMessage {
  title: string;
  message: string;
  action?: string;
}

export const errorMessages: Record<string, ErrorMessage> = {
  // Erreurs réseau
  network: {
    title: 'Problème de connexion',
    message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.',
    action: 'Réessayer',
  },
  timeout: {
    title: 'Délai d\'attente dépassé',
    message: 'La requête a pris trop de temps. Veuillez réessayer.',
    action: 'Réessayer',
  },

  // Erreurs produits
  product_not_found: {
    title: 'Produit introuvable',
    message: 'Le produit que vous recherchez n\'existe pas ou a été supprimé.',
    action: 'Retour aux catégories',
  },
  product_out_of_stock: {
    title: 'Produit en rupture de stock',
    message: 'Ce produit n\'est plus disponible pour le moment.',
    action: 'Voir d\'autres produits',
  },
  stock_insufficient: {
    title: 'Stock insuffisant',
    message: 'La quantité demandée n\'est pas disponible. Stock restant limité.',
    action: 'Ajuster la quantité',
  },

  // Erreurs panier
  cart_empty: {
    title: 'Panier vide',
    message: 'Votre panier est vide. Ajoutez des produits pour continuer.',
    action: 'Voir les produits',
  },
  cart_item_removed: {
    title: 'Article supprimé',
    message: 'Cet article n\'est plus disponible et a été retiré de votre panier.',
    action: 'Continuer',
  },

  // Erreurs commande
  order_failed: {
    title: 'Échec de la commande',
    message: 'Une erreur s\'est produite lors de la création de votre commande. Veuillez réessayer.',
    action: 'Réessayer',
  },
  payment_failed: {
    title: 'Paiement échoué',
    message: 'Le paiement n\'a pas pu être traité. Vérifiez vos informations et réessayez.',
    action: 'Réessayer',
  },

  // Erreurs authentification
  auth_required: {
    title: 'Authentification requise',
    message: 'Vous devez être connecté pour accéder à cette page.',
    action: 'Se connecter',
  },
  auth_failed: {
    title: 'Échec de la connexion',
    message: 'Les identifiants fournis sont incorrects. Veuillez réessayer.',
    action: 'Réessayer',
  },
  auth_expired: {
    title: 'Session expirée',
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
    action: 'Se reconnecter',
  },

  // Erreurs formulaire
  validation_error: {
    title: 'Erreur de validation',
    message: 'Veuillez vérifier les informations saisies et corriger les erreurs.',
    action: 'Corriger',
  },
  required_field: {
    title: 'Champ requis',
    message: 'Certains champs obligatoires sont manquants.',
    action: 'Remplir',
  },

  // Erreurs génériques
  unknown: {
    title: 'Une erreur s\'est produite',
    message: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
    action: 'Réessayer',
  },
  server_error: {
    title: 'Erreur serveur',
    message: 'Le serveur rencontre un problème. Veuillez réessayer dans quelques instants.',
    action: 'Réessayer',
  },
};

/**
 * Récupère un message d'erreur par clé
 */
export function getErrorMessage(key: string): ErrorMessage {
  return errorMessages[key] || errorMessages.unknown;
}

/**
 * Récupère un message d'erreur à partir d'une erreur
 */
export function getErrorMessageFromError(error: unknown): ErrorMessage {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Détection par message d'erreur
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return errorMessages.network;
    }
    if (errorMessage.includes('timeout')) {
      return errorMessages.timeout;
    }
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return errorMessages.product_not_found;
    }
    if (errorMessage.includes('stock') || errorMessage.includes('out of stock')) {
      return errorMessages.product_out_of_stock;
    }
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      return errorMessages.auth_failed;
    }
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return errorMessages.validation_error;
    }
    if (errorMessage.includes('500') || errorMessage.includes('server')) {
      return errorMessages.server_error;
    }
  }

  return errorMessages.unknown;
}

