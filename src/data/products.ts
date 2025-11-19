import { Product, CategoryInfo } from '@/types/product';

export const categories: CategoryInfo[] = [
  {
    id: 'ordinateurs',
    name: 'Ordinateurs',
    icon: 'Laptop',
    description: 'PC portables et de bureau haute performance'
  },
  {
    id: 'telephones',
    name: 'Téléphones',
    icon: 'Smartphone',
    description: 'Smartphones dernière génération'
  },
  {
    id: 'tablettes',
    name: 'Tablettes',
    icon: 'Tablet',
    description: 'Tablettes pour tous vos besoins'
  },
  {
    id: 'televisions',
    name: 'Télévisions',
    icon: 'Tv',
    description: 'TV 4K et Smart TV'
  },
  {
    id: 'accessoires',
    name: 'Accessoires',
    icon: 'Headphones',
    description: 'Accessoires tech de qualité'
  },
  {
    id: 'consommables',
    name: 'Consommables',
    icon: 'Package',
    description: 'Cartouches, câbles et plus'
  }
];

export const products: Product[] = [
  // Ordinateurs
  {
    id: 'laptop-001',
    name: 'MacBook Pro 16" M3 Pro',
    category: 'ordinateurs',
    price: 2899,
    originalPrice: 3199,
    image: '/placeholder.svg',
    description: 'Le MacBook Pro 16 pouces avec puce M3 Pro offre des performances exceptionnelles pour les professionnels créatifs. Écran Liquid Retina XDR, jusqu\'à 36 Go de RAM unifiée et 1 To de stockage SSD.',
    specifications: {
      'Processeur': 'Apple M3 Pro 12 cœurs',
      'RAM': '36 Go unifiée',
      'Stockage': '1 To SSD',
      'Écran': '16.2" Liquid Retina XDR',
      'Graphiques': 'GPU 18 cœurs',
      'Autonomie': 'Jusqu\'à 22 heures'
    },
    brand: 'Apple',
    stock: 15,
    rating: 4.9,
    reviews: 342,
    featured: true,
    discount: 9
  },
  {
    id: 'laptop-002',
    name: 'Dell XPS 15',
    category: 'ordinateurs',
    price: 1899,
    image: '/placeholder.svg',
    description: 'PC portable premium avec écran InfinityEdge 4K OLED tactile. Intel Core i7 13ème génération, NVIDIA GeForce RTX 4060, parfait pour la création de contenu.',
    specifications: {
      'Processeur': 'Intel Core i7-13700H',
      'RAM': '32 Go DDR5',
      'Stockage': '1 To NVMe SSD',
      'Écran': '15.6" 4K OLED tactile',
      'Graphiques': 'NVIDIA RTX 4060 8 Go',
      'Poids': '1.86 kg'
    },
    brand: 'Dell',
    stock: 8,
    rating: 4.7,
    reviews: 189,
    isNew: true
  },
  {
    id: 'desktop-001',
    name: 'HP OMEN 45L Gaming Desktop',
    category: 'ordinateurs',
    price: 2499,
    image: '/placeholder.svg',
    description: 'PC gaming de bureau avec refroidissement liquide. AMD Ryzen 9, NVIDIA RTX 4080, boîtier RGB personnalisable. Prêt pour les jeux en 4K et le streaming.',
    specifications: {
      'Processeur': 'AMD Ryzen 9 7900X',
      'RAM': '64 Go DDR5',
      'Stockage': '2 To NVMe + 2 To HDD',
      'Graphiques': 'NVIDIA RTX 4080 16 Go',
      'Refroidissement': 'Liquide RGB',
      'Alimentation': '1000W 80+ Gold'
    },
    brand: 'HP',
    stock: 5,
    rating: 4.8,
    reviews: 156,
    featured: true
  },

  // Téléphones
  {
    id: 'phone-001',
    name: 'iPhone 15 Pro Max',
    category: 'telephones',
    price: 1299,
    image: '/placeholder.svg',
    description: 'iPhone 15 Pro Max avec puce A17 Pro, système photo pro 48 MP avec téléobjectif 5x, écran Super Retina XDR toujours activé et chassis en titane.',
    specifications: {
      'Processeur': 'Apple A17 Pro',
      'Écran': '6.7" Super Retina XDR',
      'Stockage': '512 Go',
      'Caméra': '48 MP + 12 MP + 12 MP',
      'Batterie': 'Jusqu\'à 29h vidéo',
      'Matériaux': 'Titane grade 5'
    },
    brand: 'Apple',
    stock: 25,
    rating: 4.9,
    reviews: 892,
    featured: true,
    isNew: true
  },
  {
    id: 'phone-002',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'telephones',
    price: 1199,
    originalPrice: 1399,
    image: '/placeholder.svg',
    description: 'Smartphone premium avec S Pen intégré, écran Dynamic AMOLED 2X 6.8", zoom optique 10x, Galaxy AI pour une expérience intelligente.',
    specifications: {
      'Processeur': 'Snapdragon 8 Gen 3',
      'Écran': '6.8" Dynamic AMOLED 2X',
      'RAM': '12 Go',
      'Stockage': '512 Go',
      'Caméra': '200 MP + 50 MP + 12 MP + 10 MP',
      'Batterie': '5000 mAh'
    },
    brand: 'Samsung',
    stock: 18,
    rating: 4.8,
    reviews: 567,
    discount: 14
  },
  {
    id: 'phone-003',
    name: 'Google Pixel 8 Pro',
    category: 'telephones',
    price: 999,
    image: '/placeholder.svg',
    description: 'Photographie IA avancée avec Magic Editor, écran Super Actua 6.7", Tensor G3 optimisé pour l\'IA, 7 ans de mises à jour garanties.',
    specifications: {
      'Processeur': 'Google Tensor G3',
      'Écran': '6.7" Super Actua LTPO',
      'RAM': '12 Go',
      'Stockage': '256 Go',
      'Caméra': '50 MP + 48 MP + 48 MP',
      'Batterie': '5050 mAh'
    },
    brand: 'Google',
    stock: 12,
    rating: 4.7,
    reviews: 234,
    isNew: true
  },

  // Tablettes
  {
    id: 'tablet-001',
    name: 'iPad Pro 12.9" M2',
    category: 'tablettes',
    price: 1399,
    image: '/placeholder.svg',
    description: 'iPad Pro avec puce M2, écran Liquid Retina XDR mini-LED, compatible Magic Keyboard et Apple Pencil 2. Parfait pour les professionnels créatifs.',
    specifications: {
      'Processeur': 'Apple M2',
      'Écran': '12.9" Liquid Retina XDR',
      'Stockage': '512 Go',
      'RAM': '16 Go',
      'Caméra': '12 MP + 10 MP ultra-large',
      'Connectivité': '5G, Wi-Fi 6E, Thunderbolt'
    },
    brand: 'Apple',
    stock: 10,
    rating: 4.9,
    reviews: 445,
    featured: true
  },
  {
    id: 'tablet-002',
    name: 'Samsung Galaxy Tab S9+',
    category: 'tablettes',
    price: 899,
    image: '/placeholder.svg',
    description: 'Tablette premium avec écran Dynamic AMOLED 2X 12.4", S Pen inclus, résistante à l\'eau IP68, performance gaming exceptionnelle.',
    specifications: {
      'Processeur': 'Snapdragon 8 Gen 2',
      'Écran': '12.4" Dynamic AMOLED 2X',
      'RAM': '12 Go',
      'Stockage': '256 Go',
      'Batterie': '10090 mAh',
      'Résistance': 'IP68'
    },
    brand: 'Samsung',
    stock: 15,
    rating: 4.6,
    reviews: 178
  },

  // Télévisions
  {
    id: 'tv-001',
    name: 'Samsung Neo QLED 65" QN95C',
    category: 'televisions',
    price: 2299,
    image: '/placeholder.svg',
    description: 'TV QLED 4K 65 pouces avec Mini LED, Quantum Matrix Technology Pro, Neural Quantum Processor 4K, Object Tracking Sound+, Gaming Hub intégré.',
    specifications: {
      'Taille': '65 pouces',
      'Résolution': '4K UHD (3840x2160)',
      'Technologie': 'Neo QLED Mini LED',
      'Processeur': 'Neural Quantum 4K',
      'HDR': 'HDR10+, HLG',
      'Fréquence': '120 Hz'
    },
    brand: 'Samsung',
    stock: 6,
    rating: 4.8,
    reviews: 289,
    featured: true
  },
  {
    id: 'tv-002',
    name: 'LG OLED evo 55" C3',
    category: 'televisions',
    price: 1599,
    originalPrice: 1999,
    image: '/placeholder.svg',
    description: 'TV OLED 4K 55 pouces avec processeur α9 Gen6 AI, Dolby Vision IQ, Dolby Atmos, HDMI 2.1 pour gaming 4K@120Hz, webOS 23.',
    specifications: {
      'Taille': '55 pouces',
      'Résolution': '4K UHD OLED',
      'Processeur': 'α9 Gen6 AI',
      'HDR': 'Dolby Vision IQ, HDR10, HLG',
      'Audio': 'Dolby Atmos',
      'Gaming': '4K@120Hz, VRR, ALLM'
    },
    brand: 'LG',
    stock: 8,
    rating: 4.9,
    reviews: 412,
    discount: 20
  },

  // Accessoires
  {
    id: 'acc-001',
    name: 'AirPods Pro 2ème génération',
    category: 'accessoires',
    price: 279,
    image: '/placeholder.svg',
    description: 'Écouteurs sans fil avec réduction active du bruit adaptative, son spatial personnalisé, autonomie jusqu\'à 30 heures avec le boîtier MagSafe.',
    specifications: {
      'Réduction de bruit': 'Active adaptative',
      'Audio spatial': 'Personnalisé avec suivi dynamique',
      'Autonomie': '6h + 24h (boîtier)',
      'Résistance': 'IPX4',
      'Connectivité': 'Bluetooth 5.3',
      'Boîtier': 'MagSafe, USB-C'
    },
    brand: 'Apple',
    stock: 40,
    rating: 4.8,
    reviews: 1203,
    isNew: true
  },
  {
    id: 'acc-002',
    name: 'Logitech MX Master 3S',
    category: 'accessoires',
    price: 119,
    image: '/placeholder.svg',
    description: 'Souris sans fil ergonomique premium pour professionnels. 8000 DPI, clics silencieux, Flow multi-appareils, jusqu\'à 70 jours d\'autonomie.',
    specifications: {
      'Capteur': '8000 DPI',
      'Connexion': 'Bluetooth, USB-C',
      'Autonomie': 'Jusqu\'à 70 jours',
      'Boutons': '7 programmables',
      'Multi-appareils': '3 appareils',
      'Compatibilité': 'Windows, Mac, Linux'
    },
    brand: 'Logitech',
    stock: 30,
    rating: 4.7,
    reviews: 567
  },
  {
    id: 'acc-003',
    name: 'Clavier Mécanique Keychron K8 Pro',
    category: 'accessoires',
    price: 159,
    image: '/placeholder.svg',
    description: 'Clavier mécanique sans fil TKL programmable via QMK/VIA. Switchs hot-swap, connexion triple mode, rétroéclairage RGB, compatible Mac et Windows.',
    specifications: {
      'Format': 'TKL (87 touches)',
      'Switchs': 'Gateron Pro (hot-swap)',
      'Connexion': 'Bluetooth 5.1, USB-C, 2.4GHz',
      'Rétroéclairage': 'RGB personnalisable',
      'Batterie': 'Jusqu\'à 240h',
      'Matériaux': 'Aluminium + ABS'
    },
    brand: 'Keychron',
    stock: 22,
    rating: 4.6,
    reviews: 189
  },

  // Consommables
  {
    id: 'cons-001',
    name: 'Pack Cartouches HP 305XL',
    category: 'consommables',
    price: 49,
    image: '/placeholder.svg',
    description: 'Pack de cartouches d\'encre originales HP 305XL haute capacité. 1 noire + 1 couleur. Compatible avec HP DeskJet, ENVY. Jusqu\'à 240 pages noir et 200 pages couleur.',
    specifications: {
      'Type': 'Cartouches jet d\'encre',
      'Capacité': 'Haute capacité XL',
      'Contenu': '1 noir + 1 couleur',
      'Rendement noir': '~240 pages',
      'Rendement couleur': '~200 pages',
      'Compatibilité': 'HP DeskJet 2700, ENVY 6000'
    },
    brand: 'HP',
    stock: 50,
    rating: 4.5,
    reviews: 342
  },
  {
    id: 'cons-002',
    name: 'Câble USB-C vers USB-C 2m 100W',
    category: 'consommables',
    price: 24,
    image: '/placeholder.svg',
    description: 'Câble USB-C premium tressé nylon. Charge rapide 100W PD, transfert de données 480 Mbps, compatible Thunderbolt 3/4. Connecteurs renforcés.',
    specifications: {
      'Longueur': '2 mètres',
      'Puissance': '100W Power Delivery',
      'Transfert': '480 Mbps (USB 2.0)',
      'Matériaux': 'Nylon tressé',
      'Connecteurs': 'Aluminium renforcé',
      'Compatibilité': 'USB-C universel'
    },
    brand: 'Anker',
    stock: 100,
    rating: 4.8,
    reviews: 1567
  },
  {
    id: 'cons-003',
    name: 'Disque Dur Externe 2To USB 3.2',
    category: 'consommables',
    price: 89,
    image: '/placeholder.svg',
    description: 'Disque dur externe portable 2To. USB 3.2 Gen 1 jusqu\'à 5 Gbps. Compatible PC, Mac, PlayStation, Xbox. Logiciel de sauvegarde automatique inclus.',
    specifications: {
      'Capacité': '2 To',
      'Interface': 'USB 3.2 Gen 1',
      'Vitesse': 'Jusqu\'à 5 Gbps',
      'Format': '2.5" portable',
      'Compatibilité': 'Windows, Mac, consoles',
      'Garantie': '3 ans'
    },
    brand: 'Seagate',
    stock: 35,
    rating: 4.6,
    reviews: 789
  }
];
