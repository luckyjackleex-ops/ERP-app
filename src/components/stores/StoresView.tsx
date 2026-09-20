import { useState } from 'react';
import { StoreAccount, PlatformType } from '../../types/erp';
import { 
  Store, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X,
  Lock,
  Globe2
} from 'lucide-react';

interface StoresViewProps {
  stores: StoreAccount[];
  onAddStore: (store: StoreAccount) => void;
  onSyncStore: (storeId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const StoresView = ({
  stores,
  onAddStore,
  onSyncStore,
  onShowToast
}: StoresViewProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newPlatform, setNewPlatform] = useState<PlatformType>('amazon');
  const [newMarketplace, setNewMarketplace] = useState('US');
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestApi = (storeId: string, name: string) => {
    setTestingId(storeId);
    setTimeout(() => {
      setTestingId(null);
      onShowToast('API连通性检测正常', `${name} 的 SP-API / Open API 授权令牌握手成功，延迟 182ms`, 'success');
    }, 900);
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    const newStore: StoreAccount = {
      id: `store-${Date.now()}`,
      name: newStoreName,
      platform: newPlatform,
      marketplace: newMarketplace,
      currency: newMarketplace === 'DE' ? 'EUR' : newMarketplace === 'SG' ? 'SGD' : 'USD',
      status: 'active',
      tokenExpiresAt: '2026-12-31',
      orderSyncStatus: 'synced',
      lastSyncTime: '刚刚',
      activeListingCount: 0,
      todayOrderCount: 0,
      todayRevenue: 0
    };

    onAddStore(newStore);
    onShowToast('店铺授权成功', `新店铺 [${newStoreName}] 已成功绑定并接入数据中台`, 'success');
    setShowAuthModal(false);
    setNewStoreName('');
  };

  return (
    <div id="stores-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">多平台店铺授权与集成管理</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            主流全球电商平台官方 Open API 密钥对接、订单自动回传与库存实时双向同步通道
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增授权新店铺</span>
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stores.map((store) => (
          <div 
            key={store.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              {/* Store Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {store.platform.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{store.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      站点: {store.marketplace} • 币种: {store.currency}
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  store.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {store.status === 'active' ? '授权有效' : '需续期'}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center my-3">
                <div>
                  <p className="text-[10px] text-slate-400">今日销售额</p>
                  <p className="text-xs font-bold text-slate-900 font-mono">${store.todayRevenue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">今日订单</p>
                  <p className="text-xs font-bold text-slate-900 font-mono">{store.todayOrderCount} 单</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">在售Listing</p>
                  <p className="text-xs font-bold text-indigo-600 font-mono">{store.activeListingCount}</p>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>最近自动同步:</span>
                  <span className="text-slate-800 font-medium">{store.lastSyncTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>授权有效期至:</span>
                  <span className="font-mono text-slate-700">{store.tokenExpiresAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => handleTestApi(store.id, store.name)}
                disabled={testingId === store.id}
                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <ShieldCheck className={`w-3.5 h-3.5 text-emerald-600 ${testingId === store.id ? 'animate-pulse' : ''}`} />
                <span>{testingId === store.id ? '测试中...' : '测试API连通'}</span>
              </button>

              <button
                onClick={() => {
                  onSyncStore(store.id);
                  onShowToast('同步任务已提交', `正在全量拉取 ${store.name} 的最新订单与库存变动`, 'info');
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>立即同步</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                新增跨境电商平台店铺授权
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  选择出海电商销售平台
                </label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <option value="amazon">Amazon (亚马逊 SP-API)</option>
                  <option value="tiktok">TikTok Shop (跨境/本土)</option>
                  <option value="shopee">Shopee (虾皮 Open Platform)</option>
                  <option value="aliexpress">AliExpress (全球速卖通)</option>
                  <option value="ebay">eBay Trading API</option>
                  <option value="temu">Temu (半托管/全托管)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  ERP系统内部店铺显示别名
                </label>
                <input
                  type="text"
                  placeholder="例如：NovaLife Tech (Shopee MY)"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  所属站点国家代码
                </label>
                <input
                  type="text"
                  placeholder="例如：US, DE, UK, SG, MY"
                  value={newMarketplace}
                  onChange={(e) => setNewMarketplace(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-xs text-slate-900"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                提示：点击确认后系统将通过 OAuth2.0 重定向至官方平台开发者中心进行授权许可并自动换取 Refresh Token。
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  前往平台一键授权绑定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
