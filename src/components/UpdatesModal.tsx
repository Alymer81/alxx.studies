import React from 'react';
import { UpdateLog } from '../types';
import { Sparkles, X, Tag } from 'lucide-react';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  updates: UpdateLog[];
}

export const UpdatesModal: React.FC<UpdatesModalProps> = ({ isOpen, onClose, updates }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-lg bg-stone-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-stone-100 max-h-[85vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Portal Updates & Changelog</h2>
              <p className="text-xs text-stone-400">Latest features, new games, and improvements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Updates List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {updates.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-500">No update logs published yet.</div>
          ) : (
            updates.map((up) => (
              <div key={up.id} className="p-4 rounded-2xl glass-panel space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">
                      {up.version}
                    </span>
                    <h3 className="font-bold text-sm text-white">{up.title}</h3>
                  </div>
                  <span className="text-[11px] text-stone-400">{up.date}</span>
                </div>

                <ul className="space-y-1.5 text-xs text-stone-300">
                  {up.content.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
