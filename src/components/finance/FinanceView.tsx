import { useState } from 'react';
import { 
  Order, 
  ExchangeRate 
} from '../../types/erp';
import { 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Globe2, 
  Edit3, 
  Check, 
  PieChart,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface FinanceViewProps {
  orders: Order[];
  currencyRates: ExchangeRate[];
  onUpdateExchangeRate: (currency: string, newRate: number) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const FinanceView = ({
  orders,
  currencyRates,
  onUpdateExchangeRate,
  onShowToast
}: FinanceViewProps) => {
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);

  // Financial calculations
  const totalGmvUsd = orders.reduce((acc, o) => {
    if (o.currency === 'USD') return acc + o.subtotal;
    if (o.currency === 'EUR') return acc + (o.subtotal * 1.08);
    if (o.currency === 'SGD') return acc + (o.subtotal * 0.76);
    return acc + o.subtotal;
  }, 0);

  const totalPlatformFeesUsd = orders.reduce((acc, o) => acc + o.platformCommission, 0);
  const totalShippingFeesUsd = orders.reduce((acc, o) => acc + o.actualShippingCost, 0);
  const totalCogsUsd = orders.reduce((acc, o) => acc + (o.totalCost - o.actualShippingCost), 0);
  const totalNetProfitUsd = orders.reduce((acc, o) => acc + o.estimatedProfit, 0);
  const avgMargin = ((totalNetProfitUsd / (totalGmvUsd || 1)) * 100).toFixed(1);

  const usdToRmbRate = currencyRates.find(r => r.currency === 'USD')?.rateToRmb || 7.235;
  const totalNetProfitRmb = totalNetProfitUsd * usdToRmbRate;

  const handleSaveRate = (currency: string) => {
    if (tempRate <= 0) return;
    onUpdateExchangeRate(currency, tempRate);
    onShowToast('汇率已更新', `${currency} 对人民币折算汇率已调整为 ${tempRate}`, 'success');
    setEditingCurrency(null);
  };

  const handleExportCsv = () => {
    const headers = '内部订单号,平台订单号,销售平台,订单金额,平台佣金,国际运费,商品采购成本,预估净利润(USD),净利率%\n';
    const rows = orders.map(o => 
      `${o.id},${o.platformOrderId},${o.platform},${o.subtotal},${o.platformCommission},${o.actualShippingCost},${(o.totalCost - o.actualShippingCost).toFixed(2)},${o.estimatedProfit.toFixed(2)},${o.marginPercent}%`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `跨境ERP财务利润核算报表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    onShowToast('导出成功', '财务核算数据报表 CSV 已开始下载', 'success');
  };

  return (
    <div id="finance-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">财务与单票利润核算 (FMS)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            多币种收入折算、平台扣点追踪、国际物流运费抵扣、头程分摊与单票净利润深度审计
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>导出财务对账 CSV</span>
          </button>
        </div>
      </div>

      {/* Financial P&L Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">总销售 GMV (USD)</p>
          <p className="text-2xl font-black text-slate-900 mt-1 font-mono">${totalGmvUsd.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">折合 ¥{(totalGmvUsd * usdToRmbRate).toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">平台佣金与技术费</p>
          <p className="text-2xl font-black text-amber-600 mt-1 font-mono">-${totalPlatformFeesUsd.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">占比约 {((totalPlatformFeesUsd / totalGmvUsd) * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">国际专线运费总支出</p>
          <p className="text-2xl font-black text-rose-600 mt-1 font-mono">-${totalShippingFeesUsd.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">涵盖专线及头程</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">商品采购商品成本 (COGS)</p>
          <p className="text-2xl font-black text-slate-700 mt-1 font-mono">-${totalCogsUsd.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">国内供货采购总额</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white shadow-md shadow-emerald-500/20">
          <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">综合净利润 (Net Profit)</p>
          <p className="text-2xl font-black mt-1 font-mono">+${totalNetProfitUsd.toFixed(2)}</p>
          <p className="text-[11px] text-emerald-100 mt-0.5 font-bold">¥{totalNetProfitRmb.toFixed(2)} (利润率 {avgMargin}%)</p>
        </div>
      </div>

      {/* Grid: Exchange Rates & Per-Order Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Exchange Rates Configuration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-indigo-600" />
              实时结算折算基准汇率
            </h3>
            <span className="text-[10px] text-slate-400">对人民币 (RMB)</span>
          </div>

          <div className="space-y-2.5">
            {currencyRates.map((cr) => {
              const isEditing = editingCurrency === cr.currency;

              return (
                <div 
                  key={cr.currency}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{cr.symbol} {cr.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">({cr.currency})</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">更新: {cr.updatedAt}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.0001"
                          value={tempRate}
                          onChange={(e) => setTempRate(Number(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-indigo-500 rounded bg-white text-xs font-mono font-bold"
                        />
                        <button
                          onClick={() => handleSaveRate(cr.currency)}
                          className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {cr.rateToRmb}
                        </span>
                        <button
                          onClick={() => {
                            setEditingCurrency(cr.currency);
                            setTempRate(cr.rateToRmb);
                          }}
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                          title="修改自定义折算汇率"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 cols: Per-Order Financial Profit Audit Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">单票订单利润与扣款核算清单</h3>
              <p className="text-xs text-slate-500 mt-0.5">透明追踪每笔订单的流水与实际落袋利润</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">内部单号</th>
                  <th className="py-2.5 px-3">店铺 / 币种</th>
                  <th className="py-2.5 px-3 text-right">销售收入</th>
                  <th className="py-2.5 px-3 text-right">平台扣点</th>
                  <th className="py-2.5 px-3 text-right">国际运费</th>
                  <th className="py-2.5 px-3 text-right">净利润 (USD)</th>
                  <th className="py-2.5 px-3 text-right">毛利率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {o.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-700 truncate max-w-[120px]">{o.storeName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{o.currency}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ${o.subtotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-600">
                      -${o.platformCommission.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600">
                      -${o.actualShippingCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-600">
                      +${o.estimatedProfit.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {o.marginPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
