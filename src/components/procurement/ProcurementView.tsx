import { useState } from 'react';
import { 
  PurchaseOrder, 
  SmartRestockSuggestion, 
  Supplier 
} from '../../types/erp';
import { 
  BadgeAlert, 
  Sparkles, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  FileText, 
  Building2, 
  Phone, 
  AlertTriangle,
  ArrowRight,
  DollarSign
} from 'lucide-react';

interface ProcurementViewProps {
  purchaseOrders: PurchaseOrder[];
  restockSuggestions: SmartRestockSuggestion[];
  suppliers: Supplier[];
  onCreatePOFromSuggestion: (suggestion: SmartRestockSuggestion) => void;
  onReceivePO: (poId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ProcurementView = ({
  purchaseOrders,
  restockSuggestions,
  suppliers,
  onCreatePOFromSuggestion,
  onReceivePO,
  onShowToast
}: ProcurementViewProps) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'orders' | 'suppliers'>('suggestions');

  const totalPoAmountRmb = purchaseOrders.reduce((acc, p) => acc + p.totalAmountRmb, 0);

  return (
    <div id="procurement-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">采购与供应链协同 (SCM)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            基于历史日均销速与供应商交期的智能补货算法、采购执行单追踪与验收入库
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            在途/生产中采购款项: ¥{totalPoAmountRmb.toLocaleString()}
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          id="tab-restock-suggestions"
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'suggestions'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>智能补货建议看板</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
            {restockSuggestions.length}
          </span>
        </button>

        <button
          id="tab-purchase-orders"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>采购订单管理 (PO)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {purchaseOrders.length}
          </span>
        </button>

        <button
          id="tab-suppliers-directory"
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'suppliers'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>供应商名录与账期</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {suppliers.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Smart Restock Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-bold">智能补货算法公式依据</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                建议采购量 = (供应商交期天数 + 安全缓冲天数) × 近7天加权日均销速 - 当前可用库存 - 在途订单数。
                系统已为您自动筛出当前存在断货风险的热销SKU。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restockSuggestions.map((sug) => (
              <div 
                key={sug.sku}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {sug.urgency === 'critical' ? '紧急断货告急' : '建议预备采购'}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600">
                      库存仅够: {sug.daysOfSupplyRemaining.toFixed(1)} 天
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={sug.image} alt={sug.productName} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug">{sug.productName}</h3>
                      <p className="text-[11px] font-mono text-indigo-600 font-bold mt-0.5">{sug.sku}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>仓库可用库存:</span>
                      <strong className="text-rose-600 font-mono">{sug.availableStock} 件</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>7天日均销速:</span>
                      <span className="font-mono">{sug.salesVelocity7d} 件/天</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>供应商生产交期:</span>
                      <span className="font-mono">{sug.supplierLeadTimeDays} 天</span>
                    </div>
                    <div className="h-px bg-slate-200 my-1" />
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>算法建议补货量:</span>
                      <span className="text-indigo-600 text-sm font-mono font-black">{sug.suggestedQuantity} 件</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>预估采购成本:</span>
                      <span className="font-mono">¥{sug.estimatedCostRmb.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onCreatePOFromSuggestion(sug);
                      onShowToast('采购单已生成', `已根据算法建议为 [${sug.sku}] 建立采购单并推送审批`, 'success');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>一键生成采购单 ({sug.suggestedQuantity}件)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Purchase Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50/80 border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-3 px-3">采购单号</th>
                  <th className="py-3 px-3">供应商</th>
                  <th className="py-3 px-3">目标入库仓</th>
                  <th className="py-3 px-3">采购商品明细</th>
                  <th className="py-3 px-3 text-right">总金额 (RMB)</th>
                  <th className="py-3 px-3">预计到货日</th>
                  <th className="py-3 px-3 text-center">状态</th>
                  <th className="py-3 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 font-mono">{po.poNumber}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{po.createdAt}</p>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-800">
                      {po.supplierName}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700">
                      {po.targetWarehouseName}
                    </td>

                    <td className="py-3.5 px-3">
                      {po.items.map((it, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <p className="font-semibold text-slate-800 truncate max-w-xs">{it.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {it.sku} • 采购 {it.quantity} 件 @ ¥{it.unitPriceRmb}
                          </p>
                        </div>
                      ))}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-slate-900 font-mono text-sm">
                      ¥{po.totalAmountRmb.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-600">
                      {po.expectedDeliveryDate}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {po.status === 'in_transit' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          供应商已发货在途
                        </span>
                      )}
                      {po.status === 'in_production' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          工厂排产中
                        </span>
                      )}
                      {po.status === 'received' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          已验收入库
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {po.status !== 'received' ? (
                        <button
                          onClick={() => {
                            onReceivePO(po.id);
                            onShowToast('验收入库成功', `采购单 ${po.poNumber} 已确认收货，系统已自动增加仓库在库库存`, 'success');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
                        >
                          到货验收入库
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">已完结</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Suppliers Directory */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{sup.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{sup.city} • {sup.primaryCategory}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-xs">
                  评分 {sup.rating}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>联系代表:</span>
                  <strong className="text-slate-900">{sup.contactPerson}</strong>
                </div>
                <div className="flex justify-between">
                  <span>联系电话:</span>
                  <span className="font-mono text-indigo-600 font-semibold">{sup.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>采购账期结算:</span>
                  <span className="font-medium text-slate-800">{sup.settlementTerms === 'net_30' ? '月结 30 天' : '预付 30% 定金'}</span>
                </div>
                <div className="flex justify-between">
                  <span>平均生产交期:</span>
                  <span className="font-mono text-emerald-600 font-bold">{sup.leadTimeDays} 天</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
