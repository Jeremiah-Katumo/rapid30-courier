import { VendorStore, Commodity, Driver, TranslationSet } from './types';

export const MOCK_STORES: VendorStore[] = [
  {
    id: 'store-1',
    name: 'Metropolitan Harvest Grocers',
    type: 'grocery',
    rating: 4.8,
    address: '422 Broad Street, Sector 4',
    location: { lat: 37.7749, lng: -122.4194, name: 'Broad Street Hub' },
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'store-2',
    name: 'The Ritz Bistro & Hotel',
    type: 'hotel',
    rating: 4.9,
    address: '89 Elite Boulevard, Penthouse Zone',
    location: { lat: 37.7812, lng: -122.4110, name: 'Ritz Boulevard' },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'store-3',
    name: 'Green Oasis Organic Mart',
    type: 'grocery',
    rating: 4.6,
    address: '15 Leafy Lane, Greenfield',
    location: { lat: 37.7690, lng: -122.4220, name: 'Greenfield Lane' },
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'store-4',
    name: 'Savoy Grand Kitchens',
    type: 'hotel',
    rating: 4.7,
    address: '110 Royal Avenue, Downtown',
    location: { lat: 37.7780, lng: -122.4150, name: 'Downtown Savoy' },
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80'
  }
];

export const MOCK_COMMODITIES: Commodity[] = [
  {
    id: 'item-1',
    name: 'Premium Hass Avocados (Pack of 3)',
    category: 'Groceries',
    price: 4.99,
    prevPrice: 5.50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-1',
    description: 'Fresh organic Hass Avocados from local growers, perfectly ripe and buttery.',
    unit: 'pack'
  },
  {
    id: 'item-2',
    name: 'Fresh Atlantic Salmon Fillet',
    category: 'Groceries',
    price: 18.50,
    prevPrice: 19.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-1',
    description: 'Sustainably sourced wild-caught salmon fillet, rich in Omega-3.',
    unit: 'lb'
  },
  {
    id: 'item-3',
    name: 'Artisanal Sourdough Hand-Baked Loaf',
    category: 'Groceries',
    price: 5.25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-3',
    description: 'Freshly baked daily using standard wild yeast, crispy crust and chewy crumb.',
    unit: 'loaf'
  },
  {
    id: 'item-4',
    name: 'Truffle Glazed Angus Filet Mignon',
    category: 'Hotels & Restaurants',
    price: 42.00,
    prevPrice: 48.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-2',
    description: 'Premium certified Angus beef served with a velvety black truffle reductions glaze.',
    unit: 'portion'
  },
  {
    id: 'item-5',
    name: 'Gluten-Free Handcrafted Gnocchi',
    category: 'Hotels & Restaurants',
    price: 24.50,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-2',
    description: 'Delectable potato gnocchi served with fresh sage, burnt butter, and pine nuts.',
    unit: 'plate'
  },
  {
    id: 'item-6',
    name: 'Heirloom Tomato & Burrata Salad',
    category: 'Hotels & Restaurants',
    price: 16.00,
    prevPrice: 18.50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-4',
    description: 'Creamy burrata cheese with organic heirlooms, fragrant basil, and aged balsamic.',
    unit: 'serving'
  },
  {
    id: 'item-7',
    name: 'Organic Honey-Crunch Granola',
    category: 'Daily Essentials',
    price: 6.80,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517881917431-13488df97147?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-3',
    description: 'Whole oat clusters sweetened with local clover honey, roasted almonds, and walnuts.',
    unit: 'bag'
  },
  {
    id: 'item-8',
    name: 'Artisan Cold Brew Concentrate',
    category: 'Daily Essentials',
    price: 12.00,
    prevPrice: 14.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=200&q=80',
    storeId: 'store-3',
    description: 'Smooth, double-filtered 24-hour steep concentrate. Perfectly energetic.',
    unit: 'bottle'
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver-1',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    phone: '+1 (555) 438-2019',
    vehicle: 'Electric Courier Bike (Black)',
    location: { lat: 37.7730, lng: -122.4160, name: 'Mission Expressway' }
  },
  {
    id: 'driver-2',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    phone: '+1 (555) 912-3200',
    vehicle: 'Rapid Zero-emission Scooter',
    location: { lat: 37.7760, lng: -122.4200, name: 'Valencia Corner' }
  }
];

export const TRANSLATIONS: Record<string, TranslationSet> = {
  en: {
    welcome: 'Rapid30 Courier',
    tagline: 'Rapid 30-Minute Guaranteed Doorstep Deliveries',
    deliveryTagline: 'Checking store prices and routing your essential commodities with real-time GPS tracking.',
    onboardingTitle: 'Welcome to Rapid30',
    onboardingDesc: 'Get food, gourmet dinners, and fresh groceries delivered from premier local stores to your doorstep within thirty minutes. Live-track your driver real-time!',
    roleSelect: 'Switch Dashboard Role',
    customer: 'Customer Access',
    liaison: 'Store / Hotel Liaison',
    driver: 'Courier Representative',
    searchPlaceholder: 'Search groceries, bisto menus, or daily essentials...',
    cart: 'Delivery Bag',
    checkout: 'Proceed to Secure Checkout',
    ratings: 'Ratings & Reviews',
    realtimeGPS: 'Real-time GPS Tracking',
    offlineMode: 'Offline Synchronization',
    darkMode: 'Dark Theme',
    analytics: 'Performance Analytics',
    priceLookup: 'Price Check & Coordination',
    hotels: 'Hotels & Bistros',
    groceries: 'Local Groceries',
    notifications: 'Alert Center',
    paySecurely: 'Finalize Secured Payment',
    total: 'Grand Total',
    syncSuccess: 'Local adjustments synchronized with live cloud registry successfully.',
    online: 'System Online',
    offline: 'Offline Mode Active',
    logout: 'Log Out'
  },
  es: {
    welcome: 'Rapid30 Mensajería',
    tagline: 'Entregas a domicilio garantizadas en 30 minutos',
    deliveryTagline: 'Verificando precios y enrutando sus productos esenciales con rastreo GPS en tiempo real.',
    onboardingTitle: 'Bienvenido a Rapid30',
    onboardingDesc: 'Reciba alimentos, cenas gourmet y comestibles frescos de las mejores tiendas locales directamente en su puerta en menos de treinta minutos.',
    roleSelect: 'Cambiar Rol de Consola',
    customer: 'Acceso Cliente',
    liaison: 'Liaison de Tienda / Hotel',
    driver: 'Mensajero Repartidor',
    searchPlaceholder: 'Buscar comestibles, menús de bistró o esenciales...',
    cart: 'Bolsa de Entrega',
    checkout: 'Proceder al Pago Seguro',
    ratings: 'Calificaciones y Reseñas',
    realtimeGPS: 'Seguimiento GPS en Vivo',
    offlineMode: 'Sincronización Fuera de Línea',
    darkMode: 'Tema Oscuro',
    analytics: 'Analítica de Negocio',
    priceLookup: 'Verificación de Precios',
    hotels: 'Hoteles y Restaurantes',
    groceries: 'Comestibles Locales',
    notifications: 'Centro de Alertas',
    paySecurely: 'Finalizar Pago Seguro',
    total: 'Total General',
    syncSuccess: 'Ajustes locales sincronizados con el registro en la nube con éxito.',
    online: 'Sistema en Línea',
    offline: 'Modo Fuera de Línea Activo',
    logout: 'Cerrar Sesión'
  },
  sw: {
    welcome: 'Rapid30 Ujumbe',
    tagline: 'Uwasilishaji wa Dakika 30 Kwenye Mlango Wako',
    deliveryTagline: 'Kukagua bei za maduka na kupanga njia za bidhaa zako kwa ufuatiliaji wa GPS wa wakati halisi.',
    onboardingTitle: 'Karibu Rapid30',
    onboardingDesc: 'Pata vyakula, chakula cha jioni cha kifahari, na mboga mpya kutoka kwa maduka bora ya karibu huku ukifuata dereva kwa wakati halisi.',
    roleSelect: 'Badilisha Jukumu la Dashibodi',
    customer: 'Mteja Kuingia',
    liaison: 'Mratibu wa Hotelini / Madukani',
    driver: 'Dereva Msafirishaji',
    searchPlaceholder: 'Tafuta mboga, vyakula vya hoteli, au mahitaji ya kila siku...',
    cart: 'Mfuko wa Bidhaa',
    checkout: 'Nenda Kwenye Malipo Salama',
    ratings: 'Ukadiriaji na Maoni',
    realtimeGPS: 'Ufuatiliaji wa GPS wa Wakati Halisi',
    offlineMode: 'Ulandanishaji Nje ya Mtandao',
    darkMode: 'Mandhari Meusi',
    analytics: 'Uchambuzi wa Biashara',
    priceLookup: 'Kuangalia Bei na Maelekezo',
    hotels: 'Hoteli na Migahawa',
    groceries: 'Mboga na Mahitaji ya Karibu',
    notifications: 'Kituo cha Arifa',
    paySecurely: 'Kamilisha Malipo Salama',
    total: 'Jumla Kuu',
    syncSuccess: 'Marekebisho ya ndani yamesawazishwa na hifadhidata ya wingu kwa mafanikio.',
    online: 'Mfumo Uko Mtandaoni',
    offline: 'Hali ya Nje ya Mtandao Imewezeshwa',
    logout: 'Ondoka'
  }
};
