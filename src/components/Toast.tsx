import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#151921] border border-white/10 rounded-xl p-4 shadow-2xl shadow-black text-white flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-2.5">
            {t.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h5 className="text-xs font-bold text-white font-mono leading-tight">{t.title}</h5>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{t.message}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
