export type PlatformType = 'amazon' | 'shopee' | 'tiktok' | 'aliexpress' | 'ebay' | 'temu' | 'lazada';

export interface StoreAccount {
  id: string;
  name: string;
  platform: PlatformType;
  marketplace: string; // e.g. 'US', 'DE', 'JP', 'SG'
  currency: string;
  status: 'active' | 'warning' | 'expired';
  tokenExpiresAt: string;
  orderSyncStatus: 'synced' | 'syncing' | 'error';
  lastSyncTime: string;
  activeListingCount: number;
  todayOrderCount: number;
  todayRevenue: number;
}

export type OrderStatus = 
  | 'pending_review'  // 待审核
  | 'allocated'       // 待配货
  | 'label_pending'   // 待打单
  | 'ready_to_ship'   // 待发运
  | 'shipped'         // 已发货
  | 'intercepted'     // 拦截异常
  | 'refunded';       // 售后退款

export interface OrderItem {
  sku: string;
  name: string;
  variant: string;
  image: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  weightG: number;
}

export interface BuyerInfo {
  name: string;
  phone: string;
  email: string;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
}

export interface LogisticsTracking {
  carrier: string;
  channelName: string;
  trackingNumber: string;
  shippingFee: number;
  estimatedDays: string;
  shippedAt?: string;
  milestones: {
    time: string;
    location: string;
    description: string;
    completed: boolean;
  }[];
}

export interface Order {
  id: string; // Internal Order ID
  platformOrderId: string;
  platform: PlatformType;
  storeId: string;
  storeName: string;
  buyer: BuyerInfo;
  items: OrderItem[];
  status: OrderStatus;
  currency: string;
  subtotal: number;
  shippingFeePaidByBuyer: number;
  platformCommission: number;
  actualShippingCost: number;
  totalCost: number;
  estimatedProfit: number;
  marginPercent: number;
  warehouseId: string;
  warehouseName: string;
  logistics: LogisticsTracking;
  buyerNote?: string;
  sellerNote?: string;
  createdAt: string;
  paidAt: string;
}

export interface ProductVariant {
  sku: string;
  variantName: string;
  attributes: Record<string, string>; // e.g. { Color: 'Black', Size: 'XL' }
  barcode: string;
  stockTotal: number;
  stockAvailable: number;
  stockReserved: number;
  costRmb: number;
  suggestedPriceUsd: number;
  weightG: number;
  dimensionsCm: { length: number; width: number; height: number };
}

export interface Product {
  id: string;
  spu: string;
  nameCn: string;
  nameEn: string;
  category: string;
  mainImage: string;
  gallery: string[];
  variants: ProductVariant[];
  customsDeclaration: {
    declaredCnName: string;
    declaredEnName: string;
    hsCode: string;
    declaredValueUsd: number;
  };
  supplierId: string;
  supplierName: string;
  totalSales30d: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'domestic' | 'fba' | 'third_party_overseas';
  country: string;
  location: string;
  contact: string;
  skuCapacityCount: number;
  usedCapacityPercent: number;
  status: 'normal' | 'busy' | 'maintenance';
}

export interface InventoryRecord {
  id: string;
  sku: string;
  spu: string;
  productName: string;
  variantName: string;
  image: string;
  warehouseId: string;
  warehouseName: string;
  shelfLocation: string; // e.g. "A-04-12"
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  inTransitQuantity: number; // 采购在途
  safeStockLevel: number;
  turnoverDays: number;
  status: 'sufficient' | 'low_stock' | 'out_of_stock' | 'overstock';
  costRmb: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  settlementTerms: 'cash_on_delivery' | 'net_30' | 'net_60' | 'prepaid_30';
  leadTimeDays: number;
  rating: number;
  primaryCategory: string;
  city: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  items: {
    sku: string;
    name: string;
    quantity: number;
    unitPriceRmb: number;
    totalRmb: number;
  }[];
  totalAmountRmb: number;
  status: 'draft' | 'approved' | 'in_production' | 'in_transit' | 'received';
  expectedDeliveryDate: string;
  createdAt: string;
  approvedBy?: string;
}

export interface SmartRestockSuggestion {
  sku: string;
  productName: string;
  image: string;
  warehouseName: string;
  availableStock: number;
  inTransitStock: number;
  salesVelocity7d: number; // units per day
  salesVelocity30d: number;
  daysOfSupplyRemaining: number;
  supplierLeadTimeDays: number;
  safeStockDays: number;
  suggestedQuantity: number;
  urgency: 'critical' | 'warning' | 'normal';
  estimatedCostRmb: number;
}

export interface LogisticsChannel {
  id: string;
  name: string;
  carrier: string;
  serviceType: 'express' | 'special_line' | 'fba_first_leg' | 'postal';
  targetRegions: string[];
  agingMinDays: number;
  agingMaxDays: number;
  baseWeightG: number;
  baseFeeRmb: number;
  stepWeightG: number;
  stepFeeRmb: number;
  trackingSupport: boolean;
  batterySupport: boolean;
  status: 'active' | 'suspended';
}

export interface CustomerMessage {
  id: string;
  platform: PlatformType;
  storeName: string;
  buyerName: string;
  orderId?: string;
  subject: string;
  message: string;
  translatedMessage?: string;
  targetLanguage: string;
  createdAt: string;
  status: 'unread' | 'replied' | 'flagged';
  priority: 'high' | 'medium' | 'low';
}

export interface ExchangeRate {
  currency: string;
  symbol: string;
  name: string;
  rateToRmb: number; // 1 Foreign = X RMB
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  triggerType: 'order_paid' | 'stock_low' | 'high_value';
  action: string;
  enabled: boolean;
}
