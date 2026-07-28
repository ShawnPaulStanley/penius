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
    { id: 'home', label: 'HOME', icon: <Trophy className="w-4 h-4" /> },
    { id: 'players', label: 'PLAYERS', icon: <Users className="w-4 h-4" />, badge: playerCount },
    { id: 'formation', label: 'FORMATIONS', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'teams', label: 'TEAMS', icon: <Shirt className="w-4 h-4" /> },
    { id: 'pitch', label: 'PITCH VIEW', icon: <Share2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white border-b-4 border-black">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#CCFF00] text-black border-2 border-black neo-shadow flex items-center justify-center font-black group-hover:bg-[#00F0FF] transition-colors">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                MATCH<span className="text-[#CCFF00]">DAY</span>
              </span>
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 bg-[#00F0FF] text-black border border-black neo-shadow-sm">
                WEB3.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 font-extrabold text-xs tracking-wider border-2 border-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#CCFF00] text-black neo-shadow-sm'
                      : 'bg-white text-black hover:bg-[#00F0FF]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-black border border-black ${
                        isActive ? 'bg-black text-white' : 'bg-[#CCFF00] text-black'
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
              className="p-2 bg-white hover:bg-[#00F0FF] text-black border-2 border-black neo-shadow-sm transition-colors hidden sm:flex items-center gap-1.5 text-xs font-bold"
            >
              <Keyboard className="w-4 h-4" />
              <span className="text-[11px] font-mono">⌘K</span>
            </button>

            <button
              onClick={onGenerate}
              disabled={playerCount < 2}
              className={`flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-wider neo-btn cursor-pointer ${
                playerCount >= 2
                  ? 'bg-[#CCFF00] text-black hover:bg-[#00F0FF]'
                  : 'bg-zinc-400 text-zinc-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>MATCH UP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ticker Banner */}
      <div className="bg-[#CCFF00] text-black border-t-2 border-b-2 border-black py-1 overflow-hidden font-black text-xs uppercase tracking-widest flex items-center select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>★ LIVE MATCH DAY ★ NO FAIRNESS GUESSWORK ★ 100% BALANCED SQUAD ★ REAL-TIME PITCH ★ WHATSAPP READY ★ POSITION DRIVEN ★</span>
          <span>★ LIVE MATCH DAY ★ NO FAIRNESS GUESSWORK ★ 100% BALANCED SQUAD ★ REAL-TIME PITCH ★ WHATSAPP READY ★ POSITION DRIVEN ★</span>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar px-2 py-2 bg-black border-t border-zinc-800 gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black ${
                isActive
                  ? 'bg-[#CCFF00] text-black neo-shadow-sm'
                  : 'bg-white text-black'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-black text-white font-black border border-black">
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

