import { Order } from '../../types/erp';
import { Printer, X, Download, ShieldCheck, Check } from 'lucide-react';

interface ShippingLabelModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ShippingLabelModal = ({ order, onClose }: ShippingLabelModalProps) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalWeightG = order.items.reduce((acc, it) => acc + (it.weightG * it.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">国际热敏物流面单预览 (100×150mm 标准)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>立即调用热敏打印机</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 100mm x 150mm Thermal Label Layout Simulation */}
        <div className="p-6 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div 
            id="printable-shipping-label"
            className="w-[380px] bg-white border-2 border-slate-900 text-slate-900 font-sans p-4 shadow-md print:shadow-none print:border-none print:w-full space-y-3"
            style={{ minHeight: '520px' }}
          >
            {/* Top Bar: Carrier Logo & Sort Code */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <h2 className="text-base font-black tracking-tighter uppercase">{order.logistics.carrier.split(' ')[0]}</h2>
                <p className="text-[10px] font-mono font-bold tracking-widest">{order.logistics.channelName.split(' ')[0]}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono tracking-wider bg-slate-900 text-white px-2 py-0.5">
                  {order.buyer.countryCode}-{order.buyer.state || 'GL'}
                </span>
                <p className="text-[9px] font-mono mt-0.5 font-bold">PORT: LAX-HUB-01</p>
              </div>
            </div>

            {/* Tracking Barcode Area */}
            <div className="text-center py-2 border-b-2 border-slate-900 space-y-1">
              <div className="h-14 w-full flex items-center justify-center bg-slate-50 border border-dashed border-slate-300">
                {/* Simulated crisp high-contrast barcode bars */}
                <div className="flex items-center h-10 gap-0.5 justify-center">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1, 2].map((w, i) => (
                    <span 
                      key={i} 
                      className="bg-black inline-block h-full" 
                      style={{ width: `${w * 1.8}px` }} 
                    />
                  ))}
                </div>
              </div>
              <p className="font-mono text-xs font-black tracking-widest uppercase">
                {order.logistics.trackingNumber}
              </p>
            </div>

            {/* Receiver Address (To) */}
            <div className="border-b-2 border-slate-900 pb-2.5">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 px-1">SHIP TO (收件人):</span>
                <span className="text-[10px] font-mono font-bold">TEL: {order.buyer.phone}</span>
              </div>
              <p className="text-sm font-black uppercase leading-tight">{order.buyer.name}</p>
              <p className="text-xs uppercase font-medium mt-0.5 leading-tight">{order.buyer.street}</p>
              <p className="text-xs uppercase font-bold mt-0.5">
                {order.buyer.city}, {order.buyer.state} {order.buyer.zipCode}
              </p>
              <p className="text-sm font-black uppercase mt-1 tracking-wider">
                {order.buyer.country} ({order.buyer.countryCode})
              </p>
            </div>

            {/* Sender Address (From) */}
            <div className="border-b-2 border-slate-900 pb-2 text-[10px] text-slate-700">
              <span className="font-bold bg-slate-100 px-1">FROM (发件寄出):</span>
              <p className="mt-0.5 font-medium leading-tight">
                NovaERP Global Logistics Hub, Tower B, Shenzhen High-Tech Park, Guangdong, China 518129
              </p>
            </div>

            {/* Customs CN22 Declaration Mini Table */}
            <div className="pt-1 text-[10px]">
              <div className="flex justify-between font-bold border-b border-slate-300 pb-0.5">
                <span>CUSTOMS DECLARATION (CN22)</span>
                <span className="font-mono">WT: {totalWeightG}g</span>
              </div>
              <div className="mt-1 space-y-0.5">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between font-mono text-[9px]">
                    <span className="truncate max-w-[220px]">{it.name}</span>
                    <span>x{it.quantity} | ${(it.unitPrice * 0.3).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-end mt-2 pt-1 border-t border-slate-300">
                <span className="text-[9px] text-slate-500 font-mono">ORDER: {order.platformOrderId}</span>
                <span className="font-mono font-bold text-[10px]">TOTAL VALUE: USD $18.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
