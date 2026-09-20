import { useState } from 'react';
import { 
  Warehouse, 
  InventoryRecord 
} from '../../types/erp';
import { 
  Boxes, 
  Search, 
  Warehouse as WarehouseIcon, 
  AlertTriangle, 
  ArrowRightLeft, 
  SlidersHorizontal, 
  Check, 
  Plus, 
  MapPin, 
  X,
  PackageCheck
} from 'lucide-react';

interface InventoryViewProps {
  warehouses: Warehouse[];
  inventory: InventoryRecord[];
  onUpdateInventoryQuantity: (recordId: string, delta: number) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const InventoryView = ({
  warehouses,
  inventory,
  onUpdateInventoryQuantity,
  onShowToast
}: InventoryViewProps) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustingRecord, setAdjustingRecord] = useState<InventoryRecord | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('日常盘点盈亏差异校正');

  // Filter logic
  const filteredInventory = inventory.filter(record => {
    const matchesWh = selectedWarehouseId === 'all' || record.warehouseId === selectedWarehouseId;
    const matchesStatus = stockStatusFilter === 'all' || record.status === stockStatusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      record.sku.toLowerCase().includes(q) ||
      record.productName.toLowerCase().includes(q) ||
      record.shelfLocation.toLowerCase().includes(q) ||
      record.warehouseName.toLowerCase().includes(q);

    return matchesWh && matchesStatus && matchesQuery;
  });

  const lowStockCount = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalValuationRmb = inventory.reduce((acc, i) => acc + (i.onHandQuantity * i.costRmb), 0);

  const handleApplyAdjustment = () => {
    if (!adjustingRecord || adjustAmount === 0) return;
    onUpdateInventoryQuantity(adjustingRecord.id, adjustAmount);
    onShowToast(
      '库存盘点调账成功', 
      `SKU [${adjustingRecord.sku}] 在 ${adjustingRecord.warehouseName} 调整 ${adjustAmount > 0 ? '+' : ''}${adjustAmount} 件`, 
      'success'
    );
    setAdjustingRecord(null);
    setAdjustAmount(0);
  };

  return (
    <div id="inventory-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">仓储与多仓库存中心 (WMS)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            国内自营仓、亚马逊FBA仓及第三方海外仓多仓联动，精准库位管理与在途补货追踪
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            在库资产估值: ¥{totalValuationRmb.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Warehouse Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {warehouses.map((wh) => {
          const isSelected = selectedWarehouseId === wh.id;
          return (
            <button
              key={wh.id}
              onClick={() => setSelectedWarehouseId(isSelected ? 'all' : wh.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-slate-100 text-slate-700">
                  {wh.type === 'domestic' ? '国内仓' : wh.type === 'fba' ? 'FBA保税' : '3PL海外'}
                </span>
                <span className={`w-2 h-2 rounded-full ${wh.status === 'normal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>

              <h3 className="font-bold text-xs text-slate-900 truncate">{wh.name}</h3>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{wh.country} • {wh.contact.split(' ')[0]}</p>

              {/* Progress bar */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>库容负荷</span>
                  <span className="font-bold text-slate-700">{wh.usedCapacityPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${wh.usedCapacityPercent > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${wh.usedCapacityPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索：SKU、品名、货位编号 (如 A-02-14)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
            />
          </div>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-hidden"
          >
            <option value="all">全部库存状态</option>
            <option value="sufficient">库存充足 ({inventory.filter(i => i.status === 'sufficient').length})</option>
            <option value="low_stock">安全库存预警 ({lowStockCount})</option>
            <option value="out_of_stock">紧急缺货断货 ({outOfStockCount})</option>
          </select>
        </div>

        {selectedWarehouseId !== 'all' && (
          <button
            onClick={() => setSelectedWarehouseId('all')}
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>重置为全部仓库汇总</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-500 bg-slate-50/80 border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-3">商品 / SKU</th>
                <th className="py-3 px-3">存储仓库</th>
                <th className="py-3 px-3">货架库位</th>
                <th className="py-3 px-3 text-right">实际在库 (On-Hand)</th>
                <th className="py-3 px-3 text-right">锁定占用 (Reserved)</th>
                <th className="py-3 px-3 text-right font-bold text-slate-900">可用库存 (Available)</th>
                <th className="py-3 px-3 text-right">采购在途 (In-Transit)</th>
                <th className="py-3 px-3 text-center">周转天数</th>
                <th className="py-3 px-3 text-center">状态</th>
                <th className="py-3 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img src={item.image} alt={item.productName} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.productName}</p>
                      <p className="text-[11px] text-indigo-600 font-mono font-bold">{item.sku}</p>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800">{item.warehouseName}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {item.shelfLocation}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                    {item.onHandQuantity}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    {item.reservedQuantity}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    {item.availableQuantity}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-indigo-600 font-semibold">
                    +{item.inTransitQuantity}
                  </td>

                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {item.turnoverDays} 天
                  </td>

                  <td className="py-3 px-3 text-center">
                    {item.status === 'sufficient' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        库存充盈
                      </span>
                    )}
                    {item.status === 'low_stock' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        低于安全警戒
                      </span>
                    )}
                    {item.status === 'out_of_stock' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        紧急断货
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setAdjustingRecord(item);
                        setAdjustAmount(0);
                      }}
                      className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded font-medium text-xs transition-colors"
                    >
                      盘点调账
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">库存盘点与数量调整 (Stock Adjustment)</h3>
                <p className="text-[11px] text-slate-500">{adjustingRecord.warehouseName} • {adjustingRecord.shelfLocation}</p>
              </div>
              <button onClick={() => setAdjustingRecord(null)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-800">{adjustingRecord.productName}</p>
                <p className="font-mono text-indigo-600 font-bold">SKU: {adjustingRecord.sku}</p>
                <p className="text-slate-500">当前在库账面数: <strong>{adjustingRecord.onHandQuantity}</strong> 件</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  增减调整数量 (正数盘盈入库，负数盘亏出库)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  调整后在库数将为: <strong>{adjustingRecord.onHandQuantity + adjustAmount}</strong> 件
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  调账原因备注
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <option value="日常盘点盈亏差异校正">日常盘点盈亏差异校正</option>
                  <option value="样品外借与营销赠品出库">样品外借与营销赠品出库</option>
                  <option value="库位损坏或残次品报废">库位损坏或残次品报废</option>
                  <option value="供应商少发补发调账">供应商少发补发调账</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setAdjustingRecord(null)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleApplyAdjustment}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
              >
                确认提交调账
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
