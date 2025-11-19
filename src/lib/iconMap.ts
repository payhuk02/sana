/**
 * Mapping des icônes pour les features et valeurs
 * Permet de convertir les noms d'icônes en composants React
 */
import { 
  TruckIcon, 
  ShieldCheck, 
  HeadphonesIcon, 
  Star,
  Target,
  Users,
  Award,
  TrendingUp,
  LucideIcon
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  TruckIcon,
  ShieldCheck,
  HeadphonesIcon,
  Star,
  Target,
  Users,
  Award,
  TrendingUp,
};

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Star; // Fallback vers Star si l'icône n'existe pas
}

