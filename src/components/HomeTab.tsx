import React from 'react';
import { ActiveTab, Player } from '../types';
import { Sparkles, Users, ArrowRight, Shirt, Zap } from 'lucide-react';

interface HomeTabProps {
  players: Player[];
  setActiveTab: (tab: ActiveTab) => void;
  onGenerate: () => void;
  hasResult: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  players,
  setActiveTab,
  onGenerate,
  hasResult,
}) => {
  const attendingCount = players.filter((p) => p.isAttending !== false).length;

  return (
    <div className="min-h-[65vh] flex items-center justify-center py-10 px-4">
      {/* Neo-Brutalist Main Card Window */}
      <div className="w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-0 text-black font-['Space_Grotesk',sans-serif]">
        {/* Retro Window Header Bar */}
        <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between border-b-4 border-black">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black" />
            <span className="ml-2 font-mono text-xs font-bold uppercase tracking-widest text-[#CCFF00]">
              MATCH_DAY_SYSTEM_V2.0
            </span>
          </div>
          <div className="text-[10px] font-mono bg-[#CCFF00] text-black px-2 py-0.5 font-extrabold border border-black">
            READY
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00F0FF] border-2 border-black font-black text-xs uppercase tracking-wider neo-shadow-sm">
              <Zap className="w-4 h-4 text-black fill-black" />
              <span>POSITION BALANCED ENGINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none pt-1">
              BUILT FOR <span className="bg-[#CCFF00] px-2 py-0.5 border-2 border-black inline-block">MATCHES.</span>
            </h1>

            <p className="text-sm font-semibold text-zinc-700 max-w-md mx-auto pt-1 leading-snug">
              Instant position-balanced football team generator. <br/>
              <span className="font-mono text-xs text-black bg-zinc-100 px-2 py-0.5 border border-black inline-block mt-2 font-bold">
                {attendingCount} ATTENDING PLAYERS REGISTERED
              </span>
            </p>
          </div>

          <div className="space-y-3 pt-4 max-w-sm mx-auto">
            <button
              onClick={onGenerate}
              disabled={attendingCount < 2}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-black text-base uppercase tracking-wider neo-btn cursor-pointer ${
                attendingCount >= 2
                  ? 'bg-[#CCFF00] text-black hover:bg-[#00F0FF]'
                  : 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-70'
              }`}
            >
              <Sparkles className="w-5 h-5 fill-black" />
              <span>MATCH UP</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-[#00F0FF] text-black font-extrabold text-sm border-3 border-black neo-shadow-sm transition-all cursor-pointer uppercase tracking-wider"
            >
              <Users className="w-4 h-4 stroke-[2.5]" />
              <span>MANAGE PLAYERS ({players.length})</span>
            </button>

            {hasResult && (
              <button
                onClick={() => setActiveTab('pitch')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00F0FF] hover:bg-[#CCFF00] text-black font-black text-xs border-2 border-black transition-all cursor-pointer uppercase tracking-wider"
              >
                <Shirt className="w-4 h-4 stroke-[2.5]" />
                <span>VIEW PITCH LINEUP →</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-zinc-100 border-t-3 border-black p-3 text-center text-xs font-mono font-bold text-zinc-600 flex items-center justify-between px-6">
          <span>● AUTO-TACTICS</span>
          <span>● NO GUESSWORK</span>
          <span>● WHATSAPP READY</span>
        </div>
      </div>
    </div>
  );
};

