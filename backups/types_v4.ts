
export interface Ingredient {
  name: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CultureStory {
  id: string;
  title: string;
  country: string;
  flag: string;
  image: string;
  content: string;
  funFact: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  chefId: string;
  tags: string[]; 
  calories?: number;
  dietary?: ('Vegetarian' | 'Vegan' | 'Gluten Free' | 'Lactose Free')[];
  ingredients?: string[];
  preparation?: string;
}

export type Continent = 'Europa' | 'Asia' | 'Africa' | 'Americhe' | 'Oceania';

export interface ChefDocument {
  id: string;
  type: 'id_card' | 'haccp_certificate' | 'kitchen_hygiene' | 'other';
  title: string;
  fileName: string;
  fileData?: string; // base64 or preview url
  fileSize?: string;
  uploadedAt: string;
  isVerified?: boolean;
}

export interface ChefApplication {
  id: string;
  userId?: string;
  fullName: string;
  brandName: string;
  email: string;
  phone: string;
  nationality: string;
  countryName: string;
  continent: Continent;
  location: string;
  bio: string;
  specialties: string[];
  avatarUrl: string;
  kitchenPhotos: string[];
  documents: ChefDocument[];
  proposedDishName: string;
  proposedDishDesc: string;
  proposedDishPrice: number;
  availableDays?: number[]; // [0 = Dom, 1 = Lun, 2 = Mar, 3 = Mer, 4 = Gio, 5 = Ven, 6 = Sab]
  availabilitySlots?: string[]; // e.g. ["12:00 - 15:00", "19:00 - 22:00"]
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Chef {
  id: string;
  name: string;
  nationality: string; 
  countryName?: string;
  continent: Continent;
  bio: string;
  fullBio?: string;
  avatar: string;
  rating: number;
  location: string;
  distance: number; 
  specialties: string[];
  availability: string[]; 
  availableDays: number[]; 
  reviews: Review[];
  dishes: Dish[];
  phone?: string;
  email?: string;
  password?: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  documents?: ChefDocument[];
}

export type OrderStatus = 'PLACED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED';

export interface Message {
  id: string;
  sender: 'user' | 'chef';
  text: string;
  timestamp: Date;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
  chefId: string;
  chefName: string;
  deliveryMode: 'delivery' | 'pickup';
  estimatedTime: string;
  isReviewed?: boolean;
  messages?: Message[];
  notificationChannel?: 'app' | 'whatsapp';
}

export interface CartItem extends Dish {
  quantity: number;
  scheduledDate: string; 
  scheduledTime: string; 
  deliveryMode: 'delivery' | 'pickup';
  preferences: {
    spiceLevel: number; 
    saltLevel: 'Low' | 'Normal' | 'High';
    notes: string;
  };
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  item: string;
  time: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  HOME = 'HOME',
  CHEFS = 'CHEFS',
  CULTURE = 'CULTURE',
  EXPERIENCES = 'EXPERIENCES',
  CHEF_PROFILE = 'CHEF_PROFILE',
  AI_MENU_CREATOR = 'AI_MENU_CREATOR',
  FAVORITES = 'FAVORITES',
  ABOUT = 'ABOUT',
  SAFETY = 'SAFETY',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  HELP = 'HELP',
  BECOME_CHEF = 'BECOME_CHEF',
  ORDERS = 'ORDERS',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  MESSAGES = 'MESSAGES',
  PUBLIC_STOREFRONT = 'PUBLIC_STOREFRONT',
  HERITAGE_JOURNEY = 'HERITAGE_JOURNEY',
  HERITAGE = 'HERITAGE',
  PROFILE = 'PROFILE'
}

export interface UserAddress {
  id: string;
  street: string;
  city: string;
  zip: string;
  isVerified: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'client' | 'chef' | 'admin';
  addresses: UserAddress[];
  createdAt: string;
  password?: string;
  favoriteDishIds?: string[];
}

export interface AiMenuResponse {
  dishName: string;
  description: string;
  suggestedPrice: number;
  tags: string[];
}

export interface HeritageStoryResponse {
  story: string;
  sensoryDetails: string;
  ritual: string;
  pairing: string;
}

export interface FilterState {
  search: string;
  maxPrice: number;
  dietary: string[];
  categories: string[];
  countries: string[];
}
