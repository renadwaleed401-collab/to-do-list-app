import React from 'react';
import { CheckCircle2, Info, AlertCircle, X, RotateCcw } from 'lucide-react';

export default function Toast({ toast, onClose, onUndo }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 py-3 px-4.5 rounded-full bg-[#282F1B] text-[#FAF7F2] shadow-2xl border border-white/10 animate-in slide-in-from-bottom-3 duration-200 text-xs font-medium">
      <CheckCircle2 className="w-4 h-4 text-[#A7B37E]" />
      <span>{toast.message}</span>

      {toast.canUndo && onUndo && (
        <button
          onClick={onUndo}
          className="ml-1 text-[#F9D1D9] hover:text-white font-bold flex items-center gap-1 underline transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Undo</span>
        </button>
      )}

      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
