import {
  StoreAccount,
  Order,
  Product,
  Warehouse,
  InventoryRecord,
  Supplier,
  PurchaseOrder,
  SmartRestockSuggestion,
  LogisticsChannel,
  CustomerMessage,
  ExchangeRate,
  AutomationRule
} from '../types/erp';

export const INITIAL_STORES: StoreAccount[] = [
  {
    id: 'store-amz-us-01',
    name: 'AuraNova Direct (Amazon US)',
    platform: 'amazon',
    marketplace: 'US',
    currency: 'USD',
    status: 'active',
    tokenExpiresAt: '2026-12-31',
    orderSyncStatus: 'synced',
    lastSyncTime: '3分钟前',
    activeListingCount: 148,
    todayOrderCount: 42,
    todayRevenue: 2840.50
  },
  {
    id: 'store-amz-de-02',
    name: 'AuraNova Europe (Amazon DE)',
    platform: 'amazon',
    marketplace: 'DE',
    currency: 'EUR',
    status: 'active',
    tokenExpiresAt: '2026-11-20',
    orderSyncStatus: 'synced',
    lastSyncTime: '8分钟前',
    activeListingCount: 92,
    todayOrderCount: 23,
    todayRevenue: 1650.00
  },
  {
    id: 'store-tiktok-us-03',
    name: 'AuraVibe Official (TikTok Shop US)',
    platform: 'tiktok',
    marketplace: 'US',
    currency: 'USD',
    status: 'active',
    tokenExpiresAt: '2026-10-15',
    orderSyncStatus: 'synced',
    lastSyncTime: '1分钟前',
    activeListingCount: 35,
    todayOrderCount: 86,
    todayRevenue: 3420.00
  },
  {
    id: 'store-shopee-sg-04',
    name: 'NovaLife Tech (Shopee SG)',
    platform: 'shopee',
    marketplace: 'SG',
    currency: 'SGD',
    status: 'active',
    tokenExpiresAt: '2026-08-30',
    orderSyncStatus: 'synced',
    lastSyncTime: '12分钟前',
    activeListingCount: 110,
    todayOrderCount: 19,
    todayRevenue: 980.00
  },
  {
    id: 'store-aliexpress-05',
    name: 'Global Trendsetter (AliExpress)',
    platform: 'aliexpress',
    marketplace: 'GLOBAL',
    currency: 'USD',
    status: 'warning',
    tokenExpiresAt: '2026-05-10',
    orderSyncStatus: 'synced',
    lastSyncTime: '25分钟前',
    activeListingCount: 215,
    todayOrderCount: 14,
    todayRevenue: 620.00
  },
  {
    id: 'store-ebay-06',
    name: 'PrimeCollect Express (eBay US)',
    platform: 'ebay',
    marketplace: 'US',
    currency: 'USD',
    status: 'active',
    tokenExpiresAt: '2026-09-01',
    orderSyncStatus: 'synced',
    lastSyncTime: '15分钟前',
    activeListingCount: 68,
    todayOrderCount: 9,
    todayRevenue: 530.00
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    spu: 'SPU-ANC-HEADSET',
    nameCn: '主动降噪无线头戴式蓝牙耳机 Pro',
    nameEn: 'Active Noise Cancelling Wireless Over-Ear Headphones Pro',
    category: '3C数码 / 音频配件',
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=80'
    ],
    customsDeclaration: {
      declaredCnName: '无线蓝牙降噪耳机',
      declaredEnName: 'Wireless Bluetooth Headphone',
      hsCode: '8518300000',
      declaredValueUsd: 18.50
    },
    supplierId: 'sup-001',
    supplierName: '深圳市宏达声学电子有限公司',
    totalSales30d: 1420,
    status: 'active',
    createdAt: '2026-01-15',
    variants: [
      {
        sku: 'ANC-HD-BLK',
        variantName: '曜石黑 / 标准版',
        attributes: { Color: 'Matte Black', Edition: 'Standard' },
        barcode: '840192837411',
        stockTotal: 480,
        stockAvailable: 412,
        stockReserved: 68,
        costRmb: 135.00,
        suggestedPriceUsd: 59.99,
        weightG: 340,
        dimensionsCm: { length: 20, width: 18, height: 7 }
      },
      {
        sku: 'ANC-HD-WHT',
        variantName: '珍珠白 / 标准版',
        attributes: { Color: 'Pearl White', Edition: 'Standard' },
        barcode: '840192837428',
        stockTotal: 180,
        stockAvailable: 35,
        stockReserved: 145,
        costRmb: 135.00,
        suggestedPriceUsd: 59.99,
        weightG: 340,
        dimensionsCm: { length: 20, width: 18, height: 7 }
      },
      {
        sku: 'ANC-HD-SLV',
        variantName: '深空银 / 便携收纳盒高配版',
        attributes: { Color: 'Space Silver', Edition: 'Deluxe Case' },
        barcode: '840192837435',
        stockTotal: 260,
        stockAvailable: 230,
        stockReserved: 30,
        costRmb: 155.00,
        suggestedPriceUsd: 69.99,
        weightG: 420,
        dimensionsCm: { length: 22, width: 19, height: 8 }
      }
    ]
  },
  {
    id: 'prod-002',
    spu: 'SPU-SMART-BOTTLE',
    nameCn: '智能数显保温保冷吸管杯 32oz',
    nameEn: 'Smart Temperature Display Vacuum Insulated Water Bottle 32oz',
    category: '家居日用 / 户外水杯',
    mainImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80'
    ],
    customsDeclaration: {
      declaredCnName: '不锈钢真空保温水杯',
      declaredEnName: 'Stainless Steel Insulated Bottle',
      hsCode: '9617009000',
      declaredValueUsd: 9.80
    },
    supplierId: 'sup-002',
    supplierName: '浙江永康精工杯业制造厂',
    totalSales30d: 2890,
    status: 'active',
    createdAt: '2026-02-01',
    variants: [
      {
        sku: 'SMB-32-BLU',
        variantName: '渐变星云蓝 / 32oz',
        attributes: { Color: 'Nebula Blue', Capacity: '32oz' },
        barcode: '840192839910',
        stockTotal: 650,
        stockAvailable: 590,
        stockReserved: 60,
        costRmb: 38.00,
        suggestedPriceUsd: 28.99,
        weightG: 460,
        dimensionsCm: { length: 28, width: 9, height: 9 }
      },
      {
        sku: 'SMB-32-PNK',
        variantName: '落樱粉红 / 32oz',
        attributes: { Color: 'Sakura Pink', Capacity: '32oz' },
        barcode: '840192839927',
        stockTotal: 410,
        stockAvailable: 120,
        stockReserved: 290,
        costRmb: 38.00,
        suggestedPriceUsd: 28.99,
        weightG: 460,
        dimensionsCm: { length: 28, width: 9, height: 9 }
      },
      {
        sku: 'SMB-32-MBLK',
        variantName: '磨砂碳黑 / 32oz',
        attributes: { Color: 'Matte Charcoal', Capacity: '32oz' },
        barcode: '840192839934',
        stockTotal: 820,
        stockAvailable: 780,
        stockReserved: 40,
        costRmb: 38.00,
        suggestedPriceUsd: 28.99,
        weightG: 460,
        dimensionsCm: { length: 28, width: 9, height: 9 }
      }
    ]
  },
  {
    id: 'prod-003',
    spu: 'SPU-RGB-MECH-KB',
    nameCn: '三模热插拔无线机械键盘 75%配列',
    nameEn: 'Tri-Mode Hot-Swappable 75% Mechanical Keyboard RGB',
    category: '电脑外设 / 键盘',
    mainImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80'
    ],
    customsDeclaration: {
      declaredCnName: '电脑外设机械键盘',
      declaredEnName: 'Mechanical Computer Keyboard',
      hsCode: '8471607100',
      declaredValueUsd: 24.00
    },
    supplierId: 'sup-003',
    supplierName: '东莞市极客外设科技有限公司',
    totalSales30d: 940,
    status: 'active',
    createdAt: '2026-02-18',
    variants: [
      {
        sku: 'KB75-RED-GRY',
        variantName: '复古灰白 / 线性红轴',
        attributes: { Color: 'Retro Gray', Switch: 'Red Linear' },
        barcode: '840192841104',
        stockTotal: 310,
        stockAvailable: 290,
        stockReserved: 20,
        costRmb: 185.00,
        suggestedPriceUsd: 79.99,
        weightG: 920,
        dimensionsCm: { length: 34, width: 16, height: 5 }
      },
      {
        sku: 'KB75-BRN-BLK',
        variantName: '暗夜黑 / 微段落茶轴',
        attributes: { Color: 'Midnight Black', Switch: 'Brown Tactile' },
        barcode: '840192841111',
        stockTotal: 190,
        stockAvailable: 28,
        stockReserved: 162,
        costRmb: 185.00,
        suggestedPriceUsd: 79.99,
        weightG: 920,
        dimensionsCm: { length: 34, width: 16, height: 5 }
      }
    ]
  },
  {
    id: 'prod-004',
    spu: 'SPU-YOGA-MAT',
    nameCn: '加厚防滑环保天然橡胶TPE瑜伽垫',
    nameEn: 'Extra Thick Eco-Friendly Non-Slip TPE Yoga Mat with Alignment Lines',
    category: '运动户外 / 健身瑜伽',
    mainImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=80'
    ],
    customsDeclaration: {
      declaredCnName: '环保TPE健身垫',
      declaredEnName: 'TPE Fitness Exercise Mat',
      hsCode: '9506911900',
      declaredValueUsd: 8.00
    },
    supplierId: 'sup-002',
    supplierName: '浙江永康精工杯业制造厂',
    totalSales30d: 3100,
    status: 'active',
    createdAt: '2026-03-01',
    variants: [
      {
        sku: 'YOGA-MAT-PUR',
        variantName: '薰衣草紫 / 6mm加厚体位线款',
        attributes: { Color: 'Lavender Purple', Thickness: '6mm' },
        barcode: '840192845508',
        stockTotal: 720,
        stockAvailable: 680,
        stockReserved: 40,
        costRmb: 28.00,
        suggestedPriceUsd: 24.99,
        weightG: 850,
        dimensionsCm: { length: 65, width: 12, height: 12 }
      },
      {
        sku: 'YOGA-MAT-GRN',
        variantName: '薄荷绿 / 6mm加厚体位线款',
        attributes: { Color: 'Mint Green', Thickness: '6mm' },
        barcode: '840192845515',
        stockTotal: 540,
        stockAvailable: 510,
        stockReserved: 30,
        costRmb: 28.00,
        suggestedPriceUsd: 24.99,
        weightG: 850,
        dimensionsCm: { length: 65, width: 12, height: 12 }
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-20260919-001',
    platformOrderId: '114-8930219-4820194',
    platform: 'amazon',
    storeId: 'store-amz-us-01',
    storeName: 'AuraNova Direct (Amazon US)',
    status: 'pending_review',
    currency: 'USD',
    subtotal: 119.98,
    shippingFeePaidByBuyer: 0,
    platformCommission: 17.99,
    actualShippingCost: 14.20,
    totalCost: 52.40,
    estimatedProfit: 35.39,
    marginPercent: 29.5,
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗国内自营主仓',
    createdAt: '2026-09-19 15:20:12',
    paidAt: '2026-09-19 15:20:12',
    buyer: {
      name: 'Jessica M. Taylor',
      phone: '+1 (555) 234-8901',
      email: 'jess.taylor@gmail.com',
      country: 'United States',
      countryCode: 'US',
      state: 'CA',
      city: 'San Francisco',
      street: '450 Mission St, Apt 18B',
      zipCode: '94105'
    },
    items: [
      {
        sku: 'ANC-HD-BLK',
        name: '主动降噪无线头戴式蓝牙耳机 Pro - 曜石黑',
        variant: '曜石黑 / 标准版',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
        quantity: 2,
        unitPrice: 59.99,
        costPrice: 19.00,
        weightG: 340
      }
    ],
    logistics: {
      carrier: 'YunExpress 云途专线',
      channelName: '云途特惠普货专线 (YUN-US-ECO)',
      trackingNumber: 'YT260919882901US',
      shippingFee: 14.20,
      estimatedDays: '6-9 工作日',
      milestones: [
        { time: '2026-09-19 15:20', location: '跨境ERP系统', description: '订单支付成功，待商家审核', completed: true },
        { time: '待处理', location: '深圳仓', description: '等待配货与面单打印', completed: false },
        { time: '待处理', location: '香港国际货运机场', description: '国际干线交接', completed: false },
        { time: '待处理', location: '美国洛杉矶LAX', description: '海关清关与USPS派送', completed: false }
      ]
    },
    buyerNote: 'Please do not drop at doorstep if raining. Leave in secure porch box.'
  },
  {
    id: 'ORD-20260919-002',
    platformOrderId: 'TT-US-994820128',
    platform: 'tiktok',
    storeId: 'store-tiktok-us-03',
    storeName: 'AuraVibe Official (TikTok Shop US)',
    status: 'allocated',
    currency: 'USD',
    subtotal: 28.99,
    shippingFeePaidByBuyer: 3.99,
    platformCommission: 2.30,
    actualShippingCost: 5.60,
    totalCost: 11.20,
    estimatedProfit: 13.88,
    marginPercent: 42.1,
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗国内自营主仓',
    createdAt: '2026-09-19 14:05:43',
    paidAt: '2026-09-19 14:05:43',
    buyer: {
      name: 'Brian Christopher',
      phone: '+1 (555) 789-3321',
      email: 'brian.c@outlook.com',
      country: 'United States',
      countryCode: 'US',
      state: 'TX',
      city: 'Austin',
      street: '1204 South Congress Ave',
      zipCode: '78704'
    },
    items: [
      {
        sku: 'SMB-32-BLU',
        name: '智能数显保温保冷吸管杯 32oz - 渐变星云蓝',
        variant: '渐变星云蓝 / 32oz',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 28.99,
        costPrice: 5.35,
        weightG: 460
      }
    ],
    logistics: {
      carrier: '4PX 递四方',
      channelName: '4PX联邮通优先专线',
      trackingNumber: '4PX3928109482110',
      shippingFee: 5.60,
      estimatedDays: '5-7 工作日',
      milestones: [
        { time: '2026-09-19 14:05', location: 'ERP系统', description: '订单已分配库存，锁定深圳仓 A-02-04 库位', completed: true },
        { time: '待处理', location: '深圳仓配货区', description: '生成拣货波次单中', completed: false }
      ]
    }
  },
  {
    id: 'ORD-20260919-003',
    platformOrderId: 'DE-8392019482',
    platform: 'amazon',
    storeId: 'store-amz-de-02',
    storeName: 'AuraNova Europe (Amazon DE)',
    status: 'label_pending',
    currency: 'EUR',
    subtotal: 79.99,
    shippingFeePaidByBuyer: 0,
    platformCommission: 12.00,
    actualShippingCost: 11.50,
    totalCost: 38.50,
    estimatedProfit: 17.99,
    marginPercent: 22.5,
    warehouseId: 'wh-fba-de',
    warehouseName: '欧洲德国FBA保税仓 (DTM2)',
    createdAt: '2026-09-19 11:32:00',
    paidAt: '2026-09-19 11:32:00',
    buyer: {
      name: 'Maximilian Weber',
      phone: '+49 170 9823412',
      email: 'max.weber@web.de',
      country: 'Germany',
      countryCode: 'DE',
      state: 'NRW',
      city: 'Cologne',
      street: 'Aachener Str. 1042',
      zipCode: '50858'
    },
    items: [
      {
        sku: 'KB75-RED-GRY',
        name: '三模热插拔无线机械键盘 75%配列 - 线性红轴',
        variant: '复古灰白 / 线性红轴',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 79.99,
        costPrice: 26.00,
        weightG: 920
      }
    ],
    logistics: {
      carrier: 'DHL Paket Europe',
      channelName: 'DHL 德国本土次日达',
      trackingNumber: 'DHL9482019482DE',
      shippingFee: 11.50,
      estimatedDays: '1-2 工作日',
      milestones: [
        { time: '2026-09-19 11:32', location: 'FBA DTM2', description: '订单已通过FBA多渠道履行审核', completed: true },
        { time: '2026-09-19 12:45', location: 'DTM2 自动贴标线', description: '面单已生成，等待传送带贴标', completed: true }
      ]
    }
  },
  {
    id: 'ORD-20260919-004',
    platformOrderId: 'SP-SG-26091929310',
    platform: 'shopee',
    storeId: 'store-shopee-sg-04',
    storeName: 'NovaLife Tech (Shopee SG)',
    status: 'ready_to_ship',
    currency: 'SGD',
    subtotal: 57.98,
    shippingFeePaidByBuyer: 1.99,
    platformCommission: 4.60,
    actualShippingCost: 6.20,
    totalCost: 18.00,
    estimatedProfit: 31.17,
    marginPercent: 52.0,
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗国内自营主仓',
    createdAt: '2026-09-19 09:15:22',
    paidAt: '2026-09-19 09:15:22',
    buyer: {
      name: 'Tan Wei Ling',
      phone: '+65 9123 4567',
      email: 'weiling.tan@singnet.com.sg',
      country: 'Singapore',
      countryCode: 'SG',
      state: 'Singapore',
      city: 'Singapore',
      street: 'Blk 234 Bishan St 22 #08-112',
      zipCode: '570234'
    },
    items: [
      {
        sku: 'SMB-32-PNK',
        name: '智能数显保温保冷吸管杯 32oz - 落樱粉红',
        variant: '落樱粉红 / 32oz',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
        quantity: 2,
        unitPrice: 28.99,
        costPrice: 5.35,
        weightG: 460
      }
    ],
    logistics: {
      carrier: 'Shopee SLS 官方物流',
      channelName: 'SLS Standard Express 新加坡特快',
      trackingNumber: 'SGSLS26091900384',
      shippingFee: 6.20,
      estimatedDays: '3-5 工作日',
      milestones: [
        { time: '2026-09-19 09:15', location: 'ERP系统', description: '订单已完成拣货打包，贴标完毕', completed: true },
        { time: '2026-09-19 16:30', location: '深圳仓暂存集货区', description: '等待Shopee SLS官方揽收车交接', completed: true }
      ]
    }
  },
  {
    id: 'ORD-20260918-005',
    platformOrderId: '112-9481029-3810294',
    platform: 'amazon',
    storeId: 'store-amz-us-01',
    storeName: 'AuraNova Direct (Amazon US)',
    status: 'shipped',
    currency: 'USD',
    subtotal: 69.99,
    shippingFeePaidByBuyer: 0,
    platformCommission: 10.50,
    actualShippingCost: 16.80,
    totalCost: 22.00,
    estimatedProfit: 20.69,
    marginPercent: 29.6,
    warehouseId: 'wh-fba-us',
    warehouseName: '美国加州FBA官方仓 (ONT8)',
    createdAt: '2026-09-18 10:14:00',
    paidAt: '2026-09-18 10:14:00',
    buyer: {
      name: 'David Reynolds',
      phone: '+1 (555) 902-1847',
      email: 'd.reynolds@nyu.edu',
      country: 'United States',
      countryCode: 'US',
      state: 'NY',
      city: 'New York',
      street: '725 5th Ave, Floor 14',
      zipCode: '10022'
    },
    items: [
      {
        sku: 'ANC-HD-SLV',
        name: '主动降噪无线头戴式蓝牙耳机 Pro - 深空银豪华版',
        variant: '深空银 / 便携收纳盒高配版',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 69.99,
        costPrice: 22.00,
        weightG: 420
      }
    ],
    logistics: {
      carrier: 'UPS Ground',
      channelName: 'UPS Standard US Domestic',
      trackingNumber: '1Z9999999999999999',
      shippingFee: 16.80,
      estimatedDays: '2 工作日',
      shippedAt: '2026-09-18 14:20',
      milestones: [
        { time: '2026-09-18 10:14', location: 'FBA ONT8', description: '订单已接收并安排出库', completed: true },
        { time: '2026-09-18 14:20', location: 'FBA ONT8', description: 'UPS揽收已扫描，正在运往转运枢纽', completed: true },
        { time: '2026-09-19 06:15', location: 'Louisville, KY', description: '抵达UPS全国转运中心，进行中转分拣', completed: true },
        { time: '预计 2026-09-20', location: 'New York, NY', description: '安排末端派送', completed: false }
      ]
    }
  },
  {
    id: 'ORD-20260918-006',
    platformOrderId: 'AE-3004819201948',
    platform: 'aliexpress',
    storeId: 'store-aliexpress-05',
    storeName: 'Global Trendsetter (AliExpress)',
    status: 'intercepted',
    currency: 'USD',
    subtotal: 59.99,
    shippingFeePaidByBuyer: 0,
    platformCommission: 4.80,
    actualShippingCost: 12.00,
    totalCost: 19.00,
    estimatedProfit: 24.19,
    marginPercent: 40.3,
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗国内自营主仓',
    createdAt: '2026-09-18 18:22:15',
    paidAt: '2026-09-18 18:22:15',
    buyer: {
      name: 'Carlos Fernandez',
      phone: '+34 612 345 678',
      email: 'carlos.f@terra.es',
      country: 'Spain',
      countryCode: 'ES',
      state: 'Madrid',
      city: 'Madrid',
      street: 'Calle Mayor 45, 3B',
      zipCode: '28013'
    },
    items: [
      {
        sku: 'ANC-HD-BLK',
        name: '主动降噪无线头戴式蓝牙耳机 Pro - 曜石黑',
        variant: '曜石黑 / 标准版',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 59.99,
        costPrice: 19.00,
        weightG: 340
      }
    ],
    logistics: {
      carrier: '燕文专线挂号',
      channelName: '燕文西班牙特惠专线',
      trackingNumber: 'YW26091829013ES',
      shippingFee: 12.00,
      estimatedDays: '8-12 工作日',
      milestones: [
        { time: '2026-09-18 18:22', location: 'ERP系统', description: '订单已拦截：买家发起修改收件人电话申请', completed: true }
      ]
    },
    buyerNote: 'URGENT: I entered wrong phone number! Please update to +34 699 888 111 before shipping!',
    sellerNote: '已拦截出库流转，待运营确认更新地址后再行打单发货。'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-sz-01',
    name: '深圳龙岗自营主仓',
    type: 'domestic',
    country: '中国',
    location: '广东省深圳市龙岗区坂田街道天安云谷5栋B座',
    contact: '王仓管 (+86 138-0013-8000)',
    skuCapacityCount: 15000,
    usedCapacityPercent: 68,
    status: 'normal'
  },
  {
    id: 'wh-yw-02',
    name: '义乌小商品转运集货仓',
    type: 'domestic',
    country: '中国',
    location: '浙江省金华市义乌市国际商贸城跨境产业园3号库',
    contact: '陈主管 (+86 139-5790-2211)',
    skuCapacityCount: 22000,
    usedCapacityPercent: 82,
    status: 'busy'
  },
  {
    id: 'wh-fba-us',
    name: '美国加州FBA官方仓 (ONT8)',
    type: 'fba',
    country: '美国',
    location: '24300 Nandina Ave, Moreno Valley, CA 92551',
    contact: 'Amazon FBA Operations Team',
    skuCapacityCount: 80000,
    usedCapacityPercent: 74,
    status: 'normal'
  },
  {
    id: 'wh-fba-de',
    name: '欧洲德国FBA保税仓 (DTM2)',
    type: 'fba',
    country: '德国',
    location: 'Kaltbandstraße 4, 44145 Dortmund, Germany',
    contact: 'Amazon Europe Logistics Support',
    skuCapacityCount: 45000,
    usedCapacityPercent: 61,
    status: 'normal'
  },
  {
    id: 'wh-3pl-us-east',
    name: '美东新泽西海外第三方仓 (3PL)',
    type: 'third_party_overseas',
    country: '美国',
    location: '1000 Logistics Way, Cranbury, NJ 08512',
    contact: 'Mark Davis (+1 609-409-2900)',
    skuCapacityCount: 30000,
    usedCapacityPercent: 49,
    status: 'normal'
  }
];

export const INITIAL_INVENTORY: InventoryRecord[] = [
  {
    id: 'inv-001',
    sku: 'ANC-HD-BLK',
    spu: 'SPU-ANC-HEADSET',
    productName: '主动降噪无线头戴式蓝牙耳机 Pro',
    variantName: '曜石黑 / 标准版',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗自营主仓',
    shelfLocation: 'A-02-14',
    onHandQuantity: 320,
    reservedQuantity: 45,
    availableQuantity: 275,
    inTransitQuantity: 300,
    safeStockLevel: 100,
    turnoverDays: 16,
    status: 'sufficient',
    costRmb: 135.00
  },
  {
    id: 'inv-002',
    sku: 'ANC-HD-WHT',
    spu: 'SPU-ANC-HEADSET',
    productName: '主动降噪无线头戴式蓝牙耳机 Pro',
    variantName: '珍珠白 / 标准版',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗自营主仓',
    shelfLocation: 'A-02-15',
    onHandQuantity: 48,
    reservedQuantity: 28,
    availableQuantity: 20,
    inTransitQuantity: 0,
    safeStockLevel: 80,
    turnoverDays: 5,
    status: 'low_stock',
    costRmb: 135.00
  },
  {
    id: 'inv-003',
    sku: 'ANC-HD-BLK',
    spu: 'SPU-ANC-HEADSET',
    productName: '主动降噪无线头戴式蓝牙耳机 Pro',
    variantName: '曜石黑 / 标准版',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    warehouseId: 'wh-fba-us',
    warehouseName: '美国加州FBA官方仓 (ONT8)',
    shelfLocation: 'FBA-BAY-90',
    onHandQuantity: 160,
    reservedQuantity: 23,
    availableQuantity: 137,
    inTransitQuantity: 200,
    safeStockLevel: 50,
    turnoverDays: 12,
    status: 'sufficient',
    costRmb: 135.00
  },
  {
    id: 'inv-004',
    sku: 'SMB-32-BLU',
    spu: 'SPU-SMART-BOTTLE',
    productName: '智能数显保温保冷吸管杯 32oz',
    variantName: '渐变星云蓝 / 32oz',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗自营主仓',
    shelfLocation: 'B-04-02',
    onHandQuantity: 650,
    reservedQuantity: 60,
    availableQuantity: 590,
    inTransitQuantity: 500,
    safeStockLevel: 200,
    turnoverDays: 22,
    status: 'sufficient',
    costRmb: 38.00
  },
  {
    id: 'inv-005',
    sku: 'KB75-BRN-BLK',
    spu: 'SPU-RGB-MECH-KB',
    productName: '三模热插拔无线机械键盘 75%配列',
    variantName: '暗夜黑 / 微段落茶轴',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    warehouseId: 'wh-sz-01',
    warehouseName: '深圳龙岗自营主仓',
    shelfLocation: 'C-01-08',
    onHandQuantity: 12,
    reservedQuantity: 10,
    availableQuantity: 2,
    inTransitQuantity: 150,
    safeStockLevel: 60,
    turnoverDays: 3,
    status: 'out_of_stock',
    costRmb: 185.00
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    name: '深圳市宏达声学电子有限公司',
    contactPerson: '李经理',
    phone: '+86 138-2882-9011',
    settlementTerms: 'net_30',
    leadTimeDays: 14,
    rating: 4.8,
    primaryCategory: '蓝牙音频 / 耳机音响',
    city: '广东深圳'
  },
  {
    id: 'sup-002',
    name: '浙江永康精工杯业制造厂',
    contactPerson: '王总',
    phone: '+86 139-5799-8800',
    settlementTerms: 'net_30',
    leadTimeDays: 10,
    rating: 4.9,
    primaryCategory: '不锈钢器皿 / 户外运动杯',
    city: '浙江金华'
  },
  {
    id: 'sup-003',
    name: '东莞市极客外设科技有限公司',
    contactPerson: '张工',
    phone: '+86 136-1234-9988',
    settlementTerms: 'prepaid_30',
    leadTimeDays: 21,
    rating: 4.6,
    primaryCategory: '键鼠外设 / 智能数码配件',
    city: '广东东莞'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-20260910-001',
    poNumber: 'PO260910-8801',
    supplierId: 'sup-001',
    supplierName: '深圳市宏达声学电子有限公司',
    targetWarehouseId: 'wh-sz-01',
    targetWarehouseName: '深圳龙岗自营主仓',
    items: [
      {
        sku: 'ANC-HD-BLK',
        name: '主动降噪无线头戴式蓝牙耳机 Pro - 曜石黑',
        quantity: 500,
        unitPriceRmb: 135.00,
        totalRmb: 67500.00
      }
    ],
    totalAmountRmb: 67500.00,
    status: 'in_transit',
    expectedDeliveryDate: '2026-09-24',
    createdAt: '2026-09-10 10:00:00',
    approvedBy: '林总监'
  },
  {
    id: 'PO-20260915-002',
    poNumber: 'PO260915-9923',
    supplierId: 'sup-003',
    supplierName: '东莞市极客外设科技有限公司',
    targetWarehouseId: 'wh-sz-01',
    targetWarehouseName: '深圳龙岗自营主仓',
    items: [
      {
        sku: 'KB75-BRN-BLK',
        name: '三模热插拔无线机械键盘 75%配列 - 暗夜黑茶轴',
        quantity: 200,
        unitPriceRmb: 185.00,
        totalRmb: 37000.00
      }
    ],
    totalAmountRmb: 37000.00,
    status: 'in_production',
    expectedDeliveryDate: '2026-10-05',
    createdAt: '2026-09-15 16:30:00',
    approvedBy: '林总监'
  }
];

export const INITIAL_RESTOCK_SUGGESTIONS: SmartRestockSuggestion[] = [
  {
    sku: 'KB75-BRN-BLK',
    productName: '三模热插拔无线机械键盘 75%配列 - 暗夜黑茶轴',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    warehouseName: '深圳龙岗自营主仓',
    availableStock: 2,
    inTransitStock: 150,
    salesVelocity7d: 8.5,
    salesVelocity30d: 6.2,
    daysOfSupplyRemaining: 0.2,
    supplierLeadTimeDays: 21,
    safeStockDays: 15,
    suggestedQuantity: 300,
    urgency: 'critical',
    estimatedCostRmb: 55500.00
  },
  {
    sku: 'ANC-HD-WHT',
    productName: '主动降噪无线头戴式蓝牙耳机 Pro - 珍珠白',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    warehouseName: '深圳龙岗自营主仓',
    availableStock: 20,
    inTransitStock: 0,
    salesVelocity7d: 5.4,
    salesVelocity30d: 4.8,
    daysOfSupplyRemaining: 3.7,
    supplierLeadTimeDays: 14,
    safeStockDays: 14,
    suggestedQuantity: 200,
    urgency: 'critical',
    estimatedCostRmb: 27000.00
  },
  {
    sku: 'SMB-32-PNK',
    productName: '智能数显保温保冷吸管杯 32oz - 落樱粉红',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    warehouseName: '深圳龙岗自营主仓',
    availableStock: 120,
    inTransitStock: 0,
    salesVelocity7d: 14.2,
    salesVelocity30d: 11.5,
    daysOfSupplyRemaining: 8.4,
    supplierLeadTimeDays: 10,
    safeStockDays: 10,
    suggestedQuantity: 400,
    urgency: 'warning',
    estimatedCostRmb: 15200.00
  }
];

export const INITIAL_LOGISTICS_CHANNELS: LogisticsChannel[] = [
  {
    id: 'ch-yun-us-eco',
    name: '云途特惠普货专线 (YUN-US-ECO)',
    carrier: 'YunExpress 云途',
    serviceType: 'special_line',
    targetRegions: ['US', 'CA'],
    agingMinDays: 6,
    agingMaxDays: 9,
    baseWeightG: 100,
    baseFeeRmb: 32.00,
    stepWeightG: 50,
    stepFeeRmb: 4.80,
    trackingSupport: true,
    batterySupport: false,
    status: 'active'
  },
  {
    id: 'ch-4px-post-prio',
    name: '4PX 联邮通优先专线 (4PX-PRIO-GL)',
    carrier: '4PX 递四方',
    serviceType: 'special_line',
    targetRegions: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'AU'],
    agingMinDays: 5,
    agingMaxDays: 8,
    baseWeightG: 100,
    baseFeeRmb: 38.00,
    stepWeightG: 50,
    stepFeeRmb: 5.20,
    trackingSupport: true,
    batterySupport: true,
    status: 'active'
  },
  {
    id: 'ch-dhl-intl-exp',
    name: 'DHL 国际特快专递 (DHL-EXPRESS)',
    carrier: 'DHL Express',
    serviceType: 'express',
    targetRegions: ['GLOBAL'],
    agingMinDays: 2,
    agingMaxDays: 4,
    baseWeightG: 500,
    baseFeeRmb: 145.00,
    stepWeightG: 500,
    stepFeeRmb: 38.00,
    trackingSupport: true,
    batterySupport: true,
    status: 'active'
  },
  {
    id: 'ch-yanwen-eu-track',
    name: '燕文欧洲挂号专线 (YW-EU-REG)',
    carrier: 'Yanwen 燕文',
    serviceType: 'special_line',
    targetRegions: ['DE', 'FR', 'ES', 'IT', 'PL', 'NL'],
    agingMinDays: 7,
    agingMaxDays: 12,
    baseWeightG: 100,
    baseFeeRmb: 28.00,
    stepWeightG: 50,
    stepFeeRmb: 4.10,
    trackingSupport: true,
    batterySupport: false,
    status: 'active'
  },
  {
    id: 'ch-fba-first-sea',
    name: '美西FBA头程海运限时达 (FBA-SEA-USW)',
    carrier: '美森快船 Matson',
    serviceType: 'fba_first_leg',
    targetRegions: ['US'],
    agingMinDays: 14,
    agingMaxDays: 18,
    baseWeightG: 21000,
    baseFeeRmb: 290.00,
    stepWeightG: 1000,
    stepFeeRmb: 11.50,
    trackingSupport: true,
    batterySupport: true,
    status: 'active'
  }
];

export const INITIAL_MESSAGES: CustomerMessage[] = [
  {
    id: 'msg-001',
    platform: 'amazon',
    storeName: 'AuraNova Direct (Amazon US)',
    buyerName: 'Sarah Jenkins',
    orderId: '114-8930219-4820194',
    subject: 'Question regarding pairing bluetooth to 2 devices simultaneously',
    message: 'Hello, I just ordered your ANC Headphones Pro. Can I connect both my MacBook and iPhone at the same time using multipoint bluetooth?',
    translatedMessage: '您好，我刚刚订购了你们的 ANC 降噪耳机 Pro。我能否通过多点蓝牙同时连接我的 MacBook 和 iPhone？',
    targetLanguage: '英语 -> 中文',
    createdAt: '2026-09-19 16:45:10',
    status: 'unread',
    priority: 'medium'
  },
  {
    id: 'msg-002',
    platform: 'amazon',
    storeName: 'AuraNova Europe (Amazon DE)',
    buyerName: 'Stefan Krause',
    orderId: 'DE-8392019482',
    subject: 'Lieferzeit nach Köln und Rechnung mit MwSt.',
    message: 'Guten Tag, können Sie mir bitte mitteilen, wann die mechanische Tastatur voraussichtlich ankommt? Ich benötige außerdem eine ordnungsgemäße Rechnung mit ausgewiesener Mehrwertsteuer.',
    translatedMessage: '日安，请问您能否告知机械键盘预计何时送达？另外，我需要一张开具增值税（VAT）的合规正式发票。',
    targetLanguage: '德语 -> 中文',
    createdAt: '2026-09-19 15:10:00',
    status: 'unread',
    priority: 'high'
  },
  {
    id: 'msg-003',
    platform: 'tiktok',
    storeName: 'AuraVibe Official (TikTok Shop US)',
    buyerName: 'Chloe Perez',
    orderId: 'TT-US-994820128',
    subject: 'Love this water bottle from TikTok live stream!',
    message: 'Hey! Saw this bottle on TikTok Live, does it fit standard car cup holders?',
    translatedMessage: '嗨！在 TikTok 直播间看到这个保温杯，请问它能放进标准的汽车水杯槽吗？',
    targetLanguage: '英语 -> 中文',
    createdAt: '2026-09-19 13:20:44',
    status: 'replied',
    priority: 'low'
  }
];

export const INITIAL_EXCHANGE_RATES: ExchangeRate[] = [
  { currency: 'USD', symbol: '$', name: '美元', rateToRmb: 7.235, updatedAt: '2026-09-19 17:00' },
  { currency: 'EUR', symbol: '€', name: '欧元', rateToRmb: 7.842, updatedAt: '2026-09-19 17:00' },
  { currency: 'GBP', symbol: '£', name: '英镑', rateToRmb: 9.380, updatedAt: '2026-09-19 17:00' },
  { currency: 'JPY', symbol: '¥', name: '日元', rateToRmb: 0.0482, updatedAt: '2026-09-19 17:00' },
  { currency: 'SGD', symbol: 'S$', name: '新加坡元', rateToRmb: 5.485, updatedAt: '2026-09-19 17:00' }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-01',
    name: '高客单价订单人工风控审核',
    description: '当单笔订单金额超过 $200 USD 时，自动标记并转入人工二次审核，防止刷单或黑卡风险。',
    triggerType: 'high_value',
    action: '挂起至待审核队列并站内警报',
    enabled: true
  },
  {
    id: 'rule-02',
    name: '低货重美线包裹自动推荐云途特惠',
    description: '当收件国家为美国且包裹实际重量 <= 450g 时，系统自动预指派【云途特惠普货专线】。',
    triggerType: 'order_paid',
    action: '自动匹配物流渠道 YUN-US-ECO',
    enabled: true
  },
  {
    id: 'rule-03',
    name: '安全库存阈值自动触发采购预警',
    description: '当任意仓库可用库存低于安全库存天数（14天）时，自动生成采购建议并推送采购主管。',
    triggerType: 'stock_low',
    action: '生成采购补货建议单',
    enabled: true
  }
];
