import React from 'react';
import { ActiveTab } from '../types';
import {
  Users,
  Grid3X3,
  Sparkles,
  Shirt,
  Keyboard,
  Trophy,
  Share2,
  Shield,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  playerCount: number;
  hasResult: boolean;
  onGenerate: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  playerCount,
  hasResult,
  onGenerate,
  onOpenShortcuts,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Trophy className="w-4 h-4" /> },
    { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" />, badge: playerCount },
    { id: 'formation', label: 'Formations', icon: <Grid3X3 className="w-4 h-4" /> },
    {
      id: 'teams',
      label: 'Teams',
      icon: <Shirt className="w-4 h-4" />,
    },
    {
      id: 'pitch',
      label: 'Pitch View',
      icon: <Share2 className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-emerald-900/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-zinc-950 fill-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                  Match Day
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SQUAD
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Tactical Squad & Lineup Divider
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts"
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors hidden sm:flex items-center gap-1.5 text-xs"
            >
              <Keyboard className="w-4 h-4" />
              <span className="text-[11px] text-zinc-400 font-mono">⌘K</span>
            </button>

            <button
              onClick={onGenerate}
              disabled={playerCount < 2}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs shadow-lg transition-all ${
                playerCount >= 2
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-950/80 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-semibold">Generate Teams</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar border-t border-zinc-800/60 px-2 py-1.5 bg-zinc-950/90 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
