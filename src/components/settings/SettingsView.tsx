import { useState } from 'react';
import { AutomationRule } from '../../types/erp';
import { 
  Settings, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Check, 
  Plus, 
  Lock, 
  Users,
  BellRing
} from 'lucide-react';

interface SettingsViewProps {
  automationRules: AutomationRule[];
  onToggleRule: (ruleId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SettingsView = ({
  automationRules,
  onToggleRule,
  onShowToast
}: SettingsViewProps) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'roles' | 'system'>('rules');

  const rolesList = [
    {
      role: '跨境运营主管 (Operations Lead)',
      desc: '具备订单审核、多平台商品刊登、定价核算、客户售后工单与店铺授权管理权限',
      usersCount: 3,
      badge: '最高业务权限'
    },
    {
      role: '仓储物流专员 (WMS Dispatcher)',
      desc: '具备拣货波次分配、100x150mm热敏面单批量打印、打包验货、国际交运扫描权限',
      usersCount: 6,
      badge: '仓储履约'
    },
    {
      role: '采购与供应链经理 (SCM Manager)',
      desc: '基于销速补货建议审核、供应商合同建立、PO采购单下达与到货验收入库权限',
      usersCount: 2,
      badge: '供应链采购'
    },
    {
      role: '跨境财务核算师 (Financial Auditor)',
      desc: '多币种结算报表导出、平台佣金及海外专线运费账单对账、单票毛利率深度审计权限',
      usersCount: 2,
      badge: '财务结算'
    }
  ];

  return (
    <div id="settings-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">自动化规则与系统设置</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          配置全链路自动审单流转、智能专线匹配、采购触发器与企业多角色权限矩阵
        </p>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'rules'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>自动化流程规则引擎</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">
            {automationRules.filter(r => r.enabled).length} 条启用中
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>角色与岗位权限矩阵 (RBAC)</span>
        </button>
      </div>

      {/* Tab 1: Automation Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950">
              <p className="font-bold">7×24小时无缝无人值守订单流转系统</p>
              <p className="mt-0.5 text-indigo-800 leading-relaxed">
                当各平台产生新订单或库存变动时，系统将依序执行下方启用的自动化规则。符合条件的订单将自动完成风控校验、分仓锁定与面单生成。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div 
                key={rule.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {rule.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{rule.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                    {rule.description}
                  </p>
                  <p className="text-[11px] text-indigo-600 font-medium pt-1">
                    触发执行动作: <strong className="font-semibold">{rule.action}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => {
                        onToggleRule(rule.id);
                        onShowToast(
                          rule.enabled ? '规则已停用' : '规则已激活', 
                          `规则 [${rule.name}] 状态已切换`, 
                          'info'
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesList.map((r, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{r.role}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {r.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {r.desc}
              </p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>系统已配置成员: <strong className="text-slate-700">{r.usersCount} 位</strong></span>
                <span className="text-emerald-600 font-medium">权限策略正常生效</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
