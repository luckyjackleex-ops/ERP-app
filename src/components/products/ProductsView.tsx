import { useState } from 'react';
import { 
  Product, 
  ProductVariant, 
  LogisticsChannel, 
  ExchangeRate 
} from '../../types/erp';
import { 
  Search, 
  Plus, 
  Calculator, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Package, 
  DollarSign, 
  Check, 
  X, 
  FileCheck,
  Globe2
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  logisticsChannels: LogisticsChannel[];
  currencyRates: ExchangeRate[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ProductsView = ({
  products,
  onAddProduct,
  onUpdateProduct,
  logisticsChannels,
  currencyRates,
  onShowToast
}: ProductsViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [showPricingCalculator, setShowPricingCalculator] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  // Pricing Calculator States
  const [calcCostRmb, setCalcCostRmb] = useState<number>(135);
  const [calcWeightG, setCalcWeightG] = useState<number>(340);
  const [calcPlatform, setCalcPlatform] = useState<'amazon' | 'tiktok' | 'shopee'>('amazon');
  const [calcTargetMargin, setCalcTargetMargin] = useState<number>(30); // 30%
  const [calcSelectedChannelId, setCalcSelectedChannelId] = useState<string>('ch-yun-us-eco');

  // Filter products
  const categories = Array.from(new Set(products.map(p => p.category)));
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      p.spu.toLowerCase().includes(q) ||
      p.nameCn.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.variants.some(v => v.sku.toLowerCase().includes(q) || v.barcode.includes(q));
    return matchesCat && matchesQuery;
  });

  // Calculate Shipping fee based on selected channel and weight
  const selectedChannel = logisticsChannels.find(c => c.id === calcSelectedChannelId) || logisticsChannels[0];
  const calculateShippingCostRmb = (weightG: number, ch: LogisticsChannel) => {
    if (weightG <= ch.baseWeightG) {
      return ch.baseFeeRmb;
    }
    const extraWeight = weightG - ch.baseWeightG;
    const steps = Math.ceil(extraWeight / ch.stepWeightG);
    return ch.baseFeeRmb + steps * ch.stepFeeRmb;
  };

  const shippingCostRmb = calculateShippingCostRmb(calcWeightG, selectedChannel);
  const usdRate = currencyRates.find(r => r.currency === 'USD')?.rateToRmb || 7.235;

  // Platform commission rates
  const commissionRates = {
    amazon: 0.15,
    tiktok: 0.08,
    shopee: 0.08
  };
  const commRate = commissionRates[calcPlatform];

  // Target Formula:
  // Revenue RMB = (Cost RMB + Shipping RMB) / (1 - CommissionRate - TargetMargin)
  // Selling Price USD = Revenue RMB / UsdRate
  const denom = 1 - commRate - (calcTargetMargin / 100);
  const safeDenom = denom > 0.1 ? denom : 0.1;
  const suggestedRevenueRmb = (calcCostRmb + shippingCostRmb) / safeDenom;
  const suggestedSellingPriceUsd = (suggestedRevenueRmb / usdRate);
  const commissionCostUsd = suggestedSellingPriceUsd * commRate;
  const shippingCostUsd = shippingCostRmb / usdRate;
  const costPriceUsd = calcCostRmb / usdRate;
  const estimatedProfitUsd = suggestedSellingPriceUsd - commissionCostUsd - shippingCostUsd - costPriceUsd;

  // New product initial state
  const [newSpu, setNewSpu] = useState('SPU-NEW-' + Math.floor(1000 + Math.random() * 9000));
  const [newNameCn, setNewNameCn] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newCategory, setNewCategory] = useState('3C数码 / 配件');
  const [newHsCode, setNewHsCode] = useState('8518300000');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameCn.trim()) {
      onShowToast('表单错误', '请填写商品中文名称', 'error');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      spu: newSpu,
      nameCn: newNameCn,
      nameEn: newNameEn || newNameCn,
      category: newCategory,
      mainImage: newImage,
      gallery: [newImage],
      customsDeclaration: {
        declaredCnName: newNameCn,
        declaredEnName: newNameEn || 'Consumer Goods',
        hsCode: newHsCode,
        declaredValueUsd: 12.00
      },
      supplierId: 'sup-001',
      supplierName: '深圳市宏达声学电子有限公司',
      totalSales30d: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      variants: [
        {
          sku: `${newSpu}-BLK`,
          variantName: '标准黑色款',
          attributes: { Color: 'Black' },
          barcode: '8401928' + Math.floor(10000 + Math.random() * 90000),
          stockTotal: 100,
          stockAvailable: 100,
          stockReserved: 0,
          costRmb: 45.00,
          suggestedPriceUsd: 29.99,
          weightG: 280,
          dimensionsCm: { length: 15, width: 10, height: 5 }
        }
      ]
    };

    onAddProduct(newProd);
    onShowToast('商品创建成功', `SPU [${newSpu}] 与基础SKU已成功收录入库`, 'success');
    setShowNewProductModal(false);
    setNewNameCn('');
    setNewNameEn('');
  };

  return (
    <div id="products-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">商品与刊登中心 (PIM)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            SPU/SKU主数据中台、海关申报HS编码、智能跨境保本售价与多平台刊登管理
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPricingCalculator(true)}
            className="px-3.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span>跨境定价与保本测算器</span>
          </button>

          <button
            onClick={() => setShowNewProductModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建SPU商品档案</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索：SPU、SKU编码、中英文品名、条形码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-hidden"
          >
            <option value="all">全产品品类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          共收录 <strong>{filteredProducts.length}</strong> 个SPU，
          <strong>{filteredProducts.reduce((acc, p) => acc + p.variants.length, 0)}</strong> 个多属性SKU
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* SPU Header */}
              <div className="flex items-start gap-3.5">
                <img 
                  src={product.mainImage} 
                  alt={product.nameCn} 
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {product.spu}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      近30天销: <strong className="text-slate-900">{product.totalSales30d}</strong> 件
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug line-clamp-1">
                    {product.nameCn}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {product.nameEn}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>品类: <strong className="text-slate-700">{product.category}</strong></span>
                    <span>•</span>
                    <span>HS: <strong className="font-mono text-indigo-700">{product.customsDeclaration.hsCode}</strong></span>
                  </div>
                </div>
              </div>

              {/* SKU Variants Matrix Table */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    关联规格变体 ({product.variants.length} 个SKU)
                  </span>
                  <span className="text-[11px] text-slate-400">总可用库存: {product.variants.reduce((acc, v) => acc + v.stockAvailable, 0)} 件</span>
                </div>

                <div className="space-y-1.5">
                  {product.variants.map((variant) => (
                    <div 
                      key={variant.sku}
                      className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-slate-800 truncate">{variant.variantName}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span className="text-indigo-600 font-bold">{variant.sku}</span>
                          <span>|</span>
                          <span>条码: {variant.barcode}</span>
                          <span>|</span>
                          <span>{variant.weightG}g</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900">${variant.suggestedPriceUsd.toFixed(2)}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">可用: {variant.stockAvailable}件</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                供应商: {product.supplierName}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const firstVar = product.variants[0];
                    setCalcCostRmb(firstVar.costRmb);
                    setCalcWeightG(firstVar.weightG);
                    setShowPricingCalculator(true);
                  }}
                  className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  <span>测算售价</span>
                </button>
                <button
                  onClick={() => setInspectingProduct(product)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded transition-colors"
                >
                  海关申报详情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing & Gross Margin Calculator Modal */}
      {showPricingCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">跨境智能保本定价 & 毛利反算器</h3>
                  <p className="text-[11px] text-slate-500">综合考虑采购成本、国际干线专线运费、平台扣点、汇率与目标净利率</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPricingCalculator(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Form grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    国内采购成本 (RMB ¥)
                  </label>
                  <input
                    type="number"
                    value={calcCostRmb}
                    onChange={(e) => setCalcCostRmb(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    商品毛重 (Grams 克)
                  </label>
                  <input
                    type="number"
                    value={calcWeightG}
                    onChange={(e) => setCalcWeightG(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    目标销售平台 (含佣金扣点)
                  </label>
                  <select
                    value={calcPlatform}
                    onChange={(e) => setCalcPlatform(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800"
                  >
                    <option value="amazon">Amazon 亚马逊 (佣金 15%)</option>
                    <option value="tiktok">TikTok Shop (佣金 8%)</option>
                    <option value="shopee">Shopee 虾皮 (佣金 8%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    目标预期净毛利率 (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={calcTargetMargin}
                      onChange={(e) => setCalcTargetMargin(Number(e.target.value) || 10)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-900"
                    />
                    <span className="text-slate-500 font-bold">%</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    指定出海国际物流专线
                  </label>
                  <select
                    value={calcSelectedChannelId}
                    onChange={(e) => setCalcSelectedChannelId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                  >
                    {logisticsChannels.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.agingMinDays}-{c.agingMaxDays}天时效) - 首重¥{c.baseFeeRmb}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Calculation Result Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    系统推荐出海建议零售价
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    汇率: 1 USD = {usdRate} RMB
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-emerald-400 font-mono">
                      ${suggestedSellingPriceUsd.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-200 font-mono">
                      ¥{suggestedRevenueRmb.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">RMB</span>
                  </div>
                </div>

                {/* Itemized Cost Breakdown */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                  <div>采购商品成本: <span className="font-mono text-white">¥{calcCostRmb.toFixed(2)} (${costPriceUsd.toFixed(2)})</span></div>
                  <div>国际专线运费: <span className="font-mono text-white">¥{shippingCostRmb.toFixed(2)} (${shippingCostUsd.toFixed(2)})</span></div>
                  <div>平台扣佣金 ({(commRate * 100).toFixed(0)}%): <span className="font-mono text-amber-300">${commissionCostUsd.toFixed(2)}</span></div>
                  <div>预估单笔纯利: <span className="font-mono text-emerald-400 font-bold">+${estimatedProfitUsd.toFixed(2)} ({calcTargetMargin}%)</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => {
                  onShowToast('定价模型已采纳', `建议售价 $${suggestedSellingPriceUsd.toFixed(2)} 已复制，可直接用于多平台刊登`, 'success');
                  setShowPricingCalculator(false);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs"
              >
                应用并保存到商品
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customs Declaration Details Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">海关申报与清关信息备案</h3>
              </div>
              <button onClick={() => setInspectingProduct(null)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">申报中文名:</span>
                  <strong className="text-slate-900">{inspectingProduct.customsDeclaration.declaredCnName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">申报英文名 (清关英文):</span>
                  <strong className="text-slate-900">{inspectingProduct.customsDeclaration.declaredEnName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">海关商品HS编码:</span>
                  <strong className="font-mono text-indigo-700 font-bold">{inspectingProduct.customsDeclaration.hsCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">单件报关申报价值 (USD):</span>
                  <strong className="font-mono text-slate-900">${inspectingProduct.customsDeclaration.declaredValueUsd.toFixed(2)}</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                提示：HS编码用于国际海运清关、目的地国家关税核算以及危险品合规（如含电/含磁申报）。
              </p>
            </div>

            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectingProduct(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Drawer / Modal */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">创建新SPU出海商品档案</h3>
              <button onClick={() => setShowNewProductModal(false)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  SPU 编码
                </label>
                <input
                  type="text"
                  value={newSpu}
                  onChange={(e) => setNewSpu(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-xs text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  商品中文名称 (ERP内部识别)
                </label>
                <input
                  type="text"
                  placeholder="例如：无线便携式高音质蓝牙音箱"
                  value={newNameCn}
                  onChange={(e) => setNewNameCn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  商品英文名称 (平台刊登与出海报关)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Portable Waterproof Bluetooth Speaker Pro"
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    商品所属品类
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    海关报关 HS 编码
                  </label>
                  <input
                    type="text"
                    value={newHsCode}
                    onChange={(e) => setNewHsCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  主图 URL 链接
                </label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  保存并生成SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
