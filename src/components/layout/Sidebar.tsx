import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Truck, 
  Receipt, 
  Store, 
  Settings,
  MessageSquareText,
  BadgeAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTabId = 
  | 'dashboard' 
  | 'orders' 
  | 'products' 
  | 'inventory' 
  | 'procurement' 
  | 'logistics' 
  | 'finance' 
  | 'support' 
  | 'stores' 
  | 'settings';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  badges: {
    pendingOrdersCount: number;
    lowStockCount: number;
    unreadMessagesCount: number;
    restockSuggestionsCount: number;
  };
}

export const Sidebar = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  badges
}: SidebarProps) => {
  const menuGroups = [
    {
      group: '核心业务',
      items: [
        { id: 'dashboard' as NavTabId, label: '工作台看板', icon: LayoutDashboard },
        { 
          id: 'orders' as NavTabId, 
          label: '订单中心 OMS', 
          icon: ShoppingCart, 
          badge: badges.pendingOrdersCount > 0 ? badges.pendingOrdersCount : undefined,
          badgeColor: 'bg-indigo-500'
        },
        { id: 'products' as NavTabId, label: '商品与刊登', icon: Package },
      ]
    },
    {
      group: '供应链与履约',
      items: [
        { 
          id: 'inventory' as NavTabId, 
          label: '仓储与库存 WMS', 
          icon: Boxes,
          badge: badges.lowStockCount > 0 ? badges.lowStockCount : undefined,
          badgeColor: 'bg-rose-500'
        },
        { 
          id: 'procurement' as NavTabId, 
          label: '采购与供应链', 
          icon: BadgeAlert,
          badge: badges.restockSuggestionsCount > 0 ? badges.restockSuggestionsCount : undefined,
          badgeColor: 'bg-amber-500'
        },
        { id: 'logistics' as NavTabId, label: '跨境物流中心', icon: Truck },
      ]
    },
    {
      group: '运营与财务',
      items: [
        { id: 'finance' as NavTabId, label: '财务与利润核算', icon: Receipt },
        { 
          id: 'support' as NavTabId, 
          label: '客户服务 CRM', 
          icon: MessageSquareText,
          badge: badges.unreadMessagesCount > 0 ? badges.unreadMessagesCount : undefined,
          badgeColor: 'bg-emerald-500'
        },
        { id: 'stores' as NavTabId, label: '多平台店铺授权', icon: Store },
        { id: 'settings' as NavTabId, label: '自动化与设置', icon: Settings },
      ]
    }
  ];

  return (
    <aside 
      id="app-sidebar"
      className={`bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all duration-300 border-r border-slate-800 ${
        collapsed ? 'w-18' : 'w-60'
      }`}
    >
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {!collapsed && item.badge !== undefined && (
                    <span className={`text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}

                  {collapsed && item.badge !== undefined && (
                    <span className={`absolute top-1.5 right-2 w-2 h-2 rounded-full ${item.badgeColor} ring-2 ring-slate-900`} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        {!collapsed && (
          <div className="text-[11px] text-slate-500 pl-1">
            v2.6.4 Enterprise
          </div>
        )}
        <button
          id="toggle-sidebar-button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors mx-auto"
          aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
