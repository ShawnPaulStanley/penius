import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'G or Ctrl+Enter', label: 'Generate Balanced Teams' },
    { key: 'S', label: 'Shuffle Teams' },
    { key: 'C', label: 'Copy WhatsApp Format' },
    { key: 'E', label: 'Export Pitch Image (PNG)' },
    { key: '1 - 5', label: 'Switch Navigation Tabs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-0">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-zinc-400">Quick hotkeys for fast match setup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80"
            >
              <span className="text-xs text-zinc-300 font-medium">{sc.label}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-zinc-800 text-emerald-300 font-mono text-xs font-bold border border-zinc-700 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
