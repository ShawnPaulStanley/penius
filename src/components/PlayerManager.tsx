import React, { useState } from 'react';
import { Player, PositionCategory } from '../types';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { SAMPLE_ROSTERS } from '../data/samplePlayers';
import {
  Users,
  UserPlus,
  FileText,
  Search,
  Trash2,
  Edit2,
  ListPlus,
  AlertTriangle,
  Shirt,
  Sparkles,
  UserCheck,
  UserX,
  Sliders,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PlayerManagerProps {
  players: Player[];
  onOpenAddModal: () => void;
  onOpenEditModal: (player: Player) => void;
  onOpenBulkModal: () => void;
  onDeletePlayer: (id: string) => void;
  onClearAll: () => void;
  onLoadSample: (sampleIndex: number) => void;
  onGenerate: () => void;
  onToggleAttendance: (id: string) => void;
  onSetAttendanceCount: (count: number) => void;
  onToggleAllAttendance: (present: boolean) => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  onOpenAddModal,
  onOpenEditModal,
  onOpenBulkModal,
  onDeletePlayer,
  onClearAll,
  onLoadSample,
  onGenerate,
  onToggleAttendance,
  onSetAttendanceCount,
  onToggleAllAttendance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | PositionCategory>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'ATTENDING' | 'ABSENT'>('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const attendingCount = players.filter((p) => p.isAttending !== false).length;

  // Filter logic
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (attendanceFilter === 'ATTENDING' && player.isAttending === false) return false;
    if (attendanceFilter === 'ABSENT' && player.isAttending !== false) return false;

    if (selectedCategory === 'ALL') return true;

    // Check if player has any preferred position in selected category
    return player.preferredPositions.some((posKey) => {
      const posInfo = POSITIONS.find((p) => p.key === posKey);
      return posInfo?.category === selectedCategory;
    });
  });

  return (
    <div className="space-y-6 py-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Player Roster</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-bold">
              {players.length} Total
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Add and manage football players with their preferred tactical positions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLoadSample(0)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-colors"
            title="Load or Reset to 17 Custom Squad"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Load 17 Squad</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Player</span>
          </button>

          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Bulk Import</span>
          </button>

          {players.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2.5 rounded-2xl bg-zinc-800/80 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-700/60 transition-colors"
              title="Clear All Players"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal / Banner */}
      {showClearConfirm && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>Are you sure you want to remove all {players.length} players from roster?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClearAll();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              Yes, Clear All
            </button>
          </div>
        </div>
      )}

      {/* Attendance Control & Slider Panel */}
      {players.length > 0 && (
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-5 rounded-3xl border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Who is Playing Today?</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                    {attendingCount} / {players.length} Playing
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Slide or tap player cards to toggle attendance for match generator
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onToggleAllAttendance(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-colors"
              >
                All Present ({players.length})
              </button>
              {players.length >= 14 && (
                <button
                  onClick={() => onSetAttendanceCount(14)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs border border-zinc-700 transition-colors"
                >
                  Quick 14
                </button>
              )}
              {players.length >= 10 && (
                <button
                  onClick={() => onSetAttendanceCount(10)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs border border-zinc-700 transition-colors"
                >
                  Quick 10
                </button>
              )}
              <button
                onClick={() => onToggleAllAttendance(false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-semibold text-xs border border-zinc-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-1 pt-1">
            <input
              type="range"
              min={0}
              max={players.length}
              value={attendingCount}
              onChange={(e) => onSetAttendanceCount(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
              <span>0 Players</span>
              <span>{Math.floor(players.length / 2)} Half Squad</span>
              <span>{players.length} Full Squad</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Category & Attendance Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players by name..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:outline-none text-white text-xs placeholder-zinc-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* Attendance Filter */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setAttendanceFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                attendanceFilter === 'ALL'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAttendanceFilter('ATTENDING')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                attendanceFilter === 'ATTENDING'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-emerald-400'
              }`}
            >
              Playing ({attendingCount})
            </button>
            <button
              onClick={() => setAttendanceFilter('ABSENT')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                attendanceFilter === 'ABSENT'
                  ? 'bg-red-950 text-red-300'
                  : 'text-zinc-400 hover:text-red-400'
              }`}
            >
              Out ({players.length - attendingCount})
            </button>
          </div>

          {/* Position Category Filter Pills */}
          <div className="flex items-center gap-1">
            {(['ALL', 'GK', 'DEF', 'MID', 'ATT'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat === 'ALL' ? 'All Positions' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Players List Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => {
            const isAttending = player.isAttending !== false;

            return (
              <div
                key={player.id}
                className={`group relative border rounded-2xl p-4 transition-all shadow-md flex items-center justify-between gap-3 ${
                  isAttending
                    ? 'bg-zinc-900/90 hover:bg-zinc-900 border-zinc-800 hover:border-emerald-500/50'
                    : 'bg-zinc-950/60 opacity-60 border-zinc-900/80 hover:opacity-90'
                }`}
              >
                {/* Left Shirt Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 group-hover:border-emerald-500 transition-colors">
                    {player.kitNumber ? (
                      <span>#{player.kitNumber}</span>
                    ) : (
                      <Shirt className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {player.name}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      {player.preferredPositions.map((posKey) => {
                        const posInfo = POSITIONS.find((p) => p.key === posKey);
                        const badgeClass = posInfo
                          ? getCategoryBadgeClass(posInfo.category)
                          : 'bg-zinc-800 text-zinc-300';
                        return (
                          <span
                            key={posKey}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${badgeClass}`}
                          >
                            {posKey}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Actions: Attendance Switch & Edit / Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAttendance(player.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${
                      isAttending
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300'
                    }`}
                    title={isAttending ? 'Click to mark Absent' : 'Click to mark Present'}
                  >
                    {isAttending ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Out</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onOpenEditModal(player)}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Edit player"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePlayer(player.id)}
                      className="p-1.5 rounded-lg hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Delete player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-6 bg-zinc-900/40 rounded-3xl border border-zinc-800/80 p-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-500">
            <Users className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-white">No Players Found</h3>
            <p className="text-xs text-zinc-400">
              {searchTerm
                ? 'No players match your search filter.'
                : 'Add players manually or load one of our pre-configured demo rosters in 1 click.'}
            </p>
          </div>

          {!searchTerm && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First Player</span>
              </button>

              {SAMPLE_ROSTERS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => onLoadSample(idx)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 font-medium text-xs border border-zinc-700 transition-colors"
                >
                  <ListPlus className="w-4 h-4" />
                  <span>Load {sample.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Action when players exist */}
      {players.length >= 2 && (
        <div className="sticky bottom-6 flex justify-center pt-4 pointer-events-none">
          <button
            onClick={onGenerate}
            className="pointer-events-auto flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-sm shadow-2xl shadow-emerald-950 hover:scale-[1.03] active:scale-[0.98] transition-all border border-emerald-400/30"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Generate Teams from {players.length} Players</span>
          </button>
        </div>
      )}
    </div>
  );
};
