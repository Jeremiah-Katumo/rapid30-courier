export type Role = 'customer' | 'liaison' | 'driver' | 'admin';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Commodity {
  id: string;
  name: string;
  category: 'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials';
  price: number;
  prevPrice?: number;
  rating: number;
  image: string;
  storeId: string;
  description: string;
  unit: string;
}

export interface VendorStore {
  id: string;
  name: string;
  type: 'grocery' | 'hotel';
  rating: number;
  address: string;
  location: Location;
  image: string;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  phone: string;
  vehicle: string;
  location: Location;
}

export type OrderStatus = 
  | 'pending' 
  | 'liaison_accepted' 
  | 'picking' 
  | 'dispatched' 
  | 'delivering' 
  | 'delivered' 
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryLocation: Location;
  items: {
    commodity: Commodity;
    quantity: number;
    availabilityStatus?: 'pending' | 'checking' | 'confirmed' | 'unavailable';
  }[];
  totalPrice: number;
  serviceFree: number;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: string;
  storeId: string;
  driverId?: string;
  estimatedDeliveryMinutes: number;
  paymentMethod: 'card' | 'wallet';
  paymentStatus: 'pending' | 'completed';
  driverRating?: number;
  vendorRating?: number;
  isVendorSelfDelivering?: boolean;
  vendorActionStep?: 'none' | 'at_hotel_grocer' | 'transit_to_customer' | 'completed';
}

export interface NotificationMsg {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'order_status' | 'offline_sync' | 'price_alert' | 'general';
}

export interface TranslationSet {
  welcome: string;
  tagline: string;
  deliveryTagline: string;
  onboardingTitle: string;
  onboardingDesc: string;
  roleSelect: string;
  customer: string;
  liaison: string;
  driver: string;
  searchPlaceholder: string;
  cart: string;
  checkout: string;
  ratings: string;
  realtimeGPS: string;
  offlineMode: string;
  darkMode: string;
  analytics: string;
  priceLookup: string;
  hotels: string;
  groceries: string;
  notifications: string;
  paySecurely: string;
  total: string;
  syncSuccess: string;
  online: string;
  offline: string;
  logout: string;
}

export interface AnalyticsMetrics {
  totalRevenue: number;
  completedDeliveries: number;
  averageDeliveryTime: number; // in mins
  activeDriversCount: number;
  averageRating: number;
}
