export interface User {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  roleId?: string;
  roleName: string;
  roleCode: string;
}

export interface DashboardMetrics {
  totalProduction: number;
  todayProduction: number;
  monthlyProduction: number;
  totalWastageKg: number;
  activeBatches: number;
  totalAssets: number;
  operationalAssets: number;
  totalVendors: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  salesRevenue: number;
  pendingSalesOrders: number;
  pendingPurchaseOrders: number;
  recentBatches: Array<{
    batchId: string;
    batchCode: string;
    productName: string;
    machineName: string;
    producedQuantity: number;
    batchStatus: string;
    createdAt: string;
  }>;
  recentSalesOrders: Array<{
    soId: string;
    soNumber: string;
    customerName: string;
    totalAmount: number;
    orderStatus: string;
    orderDate: string;
  }>;
  productionTrend: Array<{
    day: string;
    date: string;
    produced: number;
    wastage: number;
  }>;
}

export interface Asset {
  assetId: string;
  assetCode: string;
  assetName: string;
  category: string;
  modelNumber?: string;
  serialNumber?: string;
  vendorId?: string;
  vendorName?: string;
  purchaseDate?: string;
  purchaseCost: number;
  currentValue: number;
  quantity: number;
  locationArea: string;
  conditionStatus: 'OPERATIONAL' | 'MAINTENANCE' | 'IDLE' | 'SCRAPPED';
  warrantyExpiry?: string;
  notes?: string;
  createdAt: string;
}

export interface Vendor {
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  taxNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  vendorStatus: 'ACTIVE' | 'INACTIVE';
  creditPeriodDays: number;
  outstandingBalance: number;
  rating?: number;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  customerId: string;
  customerCode: string;
  customerName: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  taxNumber: string;
  billingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  customerStatus: 'ACTIVE' | 'INACTIVE';
  creditLimit: number;
  outstandingBalance: number;
  notes?: string;
  createdAt: string;
}

export interface Product {
  productId: string;
  productCode: string;
  productName: string;
  productType: 'RAW_MATERIAL' | 'FINISHED_GOOD' | 'PACKING_MATERIAL' | 'SEMI_FINISHED';
  category: string;
  gsm: number;
  ply: number;
  sheetWidthMm?: number;
  rollLengthM?: number;
  rollsPerPack?: number;
  uom: string;
  unitCost: number;
  sellingPrice: number;
  taxRate: number;
  reorderLevel: number;
  description?: string;
  currentStock?: number;
  availableStock?: number;
}

export interface InventoryItem {
  inventoryId: string;
  productId: string;
  productCode: string;
  productName: string;
  productType: string;
  warehouseLocation: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  uom: string;
  minimumStockLevel: number;
  maximumStockLevel: number;
  isLowStock: boolean;
  lastRestockedAt: string;
}

export interface ProductionPlan {
  planId: string;
  planCode: string;
  planName: string;
  startDate: string;
  endDate: string;
  targetQuantity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface ProductionBatch {
  batchId: string;
  batchCode: string;
  planId?: string;
  productId: string;
  productName: string;
  machineAssetId?: string;
  machineName?: string;
  plannedQuantity: number;
  producedQuantity: number;
  rejectedQuantity: number;
  wastageKg: number;
  batchStatus: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'HALTED';
  supervisorName?: string;
  shift: string;
  remarks?: string;
  startTime?: string;
  endTime?: string;
}

export type Batch = ProductionBatch;

export interface PurchaseOrder {
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  orderStatus: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  notes?: string;
}

export interface SalesOrder {
  soId: string;
  soNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  orderStatus: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress?: string;
}

export interface SystemSetting {
  settingId: string;
  settingKey: string;
  settingValue: string;
  category: string;
  description: string;
  updatedAt: string;
}

export interface ActivityLog {
  activityId: string;
  userId?: string;
  username: string;
  activityType: string;
  module: string;
  description: string;
  recordId?: string;
  ipAddress: string;
  createdAt: string;
}
