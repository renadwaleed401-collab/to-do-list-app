import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm
}) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#EDE6DC] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F4] text-[#8E364A] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-dialog-title" className="text-base font-editorial font-bold text-[#282F1B] italic">
                Remove Task?
              </h3>
              <p className="text-xs text-[#282F1B]/60">
                This item will be deleted from your board.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE6DC] text-xs text-[#282F1B] font-medium mb-5 italic line-clamp-3">
            &quot;{task.todo}&quot;
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#EDE6DC] text-xs font-semibold text-[#282F1B]/80 hover:bg-[#FAF7F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(task.id)}
              className="px-4 py-2 rounded-full bg-[#8E364A] hover:bg-[#722B3B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
