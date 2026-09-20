import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast = ({ toasts, onDismiss }: Props) => {
  if (toasts.length === 0) return null;

  return (
    <div id="notification-toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const bgColors = {
          success: 'bg-emerald-900/90 border-emerald-700/60 text-emerald-100',
          error: 'bg-rose-900/90 border-rose-700/60 text-rose-100',
          warning: 'bg-amber-900/90 border-amber-700/60 text-amber-100',
          info: 'bg-slate-900/95 border-slate-700/60 text-slate-100'
        };

        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs opacity-85 mt-1 leading-normal">{toast.message}</p>
              )}
            </div>
            <button
              id={`dismiss-toast-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
