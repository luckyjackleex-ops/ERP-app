import { useState, useMemo } from 'react';
import { 
  Order, 
  OrderStatus, 
  PlatformType, 
  LogisticsChannel 
} from '../../types/erp';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Printer, 
  Send, 
  Ban, 
  Split, 
  Eye, 
  Copy, 
  Check, 
  Truck, 
  MapPin, 
  User, 
  FileText, 
  X,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onBatchUpdateStatus: (orderIds: string[], newStatus: OrderStatus) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  logisticsChannels: LogisticsChannel[];
  onPreviewShippingLabel: (order: Order) => void;
}

export const OrdersView = ({
  orders,
  onUpdateOrderStatus,
  onBatchUpdateStatus,
  onShowToast,
  logisticsChannels,
  onPreviewShippingLabel
}: OrdersViewProps) => {
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Status Tab configurations
  const statusTabs = [
    { id: 'all', label: '全部订单', count: orders.length },
    { id: 'pending_review', label: '待审核', count: orders.filter(o => o.status === 'pending_review').length },
    { id: 'allocated', label: '待配货', count: orders.filter(o => o.status === 'allocated').length },
    { id: 'label_pending', label: '待打单', count: orders.filter(o => o.status === 'label_pending').length },
    { id: 'ready_to_ship', label: '待发运', count: orders.filter(o => o.status === 'ready_to_ship').length },
    { id: 'shipped', label: '已发货', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'intercepted', label: '拦截异常', count: orders.filter(o => o.status === 'intercepted').length },
    { id: 'refunded', label: '售后退款', count: orders.filter(o => o.status === 'refunded').length }
  ];

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = activeStatusTab === 'all' || order.status === activeStatusTab;
      const matchesPlatform = selectedPlatform === 'all' || order.platform === selectedPlatform;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        order.id.toLowerCase().includes(q) ||
        order.platformOrderId.toLowerCase().includes(q) ||
        order.buyer.name.toLowerCase().includes(q) ||
        order.logistics.trackingNumber.toLowerCase().includes(q) ||
        order.items.some(it => it.sku.toLowerCase().includes(q) || it.name.toLowerCase().includes(q));

      return matchesStatus && matchesPlatform && matchesSearch;
    });
  }, [orders, activeStatusTab, selectedPlatform, searchQuery]);

  // Handle select all
  const handleToggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Batch actions
  const handleBatchAudit = () => {
    if (selectedOrders.length === 0) return;
    onBatchUpdateStatus(selectedOrders, 'allocated');
    onShowToast('批量审核通过', `已将选中的 ${selectedOrders.length} 笔订单流转至【待配货】队列`, 'success');
    setSelectedOrders([]);
  };

  const handleBatchPrint = () => {
    if (selectedOrders.length === 0) return;
    onBatchUpdateStatus(selectedOrders, 'ready_to_ship');
    onShowToast('面单批量生成完毕', `已为 ${selectedOrders.length} 笔订单生成国际运单，状态流转为【待发运】`, 'success');
    setSelectedOrders([]);
  };

  const handleBatchShip = () => {
    if (selectedOrders.length === 0) return;
    onBatchUpdateStatus(selectedOrders, 'shipped');
    onShowToast('批量交运发货完成', `已通知物流商揽收交运，订单状态更新为【已发货】`, 'success');
    setSelectedOrders([]);
  };

  const handleBatchIntercept = () => {
    if (selectedOrders.length === 0) return;
    onBatchUpdateStatus(selectedOrders, 'intercepted');
    onShowToast('订单已拦截', `已将 ${selectedOrders.length} 笔订单标记为拦截异常并暂停流转`, 'warning');
    setSelectedOrders([]);
  };

  const getPlatformBadge = (platform: PlatformType) => {
    switch(platform) {
      case 'amazon':
        return <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-amber-100 text-amber-800">Amazon</span>;
      case 'tiktok':
        return <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-slate-900 text-white">TikTok</span>;
      case 'shopee':
        return <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-orange-100 text-orange-800">Shopee</span>;
      case 'aliexpress':
        return <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-red-100 text-red-800">AliExpress</span>;
      case 'ebay':
        return <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-blue-100 text-blue-800">eBay</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-800">{platform}</span>;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_review':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">待审核</span>;
      case 'allocated':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">待配货</span>;
      case 'label_pending':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">待打单</span>;
      case 'ready_to_ship':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">待发运</span>;
      case 'shipped':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">已发货</span>;
      case 'intercepted':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">已拦截</span>;
      case 'refunded':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-300">已退款</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const copyAddressToClipboard = (order: Order) => {
    const text = `${order.buyer.name}\n${order.buyer.street}\n${order.buyer.city}, ${order.buyer.state} ${order.buyer.zipCode}\n${order.buyer.country}\nTel: ${order.buyer.phone}`;
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    onShowToast('地址已复制', '海外收件人地址已复制至剪贴板', 'info');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div id="orders-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header & Main Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">跨境订单履约中心 (OMS)</h1>
          <p className="text-xs text-slate-500 mt-0.5">多平台订单聚合、智能风控审单、配货调拨、国际面单批量打印与交运跟踪</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onShowToast('平台订单同步已触发', '正在拉取 Amazon、TikTok Shop 等各店铺最新订单...', 'info');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            立即拉取新订单
          </button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            id={`order-status-tab-${tab.id}`}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
              activeStatusTab === tab.id
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeStatusTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索：内部单号、平台单号、买家姓名、跟踪号、SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-hidden"
          >
            <option value="all">所有销售平台</option>
            <option value="amazon">Amazon (亚马逊)</option>
            <option value="tiktok">TikTok Shop</option>
            <option value="shopee">Shopee (虾皮)</option>
            <option value="aliexpress">AliExpress (速卖通)</option>
            <option value="ebay">eBay</option>
          </select>
        </div>

        {/* Batch Operations Bar */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg w-full md:w-auto animate-in fade-in-50 text-xs">
            <span className="text-indigo-800 font-semibold">已选 {selectedOrders.length} 项</span>
            <div className="h-4 w-px bg-indigo-200" />
            <button
              onClick={handleBatchAudit}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded font-medium transition-colors"
            >
              批量审核
            </button>
            <button
              onClick={handleBatchPrint}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-300 rounded font-medium transition-colors"
            >
              生成面单
            </button>
            <button
              onClick={handleBatchShip}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded font-medium transition-colors"
            >
              标记出库发货
            </button>
            <button
              onClick={handleBatchIntercept}
              className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded font-medium transition-colors"
            >
              批量拦截
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-500 bg-slate-50/80 border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3 px-3">订单标识 / 平台</th>
                <th className="py-3 px-3">买家与收件国家</th>
                <th className="py-3 px-3">商品明细 (SKU)</th>
                <th className="py-3 px-3">发货仓 / 物流渠道</th>
                <th className="py-3 px-3">金额与预估利润</th>
                <th className="py-3 px-3">流转状态</th>
                <th className="py-3 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">没有找到符合条件的订单</p>
                    <p className="text-xs text-slate-400 mt-1">请尝试更换搜索关键字或状态筛选标签</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isChecked = selectedOrders.includes(order.id);

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-indigo-50/30' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOrder(order.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Order info & Platform */}
                      <td className="py-3 px-3 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {getPlatformBadge(order.platform)}
                          <span className="font-bold text-slate-900 font-mono">{order.id}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">平台单号: {order.platformOrderId}</p>
                        <p className="text-[10px] text-slate-400">{order.storeName}</p>
                      </td>

                      {/* Buyer info */}
                      <td className="py-3 px-3 space-y-0.5">
                        <p className="font-semibold text-slate-800">{order.buyer.name}</p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <span className="font-medium text-indigo-600 font-mono">[{order.buyer.countryCode}]</span>
                          <span>{order.buyer.city}, {order.buyer.state}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{order.buyer.phone}</p>
                      </td>

                      {/* Item info */}
                      <td className="py-3 px-3">
                        <div className="space-y-1.5 max-w-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" 
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 truncate text-[11px]">{item.name}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                  <span className="text-indigo-600 font-semibold">{item.sku}</span>
                                  <span>x {item.quantity} 件</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Warehouse & Carrier */}
                      <td className="py-3 px-3 space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{order.warehouseName}</span>
                        </div>
                        <p className="text-[11px] text-indigo-600 font-medium">{order.logistics.carrier}</p>
                        {order.logistics.trackingNumber && (
                          <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                            {order.logistics.trackingNumber}
                          </p>
                        )}
                      </td>

                      {/* Financials & Profit */}
                      <td className="py-3 px-3 space-y-0.5">
                        <p className="font-bold text-slate-900 font-mono">
                          {order.currency === 'EUR' ? '€' : '$'}{order.subtotal.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-emerald-600 font-semibold">
                            净赚 +${order.estimatedProfit.toFixed(2)}
                          </span>
                          <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600">
                            {order.marginPercent}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium text-xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>详情</span>
                        </button>

                        <button
                          onClick={() => onPreviewShippingLabel(order)}
                          className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded transition-colors font-medium text-xs inline-flex items-center gap-1"
                          title="查看并打印100x150mm热敏国际运单"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>面单</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in-50">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base font-mono">{inspectingOrder.id}</span>
                  {getStatusBadge(inspectingOrder.status)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  平台单号: {inspectingOrder.platformOrderId} ({inspectingOrder.storeName})
                </p>
              </div>
              <button 
                onClick={() => setInspectingOrder(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              {/* Buyer & Shipping Address */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    海外收件人配送信息
                  </span>
                  <button
                    onClick={() => copyAddressToClipboard(inspectingOrder)}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? '已复制' : '复制收件地址'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 font-sans">
                  <div>
                    <span className="text-slate-400">收件姓名:</span> <strong className="text-slate-900">{inspectingOrder.buyer.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">联系电话:</span> <span className="font-mono">{inspectingOrder.buyer.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">详细街道:</span> <span>{inspectingOrder.buyer.street}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">城市/省州:</span> <span>{inspectingOrder.buyer.city}, {inspectingOrder.buyer.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">邮政编码:</span> <span className="font-mono font-bold">{inspectingOrder.buyer.zipCode}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">目的国家:</span> <span className="font-semibold text-slate-900">{inspectingOrder.buyer.country} ({inspectingOrder.buyer.countryCode})</span>
                  </div>
                </div>

                {inspectingOrder.buyerNote && (
                  <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    <strong>买家留言:</strong> {inspectingOrder.buyerNote}
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  订单商品明细清单 ({inspectingOrder.items.length} 款)
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {inspectingOrder.items.map((it, i) => (
                    <div key={i} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{it.name}</p>
                          <p className="text-[11px] text-slate-500">{it.variant}</p>
                          <p className="text-[10px] text-indigo-600 font-mono">SKU: {it.sku} | 单重: {it.weightG}g</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${it.unitPrice.toFixed(2)}</p>
                        <p className="text-slate-500 font-mono">数量: {it.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics & Tracking timeline */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    物流渠道与节点轨迹跟踪
                  </span>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {inspectingOrder.logistics.trackingNumber}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>发货渠道: <strong>{inspectingOrder.logistics.channelName}</strong></span>
                  <span>时效预估: {inspectingOrder.logistics.estimatedDays}</span>
                </div>

                {/* Milestones */}
                <div className="space-y-3 pt-2">
                  {inspectingOrder.logistics.milestones.map((ms, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${ms.completed ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{ms.location}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{ms.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{ms.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  单票利润与财务成本核算
                </h3>
                <div className="space-y-1.5 text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>商品销售额 (Subtotal):</span>
                    <span className="font-mono text-slate-900">${inspectingOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平台佣金扣除 (Commission ~15%):</span>
                    <span className="font-mono text-rose-600">-${inspectingOrder.platformCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>国际专线实际运费:</span>
                    <span className="font-mono text-rose-600">-${inspectingOrder.actualShippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>商品采购商品总成本:</span>
                    <span className="font-mono text-rose-600">-${(inspectingOrder.totalCost - inspectingOrder.actualShippingCost).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-900">单笔订单实际净利润:</span>
                    <span className="text-emerald-600 font-mono">+${inspectingOrder.estimatedProfit.toFixed(2)} ({inspectingOrder.marginPercent}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {inspectingOrder.status === 'pending_review' && (
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(inspectingOrder.id, 'allocated');
                      onShowToast('审核成功', `订单 ${inspectingOrder.id} 已通过风控审核并分配库存`, 'success');
                      setInspectingOrder(null);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs"
                  >
                    审核通过
                  </button>
                )}

                {inspectingOrder.status === 'allocated' && (
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(inspectingOrder.id, 'ready_to_ship');
                      onShowToast('打单完成', `订单 ${inspectingOrder.id} 已成功生成面单并流转待发运`, 'success');
                      setInspectingOrder(null);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs"
                  >
                    生成面单并打单
                  </button>
                )}

                {inspectingOrder.status === 'ready_to_ship' && (
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(inspectingOrder.id, 'shipped');
                      onShowToast('发货成功', `订单 ${inspectingOrder.id} 已交接物流商`, 'success');
                      setInspectingOrder(null);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
                  >
                    标记已交运发货
                  </button>
                )}

                {inspectingOrder.status !== 'intercepted' && (
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(inspectingOrder.id, 'intercepted');
                      onShowToast('已拦截', `订单 ${inspectingOrder.id} 已拦截并挂起`, 'warning');
                      setInspectingOrder(null);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold rounded-lg text-xs"
                  >
                    拦截订单
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  onPreviewShippingLabel(inspectingOrder);
                  setInspectingOrder(null);
                }}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印 100x150mm 面单</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
