import { useState } from 'react';
import { CustomerMessage } from '../../types/erp';
import { 
  MessageSquareText, 
  Search, 
  Send, 
  Globe2, 
  CheckCircle2, 
  Clock, 
  User, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';

interface SupportViewProps {
  messages: CustomerMessage[];
  onReplyMessage: (messageId: string, replyText: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SupportView = ({
  messages,
  onReplyMessage,
  onShowToast
}: SupportViewProps) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string>(messages[0]?.id || '');
  const [replyDraft, setReplyDraft] = useState('');
  const [translatedDraft, setTranslatedDraft] = useState('');

  const activeMessage = messages.find(m => m.id === selectedMessageId) || messages[0];

  const quickTemplates = [
    {
      title: '发货与物流单号提醒',
      textCn: '您好！您的订单已通过国际专线发出，单号已同步至平台。包裹预计5-7个工作日内送达，有任何问题请随时联系我们。',
      textEn: 'Hello! Your order has been dispatched via international priority line. Tracking details are updated. Estimated delivery is 5-7 business days. Please feel free to reach out if you need anything!'
    },
    {
      title: '商品多点蓝牙配对指引',
      textCn: '您好！ANC Headphone Pro 支持多点双设备连接：长按蓝牙键5秒进入配对模式，在第一台设备连接后，开启第二台蓝牙搜索即可同时连接两台设备。',
      textEn: 'Hello! The ANC Headphones Pro support dual-device multipoint bluetooth. Long press the button for 5s to pair with your first device, then connect to the second device via settings.'
    },
    {
      title: '海关增值税发票开具',
      textCn: '您好！针对您所需开具的含增值税（VAT）发票，我们已根据您的订单信息生成PDF发票，请在附件查收。',
      textEn: 'Hello! Regarding your request for an invoice with VAT, we have generated the compliant invoice based on your order details. Please find it attached.'
    }
  ];

  const handleApplyTemplate = (tmpl: { textCn: string; textEn: string }) => {
    setReplyDraft(tmpl.textCn);
    setTranslatedDraft(tmpl.textEn);
    onShowToast('快捷话术已套用', '已自动填入中文草稿并完成外语对齐', 'info');
  };

  const handleSendReply = () => {
    if (!replyDraft.trim()) return;
    onReplyMessage(activeMessage.id, translatedDraft || replyDraft);
    onShowToast('回复已发送', `已成功将多语言回复推送到 ${activeMessage.storeName} 买家信箱`, 'success');
    setReplyDraft('');
    setTranslatedDraft('');
  };

  return (
    <div id="support-view" className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">跨境客户服务与多语言工单 (CRM)</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          跨平台买家消息聚合、多语言双向即时翻译助手、售前咨询与售后差评阻断管理
        </p>
      </div>

      {/* Main split view */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-3 min-h-[600px] overflow-hidden">
        {/* Left: Messages List */}
        <div className="border-r border-slate-200 flex flex-col">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">买家咨询消息 ({messages.length})</span>
            <span className="text-[10px] bg-rose-50 text-rose-600 font-semibold px-1.5 py-0.5 rounded">
              {messages.filter(m => m.status === 'unread').length} 封未回复
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {messages.map((msg) => {
              const isSelected = selectedMessageId === msg.id;

              return (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`w-full p-4 text-left transition-colors flex flex-col gap-1.5 ${
                    isSelected ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[150px]">
                      {msg.buyerName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.createdAt.split(' ')[1]}</span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-700 truncate">{msg.subject}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{msg.message}</p>

                  <div className="flex items-center justify-between mt-1 pt-1">
                    <span className="text-[10px] text-indigo-600 font-medium truncate max-w-[140px]">
                      {msg.storeName}
                    </span>
                    {msg.status === 'unread' ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
                        待回复
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> 已处理
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 cols: Chat & AI Translation Box */}
        {activeMessage ? (
          <div className="lg:col-span-2 flex flex-col h-full bg-slate-50/50">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{activeMessage.buyerName}</span>
                  <span className="text-xs text-slate-400">({activeMessage.storeName})</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  关联订单号: <strong className="font-mono text-indigo-700">{activeMessage.orderId}</strong>
                </p>
              </div>

              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{activeMessage.targetLanguage}</span>
              </span>
            </div>

            {/* Buyer Message Content with Translation */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-700">买家原话 (外文):</span>
                  <span>{activeMessage.createdAt}</span>
                </div>
                <p className="text-xs text-slate-800 font-sans leading-relaxed">
                  "{activeMessage.message}"
                </p>

                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                    <Globe2 className="w-3 h-3" />
                    系统智能实时中文翻译:
                  </span>
                  <p className="leading-relaxed font-medium">{activeMessage.translatedMessage}</p>
                </div>
              </div>

              {/* Quick Response Templates */}
              <div>
                <span className="text-xs font-bold text-slate-700 mb-2 block">快捷专业应答话术模版:</span>
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyTemplate(t)}
                      className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs text-slate-700 transition-colors text-left"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reply Input Box */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    运营回复中文草稿:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="输入中文回复内容..."
                    value={replyDraft}
                    onChange={(e) => {
                      setReplyDraft(e.target.value);
                      // Automatic simple translator mirror demo
                      if (e.target.value.includes('发货') || e.target.value.includes('蓝牙')) {
                        setTranslatedDraft('Thank you for reaching out! We are glad to help you with your inquiry right away.');
                      }
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-600 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    外语对照（自动译回买家目标语种）:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="系统将自动转换并呈现给海外买家的外文..."
                    value={translatedDraft}
                    onChange={(e) => setTranslatedDraft(e.target.value)}
                    className="w-full p-2.5 border border-indigo-200 bg-indigo-50/30 rounded-xl text-xs text-slate-800 outline-hidden focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSendReply}
                  disabled={!replyDraft.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发送外语回复并标记已解决</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center text-slate-400 text-xs">
            请选择左侧会话以开始处理
          </div>
        )}
      </div>
    </div>
  );
};
