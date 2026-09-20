import { useState } from 'react';
import { 
  StoreAccount, 
  ExchangeRate 
} from '../../types/erp';
import { 
  RefreshCw, 
  Search, 
  Bell, 
  Globe2, 
  DollarSign, 
  ChevronDown, 
  User, 
  Check,
  Building2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  stores: StoreAccount[];
  selectedStoreId: string;
  onSelectStore: (storeId: string) => void;
  currencyRates: ExchangeRate[];
  activeCurrency: string;
  onChangeCurrency: (currency: string) => void;
  onTriggerGlobalSync: () => void;
  isSyncing: boolean;
  onSearch: (term: string) => void;
  searchTerm: string;
}

export const Navbar = ({
  stores,
  selectedStoreId,
  onSelectStore,
  currencyRates,
  activeCurrency,
  onChangeCurrency,
  onTriggerGlobalSync,
  isSyncing,
  onSearch,
  searchTerm
}: NavbarProps) => {
  const [showStoreMenu, setShowStoreMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNoticeMenu, setShowNoticeMenu] = useState(false);
  const [activeRole, setActiveRole] = useState('跨境运营主管 (Lucky)');

  const currentStore = stores.find(s => s.id === selectedStoreId);

  return (
    <header id="app-navbar" className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 h-16 flex items-center justify-between shadow-xs">
      {/* Left: Brand Identity & Store Selector */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Globe2 className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base">NovaERP</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">跨境中台</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">全链路多平台出海协同系统</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* Store Selector Dropdown */}
        <div className="relative">
          <button
            id="navbar-store-selector-button"
            onClick={() => setShowStoreMenu(!showStoreMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700 max-w-[200px] sm:max-w-xs truncate"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">
              {selectedStoreId === 'all' ? '全部店铺 (All Stores)' : currentStore?.name || '选择店铺'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {showStoreMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                选择操作店铺
              </div>
              <button
                id="select-all-stores-option"
                onClick={() => {
                  onSelectStore('all');
                  setShowStoreMenu(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedStoreId === 'all' ? 'bg-indigo-50/70 text-indigo-700 font-semibold' : 'text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>全部店铺 (汇总视图)</span>
                </div>
                {selectedStoreId === 'all' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>

              <div className="h-px bg-slate-100 my-1" />

              {stores.map((s) => (
                <button
                  key={s.id}
                  id={`select-store-${s.id}`}
                  onClick={() => {
                    onSelectStore(s.id);
                    setShowStoreMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedStoreId === s.id ? 'bg-indigo-50/70 text-indigo-700 font-semibold' : 'text-slate-700'}`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="truncate">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">[{s.marketplace}]</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Universal Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="全局搜索：输入订单号、跟踪号、SKU、买家姓名..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs transition-all text-slate-800 placeholder:text-slate-400 outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded px-1"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Right: Sync action, currency, notices, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Instant Multi-platform Sync button */}
        <button
          id="global-sync-button"
          onClick={onTriggerGlobalSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          title="立即拉取所有授权平台的最新订单与库存"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? '同步中...' : '同步多平台'}</span>
        </button>

        {/* Currency Switcher */}
        <div className="relative">
          <button
            id="currency-switcher-button"
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>{activeCurrency}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showCurrencyMenu && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase">结算显示币种</div>
              {currencyRates.map((cr) => (
                <button
                  key={cr.currency}
                  id={`select-currency-${cr.currency}`}
                  onClick={() => {
                    onChangeCurrency(cr.currency);
                    setShowCurrencyMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 ${activeCurrency === cr.currency ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'}`}
                >
                  <span>{cr.symbol} {cr.name} ({cr.currency})</span>
                  {activeCurrency === cr.currency && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alert Bell */}
        <div className="relative">
          <button
            id="navbar-notification-bell"
            onClick={() => setShowNoticeMenu(!showNoticeMenu)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="系统待办与报警"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {showNoticeMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">运营提醒与预警</span>
                <span className="text-[10px] bg-rose-50 text-rose-600 font-medium px-1.5 py-0.5 rounded">3项需处理</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/60 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">缺货急需补货预警</p>
                    <p className="text-[11px] text-amber-700">KB75-BRN-BLK 深圳仓仅剩 2 件，可用天数不足 1 天。</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200/60 flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">待审核订单积压</p>
                    <p className="text-[11px] text-blue-700">当前有 1 笔大额订单等待运营风控确认。</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full-Stack AI Security Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>全栈安全后端 · Gemini 3.8 Flash</span>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{activeRole}</p>
            <p className="text-[10px] text-emerald-600 font-medium leading-none mt-1">● 系统在线</p>
          </div>
        </div>
      </div>
    </header>
  );
};
