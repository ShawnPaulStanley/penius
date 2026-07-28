import React from 'react';
import { ActiveTab, Formation, Player } from '../types';
import { SAMPLE_ROSTERS } from '../data/samplePlayers';
import {
  Users,
  Grid3X3,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shirt,
  Share2,
  ListPlus,
  RotateCcw,
} from 'lucide-react';

interface HomeTabProps {
  players: Player[];
  selectedFormation: Formation;
  setActiveTab: (tab: ActiveTab) => void;
  onLoadSample: (sampleIndex: number) => void;
  onGenerate: () => void;
  onOpenAddModal: () => void;
  onOpenBulkModal: () => void;
  hasResult: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  players,
  selectedFormation,
  setActiveTab,
  onLoadSample,
  onGenerate,
  onOpenAddModal,
  onOpenBulkModal,
  hasResult,
}) => {
  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-emerald-900/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Position-Balanced Football Squad Generator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Divide Players into{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
              Two Perfect Teams
            </span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Quickly create fair, position-balanced football lineups based on preferred positions. No skill ratings, no hidden stats — pure tactical position balance with realistic pitch diagrams and WhatsApp sharing.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700/60 text-xs font-semibold text-zinc-200">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{players.length} Players Registered</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700/60 text-xs font-semibold text-zinc-200">
              <Grid3X3 className="w-4 h-4 text-emerald-400" />
              <span>Formation: Custom Fluid Pitch Layout</span>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onGenerate}
              disabled={players.length < 2}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${
                players.length >= 2
                  ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-950/80 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>Generate 2 Teams</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {hasResult && (
              <button
                onClick={() => setActiveTab('pitch')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 font-semibold text-sm border border-emerald-500/30 transition-colors"
              >
                <Shirt className="w-4 h-4 text-emerald-400" />
                <span>View Pitch Lineups</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('players')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 font-medium text-sm border border-zinc-700/60 transition-colors"
            >
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Manage Players</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Demo Squads Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Instant Test Squads</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Load pre-configured player rosters with 1 click to test immediately
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_ROSTERS.map((sample, idx) => (
            <div
              key={idx}
              className="group relative bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                    {sample.count} Players
                  </span>
                  <Shirt className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-white">{sample.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <button
                  onClick={() => onLoadSample(idx)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold text-xs border border-emerald-500/30 transition-all"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Load {sample.count} Players</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workflow Steps */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>How It Works</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('players')}
            className="cursor-pointer bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Add Players</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter player names and select their preferred positions (GK, CB, CM, ST, etc.).
            </p>
          </div>

          <div
            onClick={() => setActiveTab('formation')}
            className="cursor-pointer bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Pick Formation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Choose your tactical lineup (5v5, 7v7, 11v11: 4-3-3, 4-4-2, 3-2-1, etc.).
            </p>
          </div>

          <div
            onClick={onGenerate}
            className="cursor-pointer bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Generate & Pitch</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Algorithmic position balancing distributes goalkeepers, defenders, midfielders, and attackers evenly.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('pitch')}
            className="cursor-pointer bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Drag & Share</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Drag/swap player positions, view random captains, and copy directly for WhatsApp sharing or export as PNG.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
