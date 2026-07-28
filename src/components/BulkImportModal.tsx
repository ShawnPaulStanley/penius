import React, { useState } from 'react';
import { Player, PositionKey } from '../types';
import { POSITIONS } from '../data/positions';
import { X, FileText, UserPlus, Sparkles } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newPlayers: Omit<Player, 'id' | 'createdAt'>[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  const parseLines = (): Omit<Player, 'id' | 'createdAt'>[] => {
    const lines = rawText.split('\n');
    const parsed: Omit<Player, 'id' | 'createdAt'>[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Remove leading numbering like "1. ", "1)", "- "
      const cleanLine = trimmed.replace(/^(\d+[\.\)]\s*|[\-\*]\s*)/, '');

      // Check for position tags in parentheses or after dashes e.g. "John (CB, CDM)" or "Mike - ST"
      const allPosKeys = POSITIONS.map((p) => p.key);
      const foundPositions: PositionKey[] = [];

      allPosKeys.forEach((key) => {
        // Regex word boundary match for position keys
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(cleanLine)) {
          foundPositions.push(key);
        }
      });

      // Extract name by removing brackets/positions or standard cleaning
      let namePart = cleanLine.replace(/\([^\)]*\)/g, '').replace(/[-–—].*$/, '').trim();
      if (!namePart) namePart = cleanLine;

      parsed.push({
        name: namePart,
        preferredPositions: foundPositions.length > 0 ? foundPositions : ['CM'],
      });
    });

    return parsed;
  };

  const handleImport = () => {
    const parsed = parseLines();
    if (parsed.length > 0) {
      onImport(parsed);
      setRawText('');
      onClose();
    }
  };

  const previewList = parseLines();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quick Bulk Import</h2>
              <p className="text-xs text-zinc-400">
                Paste player names line by line (e.g. from WhatsApp group chat)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Paste Names (One per line)</span>
              <span className="text-[11px] text-zinc-400">
                Tip: Include positions like "John (CB, CDM)" or "Mike - ST"
              </span>
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`1. John Miller (CB, CDM)\n2. Alex Ruiz (GK)\n3. David Beckham (RB, CM)\n4. Ryan Giggs (LW, CAM)\n5. Jack Kane (ST)`}
              className="w-full p-4 rounded-xl bg-zinc-800/80 border border-zinc-700 focus:border-emerald-500 focus:outline-none text-white text-xs font-mono placeholder-zinc-500 transition-colors"
            />
          </div>

          {/* Real-time Parsed Preview */}
          {previewList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Detected {previewList.length} Players</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="max-h-32 overflow-y-auto bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5">
                {previewList.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-medium text-white">{p.name}</span>
                    <div className="flex items-center gap-1">
                      {p.preferredPositions.map((pos) => (
                        <span
                          key={pos}
                          className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800/50"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={previewList.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all ${
              previewList.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Import {previewList.length} Players</span>
          </button>
        </div>
      </div>
    </div>
  );
};
