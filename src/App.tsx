import { useState, useMemo } from 'react';
import { 
  INITIAL_STORES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_WAREHOUSES, 
  INITIAL_INVENTORY, 
  INITIAL_SUPPLIERS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_RESTOCK_SUGGESTIONS, 
  INITIAL_LOGISTICS_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_EXCHANGE_RATES, 
  INITIAL_AUTOMATION_RULES 
} from './data/mockData';
import { 
  Order, 
  OrderStatus, 
  Product, 
  InventoryRecord, 
  PurchaseOrder, 
  SmartRestockSuggestion, 
  StoreAccount, 
  ExchangeRate, 
  AutomationRule 
} from './types/erp';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTabId } from './components/layout/Sidebar';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { DashboardView } from './components/dashboard/DashboardView';
import { OrdersView } from './components/orders/OrdersView';
import { ProductsView } from './components/products/ProductsView';
import { InventoryView } from './components/inventory/InventoryView';
import { ProcurementView } from './components/procurement/ProcurementView';
import { LogisticsView } from './components/logistics/LogisticsView';
import { FinanceView } from './components/finance/FinanceView';
import { SupportView } from './components/support/SupportView';
import { StoresView } from './components/stores/StoresView';
import { SettingsView } from './components/settings/SettingsView';
import { ShippingLabelModal } from './components/logistics/ShippingLabelModal';

export function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Domain state
  const [stores, setStores] = useState<StoreAccount[]>(INITIAL_STORES);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [activeCurrency, setActiveCurrency] = useState<string>('USD');
  const [currencyRates, setCurrencyRates] = useState<ExchangeRate[]>(INITIAL_EXCHANGE_RATES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [inventory, setInventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [restockSuggestions, setRestockSuggestions] = useState<SmartRestockSuggestion[]>(INITIAL_RESTOCK_SUGGESTIONS);
  const [logisticsChannels, setLogisticsChannels] = useState(INITIAL_LOGISTICS_CHANNELS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);

  // Label Modal
  const [shippingLabelOrder, setShippingLabelOrder] = useState<Order | null>(null);

  // Toast Helper
  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Filter orders by active store
  const visibleOrders = useMemo(() => {
    let result = orders;
    if (selectedStoreId !== 'all') {
      result = result.filter(o => o.storeId === selectedStoreId);
    }
    if (globalSearchTerm.trim()) {
      const q = globalSearchTerm.toLowerCase().trim();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.platformOrderId.toLowerCase().includes(q) ||
        o.buyer.name.toLowerCase().includes(q) ||
        o.logistics.trackingNumber.toLowerCase().includes(q) ||
        o.items.some(it => it.sku.toLowerCase().includes(q))
      );
    }
    return result;
  }, [orders, selectedStoreId, globalSearchTerm]);

  // Orders Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleBatchUpdateStatus = (orderIds: string[], newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => orderIds.includes(o.id) ? { ...o, status: newStatus } : o));
  };

  // Products Actions
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    // Also create matching inventory records in domestic warehouse
    const newInvRecords: InventoryRecord[] = newProd.variants.map((v, i) => ({
      id: `inv-${Date.now()}-${i}`,
      sku: v.sku,
      spu: newProd.spu,
      productName: newProd.nameCn,
      variantName: v.variantName,
      image: newProd.mainImage,
      warehouseId: 'wh-sz-01',
      warehouseName: '深圳龙岗自营主仓',
      shelfLocation: `D-0${i + 1}-0${i + 2}`,
      onHandQuantity: v.stockTotal,
      reservedQuantity: 0,
      availableQuantity: v.stockAvailable,
      inTransitQuantity: 0,
      safeStockLevel: 50,
      turnoverDays: 30,
      status: 'sufficient',
      costRmb: v.costRmb
    }));
    setInventory(prev => [...newInvRecords, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  // Inventory Adjustment
  const handleUpdateInventoryQuantity = (recordId: string, delta: number) => {
    setInventory(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      const newOnHand = Math.max(0, rec.onHandQuantity + delta);
      const newAvail = Math.max(0, newOnHand - rec.reservedQuantity);
      const newStatus = newAvail <= 0 ? 'out_of_stock' : newAvail < rec.safeStockLevel ? 'low_stock' : 'sufficient';
      return {
        ...rec,
        onHandQuantity: newOnHand,
        availableQuantity: newAvail,
        status: newStatus
      };
    }));
  };

  // SCM PO Actions
  const handleCreatePOFromSuggestion = (suggestion: SmartRestockSuggestion) => {
    const newPo: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      poNumber: `PO2609-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: 'sup-001',
      supplierName: '深圳市宏达声学电子有限公司',
      targetWarehouseId: 'wh-sz-01',
      targetWarehouseName: '深圳龙岗自营主仓',
      items: [
        {
          sku: suggestion.sku,
          name: suggestion.productName,
          quantity: suggestion.suggestedQuantity,
          unitPriceRmb: Math.round(suggestion.estimatedCostRmb / suggestion.suggestedQuantity),
          totalRmb: suggestion.estimatedCostRmb
        }
      ],
      totalAmountRmb: suggestion.estimatedCostRmb,
      status: 'in_production',
      expectedDeliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      approvedBy: '林总监'
    };

    setPurchaseOrders(prev => [newPo, ...prev]);
    // remove suggestion from list
    setRestockSuggestions(prev => prev.filter(s => s.sku !== suggestion.sku));
  };

  const handleReceivePO = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'received' } : p));

    // Automatically increase inventory for the items received
    po.items.forEach(it => {
      setInventory(prev => prev.map(inv => {
        if (inv.sku === it.sku && inv.warehouseId === po.targetWarehouseId) {
          const newOnHand = inv.onHandQuantity + it.quantity;
          const newAvail = newOnHand - inv.reservedQuantity;
          return {
            ...inv,
            onHandQuantity: newOnHand,
            availableQuantity: newAvail,
            inTransitQuantity: Math.max(0, inv.inTransitQuantity - it.quantity),
            status: newAvail > inv.safeStockLevel ? 'sufficient' : 'low_stock'
          };
        }
        return inv;
      }));
    });
  };

  // Support Actions
  const handleReplyMessage = (messageId: string, replyText: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'replied' } : m));
  };

  // Store Actions
  const handleAddStore = (newStore: StoreAccount) => {
    setStores(prev => [newStore, ...prev]);
  };

  const handleSyncStore = (storeId: string) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, lastSyncTime: '刚刚', orderSyncStatus: 'synced' } : s));
  };

  // Exchange Rate Update
  const handleUpdateExchangeRate = (currency: string, newRate: number) => {
    setCurrencyRates(prev => prev.map(r => r.currency === currency ? { ...r, rateToRmb: newRate, updatedAt: '刚刚' } : r));
  };

  // Toggle Automation Rule
  const handleToggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  // Global Sync Button handler
  const handleTriggerGlobalSync = () => {
    setIsSyncing(true);
    showToast('平台多渠道同步中', '正在拉取各电商平台最新订单与买家消息...', 'info');
    setTimeout(() => {
      setIsSyncing(false);
      setStores(prev => prev.map(s => ({ ...s, lastSyncTime: '刚刚' })));
      showToast('同步完成', '全渠道订单与库存数据已更新至最新状态', 'success');
    }, 1200);
  };

  // Badges count for navigation
  const badges = {
    pendingOrdersCount: orders.filter(o => o.status === 'pending_review' || o.status === 'allocated').length,
    lowStockCount: inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length,
    unreadMessagesCount: messages.filter(m => m.status === 'unread').length,
    restockSuggestionsCount: restockSuggestions.length
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notifications container */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* 100x150mm Shipping Label Preview Modal */}
      <ShippingLabelModal 
        order={shippingLabelOrder} 
        onClose={() => setShippingLabelOrder(null)} 
      />

      {/* Main Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        badges={badges}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          stores={stores}
          selectedStoreId={selectedStoreId}
          onSelectStore={setSelectedStoreId}
          currencyRates={currencyRates}
          activeCurrency={activeCurrency}
          onChangeCurrency={setActiveCurrency}
          onTriggerGlobalSync={handleTriggerGlobalSync}
          isSyncing={isSyncing}
          onSearch={setGlobalSearchTerm}
          searchTerm={globalSearchTerm}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {activeTab === 'dashboard' && (
            <DashboardView
              orders={visibleOrders}
              stores={stores}
              inventory={inventory}
              currencyRates={currencyRates}
              activeCurrency={activeCurrency}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={visibleOrders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onBatchUpdateStatus={handleBatchUpdateStatus}
              onShowToast={showToast}
              logisticsChannels={logisticsChannels}
              onPreviewShippingLabel={(order) => setShippingLabelOrder(order)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              logisticsChannels={logisticsChannels}
              currencyRates={currencyRates}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              warehouses={warehouses}
              inventory={inventory}
              onUpdateInventoryQuantity={handleUpdateInventoryQuantity}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementView
              purchaseOrders={purchaseOrders}
              restockSuggestions={restockSuggestions}
              suppliers={suppliers}
              onCreatePOFromSuggestion={handleCreatePOFromSuggestion}
              onReceivePO={handleReceivePO}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'logistics' && (
            <LogisticsView
              channels={logisticsChannels}
              orders={orders}
              onShowToast={showToast}
              onPreviewShippingLabel={(order) => setShippingLabelOrder(order)}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              orders={orders}
              currencyRates={currencyRates}
              onUpdateExchangeRate={handleUpdateExchangeRate}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'support' && (
            <SupportView
              messages={messages}
              onReplyMessage={handleReplyMessage}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'stores' && (
            <StoresView
              stores={stores}
              onAddStore={handleAddStore}
              onSyncStore={handleSyncStore}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              automationRules={automationRules}
              onToggleRule={handleToggleRule}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
