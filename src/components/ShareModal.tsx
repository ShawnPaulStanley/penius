import React, { useState } from 'react';
import { DivisionResult } from '../types';
import { formatTeamsForWhatsApp, formatTeamsPlainText } from '../utils/whatsappFormatter';
import { X, Copy, Check, Share2, Download, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DivisionResult | null;
  onExportPNG: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  result,
  onExportPNG,
}) => {
  const [copiedWA, setCopiedWA] = useState(false);
  const [copiedPlain, setCopiedPlain] = useState(false);

  if (!isOpen || !result) return null;

  const waText = formatTeamsForWhatsApp(result);
  const plainText = formatTeamsPlainText(result);

  const handleCopyWA = () => {
    navigator.clipboard.writeText(waText);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2000);
  };

  const handleCopyPlain = () => {
    navigator.clipboard.writeText(plainText);
    setCopiedPlain(true);
    setTimeout(() => setCopiedPlain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Share Match Lineups</h2>
              <p className="text-xs text-zinc-400">
                Copy formatted squad list directly to WhatsApp or download pitch image
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* WhatsApp Preview & Copy Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Formatted Text</span>
              </label>
              <button
                onClick={handleCopyWA}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                {copiedWA ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWA ? 'Copied!' : 'Copy for WhatsApp'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={6}
              value={waText}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs focus:outline-none"
            />
          </div>

          {/* Export PNG Pitch Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onExportPNG();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Pitch Image (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
