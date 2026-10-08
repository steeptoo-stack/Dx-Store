export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export type PaymentStatus = 'Pending' | 'Verified' | 'Rejected';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  sku: string;
  images: string[];
  mainImage: string;
  status: 'active' | 'draft' | 'out_of_stock';
  isFeatured: boolean;
  isNewArrival: boolean;
  isVisible: boolean;
  shortDescription: string;
  description: string;
  specifications: ProductSpec[];
  features: string[];
  warranty: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isEnabled: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface Order {
  id: string; // e.g. DXS-94821
  customerName: string;
  phone: string;
  email: string;
  address: string;
  district: string; // "Dhaka" or other
  thana: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentPhoneNumber?: string;
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface StoreSettings {
  store: {
    name: string;
    tagline: string;
    logoUrl: string;
    faviconUrl: string;
    description: string;
    currency: string;
    currencySymbol: string;
    orderPrefix: string;
    timezone: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    whatsappFormatted: string;
    email: string;
    address: string;
    businessHours: string;
    supportMessage: string;
    googleMapUrl?: string;
  };
  payment: {
    codEnabled: boolean;
    codCharge: number;
    codInstructions: string;
    bkashEnabled: boolean;
    bkashNumber: string;
    bkashType: string;
    bkashInstructions: string;
    nagadEnabled: boolean;
    nagadNumber: string;
    nagadType: string;
    nagadInstructions: string;
    minOrderAmount: number;
  };
  delivery: {
    insideDhakaCharge: number;
    outsideDhakaCharge: number;
    freeDeliveryThreshold: number;
    estimatedDeliveryInside: string;
    estimatedDeliveryOutside: string;
    deliveryInstructions: string;
  };
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroBadge: string;
    heroImage: string;
    heroBtnText: string;
    heroBtnLink: string;
    bannerEnabled: boolean;
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImage: string;
    bannerBtnText: string;
    showFeatured: boolean;
    showNewArrivals: boolean;
    showCategories: boolean;
    showWhyChooseUs: boolean;
    showStats: boolean;
  };
  website: {
    siteTitle: string;
    metaDescription: string;
    keywords: string;
    announcementBarText: string;
    announcementBarEnabled: boolean;
    footerText: string;
    copyrightText: string;
  };
  social: {
    facebookUrl: string;
    facebookEnabled: boolean;
    instagramUrl: string;
    instagramEnabled: boolean;
    youtubeUrl: string;
    youtubeEnabled: boolean;
    tiktokUrl: string;
    tiktokEnabled: boolean;
    linkedinUrl: string;
    linkedinEnabled: boolean;
  };
  about: {
    title: string;
    description: string;
    companyInfo: string;
    mission: string;
    vision: string;
    whyChooseUs: string[];
  };
  policies: {
    privacyPolicy: string;
    termsAndConditions: string;
    returnAndRefundPolicy: string;
    deliveryPolicy: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
