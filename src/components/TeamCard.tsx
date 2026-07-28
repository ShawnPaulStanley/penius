import React from 'react';
import { DividedTeam, DivisionResult } from '../types';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { Crown, Shirt, Copy, Check, UserCheck } from 'lucide-react';

interface TeamCardProps {
  team: DividedTeam;
  otherTeam: DividedTeam;
  onSwapCaptain: (teamId: 'teamA' | 'teamB', playerId: string) => void;
  onCopyWhatsApp: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onSwapCaptain,
}) => {
  const isTeamA = team.id === 'teamA';
  const headerBg = isTeamA ? 'bg-[#CCFF00]' : 'bg-[#00F0FF]';

  return (
    <div className="bg-white border-4 border-black neo-shadow text-black font-['Space_Grotesk',sans-serif]">
      {/* Team Header */}
      <div className={`p-5 border-b-4 border-black flex items-center justify-between ${headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center font-black text-xs uppercase neo-shadow-sm">
            {isTeamA ? 'A' : 'B'}
          </div>
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight">{team.name}</h2>
            <p className="text-xs font-bold text-black font-mono">
              {team.assignedPlayers.length} STARTING
              {team.benchPlayers.length > 0 && ` + ${team.benchPlayers.length} SUBS`}
            </p>
          </div>
        </div>
      </div>

      {/* Starting Squad List */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-black text-black uppercase tracking-wider px-1">
          STARTING LINEUP
        </h3>

        <div className="space-y-2">
          {team.assignedPlayers.map((ap) => {
            return (
              <div
                key={ap.player.id}
                className="flex items-center justify-between p-3 bg-white border-2 border-black neo-shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-black text-white text-xs font-mono font-black border border-black">
                    {ap.assignedPosition}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-black uppercase">{ap.player.name}</span>
                      {ap.isCaptain && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FFBD2E] text-black font-black text-[10px] border border-black uppercase">
                          <Crown className="w-3 h-3 stroke-[2.5]" /> CAPTAIN
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSwapCaptain(team.id, ap.player.id)}
                  title="Make Captain"
                  className={`p-1.5 border-2 border-black transition-all cursor-pointer ${
                    ap.isCaptain
                      ? 'bg-[#FFBD2E] text-black neo-shadow-sm'
                      : 'bg-zinc-100 text-black hover:bg-[#00F0FF]'
                  }`}
                >
                  <Crown className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bench Players */}
        {team.benchPlayers.length > 0 && (
          <div className="pt-3 space-y-2">
            <h3 className="text-xs font-black text-black uppercase tracking-wider px-1">
              SUBSTITUTES
            </h3>
            <div className="space-y-1.5">
              {team.benchPlayers.map((bp) => (
                <div
                  key={bp.id}
                  className="flex items-center justify-between p-2.5 bg-zinc-100 border border-black font-bold text-xs text-black"
                >
                  <span className="uppercase">{bp.name}</span>
                  <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-mono font-black">SUB</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
