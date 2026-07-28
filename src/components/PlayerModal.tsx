import React, { useState, useEffect } from 'react';
import { Player, PositionKey } from '../types';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { X, Check, UserPlus, Save, AlertCircle } from 'lucide-react';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, 'id' | 'createdAt'>, existingId?: string) => void;
  editingPlayer?: Player | null;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlayer,
}) => {
  const [name, setName] = useState('');
  const [kitNumber, setKitNumber] = useState<string>('');
  const [preferredPositions, setPreferredPositions] = useState<PositionKey[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setKitNumber(editingPlayer.kitNumber ? String(editingPlayer.kitNumber) : '');
      setPreferredPositions(editingPlayer.preferredPositions || []);
    } else {
      setName('');
      setKitNumber('');
      setPreferredPositions(['CM']); // default preferred
    }
    setError('');
  }, [editingPlayer, isOpen]);

  if (!isOpen) return null;

  const togglePosition = (posKey: PositionKey) => {
    if (preferredPositions.includes(posKey)) {
      // Don't allow empty selection
      if (preferredPositions.length === 1) {
        setError('At least one preferred position is required.');
        return;
      }
      setPreferredPositions(preferredPositions.filter((p) => p !== posKey));
    } else {
      setPreferredPositions([...preferredPositions, posKey]);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a player name.');
      return;
    }
    if (preferredPositions.length === 0) {
      setError('Select at least one preferred position.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        preferredPositions,
        kitNumber: kitNumber ? parseInt(kitNumber, 10) : undefined,
      },
      editingPlayer?.id
    );

    onClose();
  };

  const categories = ['GK', 'DEF', 'MID', 'ATT'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white space-y-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              {editingPlayer ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingPlayer ? 'Edit Player Details' : 'Add New Player'}
              </h2>
              <p className="text-xs text-zinc-400">
                Specify preferred positions for accurate squad balancing
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Player Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Miller"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder-zinc-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Kit # (Optional)</label>
              <input
                type="number"
                min="1"
                max="99"
                value={kitNumber}
                onChange={(e) => setKitNumber(e.target.value)}
                placeholder="7"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder-zinc-500 text-center transition-colors"
              />
            </div>
          </div>

          {/* Preferred Positions Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Preferred Positions (Multiple allowed)
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">
                {preferredPositions.length} selected
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const catPositions = POSITIONS.filter((p) => p.category === cat);
                return (
                  <div key={cat} className="space-y-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      {catPositions[0]?.categoryLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {catPositions.map((pos) => {
                        const isSelected = preferredPositions.includes(pos.key);
                        return (
                          <button
                            key={pos.key}
                            type="button"
                            onClick={() => togglePosition(pos.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                                : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:bg-zinc-800'
                            }`}
                          >
                            <span className="font-bold">{pos.key}</span>
                            <span className="text-[10px] opacity-80">({pos.label})</span>
                            {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{editingPlayer ? 'Update Player' : 'Save Player'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
