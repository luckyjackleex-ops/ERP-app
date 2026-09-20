import { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Loader2, 
  Globe2, 
  Tag, 
  ShieldCheck, 
  FileText, 
  Zap,
  ShoppingBag
} from 'lucide-react';
import { generateAIListing, AIListingResult } from '../../services/aiService';

interface AIListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductName?: string;
  defaultCategory?: string;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AIListingModal = ({
  isOpen,
  onClose,
  defaultProductName = '',
  defaultCategory = '3C数码配件',
  onShowToast,
}: AIListingModalProps) => {
  const [productName, setProductName] = useState(defaultProductName || 'ANC 主动降噪头戴式蓝牙耳机 Pro');
  const [category, setCategory] = useState(defaultCategory || '3C数码配件');
  const [platform, setPlatform] = useState<'amazon' | 'tiktok' | 'shopee'>('amazon');
  const [targetMarket, setTargetMarket] = useState<'US' | 'DE' | 'UK' | 'JP'>('US');
  const [sellingPoints, setSellingPoints] = useState('45dB深度混合降噪、40小时超长续航、低延迟电竞游戏模式、蛋白皮亲肤耳罩');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AIListingResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast('复制成功', '内容已成功复制到剪贴板', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async () => {
    if (!productName.trim()) {
      onShowToast('请输入商品名称', undefined, 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateAIListing({
        productName,
        category,
        platform,
        targetMarket,
        sellingPoints,
      });

      if (response.data) {
        setResult(response.data);
        onShowToast('Listing 生成成功', `Gemini 大模型已就绪针对 ${platform.toUpperCase()} (${targetMarket}) 的文案`, 'success');
      }
    } catch (err: any) {
      onShowToast('生成失败', err.message || '请检查后端服务', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">AI 跨境爆款 Listing 智能刊登引擎</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  后端安全代理调用
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                基于 Gemini 3.8 Flash 模型，深度适配 Amazon A10、TikTok Shop 算法权重规则
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          {/* Input Configuration Grid */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">商品中文名 / 核心词</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="如: ANC主动降噪耳机"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">商品类目</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">目标电商平台</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-hidden bg-white font-medium"
                >
                  <option value="amazon">Amazon (亚马逊北美/欧洲)</option>
                  <option value="tiktok">TikTok Shop (美区/东南亚)</option>
                  <option value="shopee">Shopee (虾皮本土/跨境)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">目标站点语言市场</label>
                <select
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-hidden bg-white font-medium"
                >
                  <option value="US">美国 (英语 US)</option>
                  <option value="DE">德国 (德语 DE)</option>
                  <option value="UK">英国 (英语 UK)</option>
                  <option value="JP">日本 (日语 JP)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                核心功能卖点与规格参数 (AI 将提炼为高权重关键词与场景痛点)
              </label>
              <textarea
                rows={2}
                value={sellingPoints}
                onChange={(e) => setSellingPoints(e.target.value)}
                placeholder="例如: 降噪深度、电池续航、质保承诺、包装清单..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-hidden bg-white leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                自动优化搜索词频密度与违禁词规避检测
              </span>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini 3.8 Flash 正在思考生成中...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>一键调用后端 AI 极速生成</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* 1. Optimized Title */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      高转化高权重标题 (Title)
                    </h3>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">
                      {result.optimizedTitle.length} 字符
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(result.optimizedTitle, 'title')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
                  >
                    {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'title' ? '已复制' : '复制标题'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 leading-relaxed border border-slate-200 font-sans select-all">
                  {result.optimizedTitle}
                </div>
              </div>

              {/* 2. Five Bullet Points */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      五点描述 (Bullet Points)
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopy(result.bulletPoints.join('\n\n'), 'bullets')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
                  >
                    {copiedKey === 'bullets' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'bullets' ? '全部复制' : '一键复制五点'}</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {result.bulletPoints.map((bp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="flex-1 font-sans select-all">{bp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Search Terms & PPC Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">
                      后台 Search Terms 关键词 (250 Bytes)
                    </h4>
                    <button
                      onClick={() => handleCopy(result.searchTerms, 'st')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'st' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>复制</span>
                    </button>
                  </div>
                  <p className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200 select-all">
                    {result.searchTerms}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">
                    高转化广告推荐词 (PPC Keywords)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.recommendedAdKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs rounded-md font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            关闭窗口
          </button>
        </div>
      </div>
    </div>
  );
};
