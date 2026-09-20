import { useState } from 'react';
import { 
  LogisticsChannel, 
  Order 
} from '../../types/erp';
import { 
  Truck, 
  Search, 
  Calculator, 
  Printer, 
  Globe2, 
  Clock, 
  Zap, 
  Check, 
  ShieldCheck, 
  BatteryCharging,
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface LogisticsViewProps {
  channels: LogisticsChannel[];
  orders: Order[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onPreviewShippingLabel: (order: Order) => void;
}

export const LogisticsView = ({
  channels,
  orders,
  onShowToast,
  onPreviewShippingLabel
}: LogisticsViewProps) => {
  // Rate trial states
  const [targetCountry, setTargetCountry] = useState('US');
  const [calcWeight, setCalcWeight] = useState(380);
  const [isBattery, setIsBattery] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'tracking' | 'calculator'>('channels');

  // Tracking query state
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [queriedOrder, setQueriedOrder] = useState<Order | null>(null);

  // Rate calculator logic
  const calculateRate = (channel: LogisticsChannel, weightG: number) => {
    if (weightG <= channel.baseWeightG) {
      return channel.baseFeeRmb;
    }
    const extraWeight = weightG - channel.baseWeightG;
    const steps = Math.ceil(extraWeight / channel.stepWeightG);
    return channel.baseFeeRmb + steps * channel.stepFeeRmb;
  };

  const calculatedChannelQuotes = channels
    .filter(c => {
      const countryMatch = c.targetRegions.includes('GLOBAL') || c.targetRegions.includes(targetCountry);
      const batteryMatch = !isBattery || c.batterySupport;
      return countryMatch && batteryMatch;
    })
    .map(c => ({
      ...c,
      estimatedCostRmb: calculateRate(c, calcWeight)
    }))
    .sort((a, b) => a.estimatedCostRmb - b.estimatedCostRmb);

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackingNumberInput.trim().toLowerCase();
    if (!q) return;

    const matched = orders.find(o => 
      o.logistics.trackingNumber.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.platformOrderId.toLowerCase().includes(q)
    );

    if (matched) {
      setQueriedOrder(matched);
      onShowToast('查询成功', `已检索到运单号 [${matched.logistics.trackingNumber}] 的实时物流追踪节点`, 'success');
    } else {
      onShowToast('未查到运单', `未检索到匹配的单号或包裹跟踪记录，请核对输入`, 'warning');
    }
  };

  return (
    <div id="logistics-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">跨境物流与面单中心 (TMS)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            对接主流专线服务商（云途、递四方、DHL、燕文）、多渠道智能运费比价、国际热敏面单与全链路节点追踪
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>实时运费智能试算</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'channels'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>合作专线渠道列表</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {channels.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'calculator'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>多渠道运费比价与时效测算</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'tracking'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>国际包裹轨迹实时查件</span>
        </button>
      </div>

      {/* Tab 1: Channels List */}
      {activeTab === 'channels' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50/80 border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-3 px-3">渠道名称与服务商</th>
                  <th className="py-3 px-3">渠道属性</th>
                  <th className="py-3 px-3">目的国家/地区</th>
                  <th className="py-3 px-3">承诺妥投时效</th>
                  <th className="py-3 px-3">首重计费规则</th>
                  <th className="py-3 px-3">续重计费规则</th>
                  <th className="py-3 px-3 text-center">带电资质</th>
                  <th className="py-3 px-3 text-right">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {channels.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 text-xs">{ch.name}</p>
                      <p className="text-[11px] text-indigo-600 font-medium mt-0.5">{ch.carrier}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {ch.serviceType === 'special_line' ? '专线小包' : ch.serviceType === 'express' ? '商业特快' : 'FBA头程'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {ch.targetRegions.map((reg) => (
                          <span key={reg} className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-slate-100 text-slate-600 font-semibold">
                            {reg}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {ch.agingMinDays}-{ch.agingMaxDays} 工作日
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      首重 {ch.baseWeightG}g / ¥{ch.baseFeeRmb.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      续重每 {ch.stepWeightG}g / ¥{ch.stepFeeRmb.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {ch.batterySupport ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          支持内置电
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                          纯普货
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        正常接收
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Rate Calculator & Compare */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Input Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              国际运费测算参数输入
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                目的收件国家 / 地区
              </label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                <option value="US">美国 (United States)</option>
                <option value="DE">德国 (Germany)</option>
                <option value="UK">英国 (United Kingdom)</option>
                <option value="SG">新加坡 (Singapore)</option>
                <option value="ES">西班牙 (Spain)</option>
                <option value="FR">法国 (France)</option>
                <option value="AU">澳大利亚 (Australia)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                包裹实重 / 计费重量 (克 G)
              </label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                长×宽×高 / 8000 计泡；当前测算以实重 <strong>{calcWeight}g</strong> 计
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBattery}
                  onChange={(e) => setIsBattery(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-600" />
                  包裹包含锂电池 / 内置电路板
                </span>
              </label>
              <p className="text-[10px] text-slate-400 mt-1 pl-5">
                勾选后系统将自动剔除不支持危险品电池的纯普货专线
              </p>
            </div>
          </div>

          {/* Right: Compare Quotes */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>
                匹配到 <strong>{calculatedChannelQuotes.length}</strong> 条出海专线 (按预估运费从低到高排序)
              </span>
              <span className="text-slate-400">目的国家: {targetCountry} | 重量: {calcWeight}g</span>
            </div>

            <div className="space-y-2.5">
              {calculatedChannelQuotes.map((ch, idx) => (
                <div 
                  key={ch.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    idx === 0 
                      ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          最优性价比推荐
                        </span>
                      )}
                      <h4 className="font-bold text-slate-900 text-xs">{ch.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      承运商: {ch.carrier} • 承诺妥投时效: <strong className="text-slate-800">{ch.agingMinDays}-{ch.agingMaxDays} 天</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 font-mono">
                      ¥{ch.estimatedCostRmb.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      约 ${(ch.estimatedCostRmb / 7.235).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Package Tracking Inquiry */}
      {activeTab === 'tracking' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <form onSubmit={handleSearchTracking} className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="输入国际物流跟踪号，例如：YT260919882901US、4PX3928109482110..."
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-indigo-500 outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                实时查件
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>快捷测试:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingNumberInput('YT260919882901US');
                  const o = orders.find(ord => ord.logistics.trackingNumber === 'YT260919882901US');
                  if (o) setQueriedOrder(o);
                }}
                className="underline hover:text-indigo-600 font-mono"
              >
                YT260919882901US (云途)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingNumberInput('1Z9999999999999999');
                  const o = orders.find(ord => ord.logistics.trackingNumber === '1Z9999999999999999');
                  if (o) setQueriedOrder(o);
                }}
                className="underline hover:text-indigo-600 font-mono"
              >
                1Z9999999999999999 (UPS)
              </button>
            </div>
          </div>

          {/* Tracking detail timeline card */}
          {queriedOrder && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono text-base">{queriedOrder.logistics.trackingNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {queriedOrder.logistics.carrier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    对应内部订单: <strong className="font-mono text-slate-800">{queriedOrder.id}</strong> ({queriedOrder.storeName})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewShippingLabel(queriedOrder)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>重打面单</span>
                  </button>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-4 pl-2">
                {queriedOrder.logistics.milestones.map((ms, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${ms.completed ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{ms.location}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{ms.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{ms.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
