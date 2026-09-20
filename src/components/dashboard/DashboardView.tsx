import { useState } from 'react';
import { 
  Order, 
  StoreAccount, 
  InventoryRecord, 
  ExchangeRate 
} from '../../types/erp';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  Clock, 
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';

interface DashboardViewProps {
  orders: Order[];
  stores: StoreAccount[];
  inventory: InventoryRecord[];
  currencyRates: ExchangeRate[];
  activeCurrency: string;
  onNavigate: (tab: any) => void;
}

export const DashboardView = ({
  orders,
  stores,
  inventory,
  currencyRates,
  activeCurrency,
  onNavigate
}: DashboardViewProps) => {
  const [trendDays, setTrendDays] = useState<7 | 14>(14);

  // Currency converter helper
  const convertToActive = (amountRmb: number) => {
    const rateObj = currencyRates.find(r => r.currency === activeCurrency);
    const rate = rateObj ? rateObj.rateToRmb : 7.235;
    if (activeCurrency === 'CNY') return amountRmb;
    return amountRmb / rate;
  };

  const currencySymbol = currencyRates.find(r => r.currency === activeCurrency)?.symbol || '$';

  // Metrics calculations
  const totalRevenueUsd = stores.reduce((acc, s) => acc + s.todayRevenue, 0);
  const totalOrdersToday = stores.reduce((acc, s) => acc + s.todayOrderCount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending_review' || o.status === 'allocated').length;
  const lowStockItems = inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length;

  const totalProfitEstimatedRmb = orders.reduce((acc, o) => acc + (o.estimatedProfit * 7.235), 0);
  const avgMargin = (orders.reduce((acc, o) => acc + o.marginPercent, 0) / (orders.length || 1)).toFixed(1);

  // Trend data mock
  const trendData = [
    { day: '09/06', sales: 4200, orders: 72 },
    { day: '09/07', sales: 4850, orders: 81 },
    { day: '09/08', sales: 5120, orders: 89 },
    { day: '09/09', sales: 4690, orders: 78 },
    { day: '09/10', sales: 5800, orders: 95 },
    { day: '09/11', sales: 6420, orders: 108 },
    { day: '09/12', sales: 7100, orders: 122 },
    { day: '09/13', sales: 6900, orders: 114 },
    { day: '09/14', sales: 7450, orders: 129 },
    { day: '09/15', sales: 8120, orders: 138 },
    { day: '09/16', sales: 7890, orders: 131 },
    { day: '09/17', sales: 8900, orders: 147 },
    { day: '09/18', sales: 9450, orders: 156 },
    { day: '09/19 (今日)', sales: 10040, orders: 168 }
  ];

  const displayTrend = trendDays === 7 ? trendData.slice(-7) : trendData;
  const maxSales = Math.max(...displayTrend.map(d => d.sales));

  // Platform distribution
  const platformStats = [
    { name: 'Amazon (美/欧)', percent: 45, color: '#f59e0b', gmv: '$4,520' },
    { name: 'TikTok Shop', percent: 34, color: '#06b6d4', gmv: '$3,420' },
    { name: 'Shopee (东南亚)', percent: 11, color: '#f97316', gmv: '$1,120' },
    { name: 'AliExpress & eBay', percent: 10, color: '#8b5cf6', gmv: '$980' }
  ];

  return (
    <div id="dashboard-view" className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in-50">
      {/* Top Banner: Quick Summary & Time */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl text-white shadow-lg shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">全球跨境出海销售运营看板</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              数据实时同步中
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            覆盖北美、欧洲、东南亚等主流电商平台（Amazon、TikTok Shop、Shopee、AliExpress）
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigate('orders')}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>快速处理待审订单 ({pendingOrders})</span>
          </button>
          <button
            onClick={() => onNavigate('procurement')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>智能补货建议</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today GMV */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">今日销售 GMV</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {currencySymbol}{totalRevenueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">昨日同期: {currencySymbol}{(totalRevenueUsd * 0.85).toFixed(2)}</p>
        </div>

        {/* Card 2: Today Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">今日成交订单</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalOrdersToday} 笔</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12.6%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">平均客单价 (AOV): {currencySymbol}{(totalRevenueUsd / (totalOrdersToday || 1)).toFixed(2)}</p>
        </div>

        {/* Card 3: Pending Orders & Low Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">待办履约与预警</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingOrders} 笔</p>
              <p className="text-[11px] text-indigo-600 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('orders')}>
                待审/待配货订单 →
              </p>
            </div>
            <div className="text-right border-l border-slate-100 pl-3">
              <p className="text-2xl font-bold text-rose-600">{lowStockItems} 款</p>
              <p className="text-[11px] text-rose-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('inventory')}>
                缺货库存预警 →
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Profitability & Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">预估综合净利润</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {currencySymbol}{convertToActive(totalProfitEstimatedRmb).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
              毛利率 {avgMargin}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">已扣减采购成本、头程运费与平台佣金</p>
        </div>
      </div>

      {/* Main Grid: Trend Chart & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Velocity Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">近14日全球销售趋势走势</h2>
              <p className="text-xs text-slate-400 mt-0.5">跨全平台GMV与订单成交日趋势</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setTrendDays(7)}
                className={`px-2.5 py-1 rounded-md transition-all ${trendDays === 7 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                7天
              </button>
              <button
                onClick={() => setTrendDays(14)}
                className={`px-2.5 py-1 rounded-md transition-all ${trendDays === 14 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                14天
              </button>
            </div>
          </div>

          {/* SVG Line / Bar visualization */}
          <div className="h-64 flex flex-col justify-end pt-4">
            <div className="flex-1 flex items-end gap-2 sm:gap-3 px-2">
              {displayTrend.map((item, idx) => {
                const heightPercent = (item.sales / maxSales) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg py-1 px-2 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                      <p className="font-bold">${item.sales.toLocaleString()}</p>
                      <p className="text-slate-300">{item.orders} 笔订单</p>
                    </div>

                    {/* Bar */}
                    <div 
                      className="w-full rounded-t-lg bg-indigo-50 group-hover:bg-indigo-100 transition-all flex items-end overflow-hidden"
                      style={{ height: '180px' }}
                    >
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md group-hover:brightness-110 transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* X-axis label */}
                    <span className="text-[10px] text-slate-400 tracking-tighter truncate max-w-full">
                      {item.day.replace(' (今日)', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Platform GMV Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">平台销售渠道贡献</h2>
              <button 
                onClick={() => onNavigate('stores')}
                className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
              >
                <span>授权管理</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Platform bars */}
            <div className="space-y-3.5">
              {platformStats.map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="font-medium text-slate-700">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{p.gmv}</span>
                      <span className="text-[11px] text-slate-400">({p.percent}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${p.percent}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currency exchange widget */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                实时基准参考汇率 (对人民币)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">每小时更新</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400">USD/CNY</p>
                <p className="font-bold text-slate-800">7.235</p>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400">EUR/CNY</p>
                <p className="font-bold text-slate-800">7.842</p>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400">GBP/CNY</p>
                <p className="font-bold text-slate-800">9.380</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Selling SKUs & Quick Operational Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Selling SKUs */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">近30天爆款热销商品排行</h2>
              <p className="text-xs text-slate-400 mt-0.5">按全渠道销售量与库存健康度监控</p>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              <span>查看全部商品</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-slate-400 bg-slate-50 uppercase border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">商品 / SKU</th>
                  <th className="py-2.5 px-3">品类</th>
                  <th className="py-2.5 px-3">30天销量</th>
                  <th className="py-2.5 px-3">可用库存</th>
                  <th className="py-2.5 px-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img 
                      src="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100&auto=format&fit=crop&q=80" 
                      alt="Yoga Mat" 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                    />
                    <div>
                      <p className="font-semibold text-slate-800">加厚防滑环保天然橡胶瑜伽垫</p>
                      <p className="text-[10px] text-slate-400 font-mono">YOGA-MAT-PUR</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">运动户外</td>
                  <td className="py-3 px-3 font-bold text-slate-900">3,100 件</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">680 件充足</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      热卖中
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img 
                      src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&auto=format&fit=crop&q=80" 
                      alt="Water Bottle" 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                    />
                    <div>
                      <p className="font-semibold text-slate-800">智能数显真空保温吸管杯 32oz</p>
                      <p className="text-[10px] text-slate-400 font-mono">SMB-32-BLU</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">家居日用</td>
                  <td className="py-3 px-3 font-bold text-slate-900">2,890 件</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">590 件充足</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      TikTok爆款
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img 
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80" 
                      alt="Headphones" 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                    />
                    <div>
                      <p className="font-semibold text-slate-800">主动降噪无线头戴式耳机 Pro</p>
                      <p className="text-[10px] text-slate-400 font-mono">ANC-HD-BLK</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">3C数码</td>
                  <td className="py-3 px-3 font-bold text-slate-900">1,420 件</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">412 件充足</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      稳定供货
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img 
                      src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80" 
                      alt="Keyboard" 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                    />
                    <div>
                      <p className="font-semibold text-slate-800">三模热插拔无线机械键盘 75%配列</p>
                      <p className="text-[10px] text-slate-400 font-mono">KB75-BRN-BLK</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">电脑外设</td>
                  <td className="py-3 px-3 font-bold text-slate-900">940 件</td>
                  <td className="py-3 px-3 text-rose-600 font-bold">2 件 (紧急缺货)</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      库存告急
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Operational Shortcuts & Automation Engine Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">跨境协同核心快捷通道</h2>
            <p className="text-xs text-slate-400 mb-4">常用高频业务操作入口</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('orders')}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800">批量审核打单</p>
                <p className="text-[10px] text-slate-400 mt-0.5">流转待发订单</p>
              </button>

              <button
                onClick={() => onNavigate('logistics')}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800">国际运费比价</p>
                <p className="text-[10px] text-slate-400 mt-0.5">测算各专线时效</p>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800">智能刊登定价</p>
                <p className="text-[10px] text-slate-400 mt-0.5">毛利率反算售价</p>
              </button>

              <button
                onClick={() => onNavigate('procurement')}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800">供应商采购单</p>
                <p className="text-[10px] text-slate-400 mt-0.5">智能算法补货</p>
              </button>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-indigo-950 text-white">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-indigo-200">自动化规则引擎状态</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">已启动 3 条规则</span>
            </div>
            <p className="text-[11px] text-slate-300">
              美线低于 450g 自动预选云途专线，高危订单自动挂起待审。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
