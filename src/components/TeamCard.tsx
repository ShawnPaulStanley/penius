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
  const headerGradient = isTeamA
    ? 'from-red-600/30 via-red-950/40 to-zinc-900 border-red-500/30 text-red-200'
    : 'from-blue-600/30 via-blue-950/40 to-zinc-900 border-blue-500/30 text-blue-200';

  const badgeColor = isTeamA ? 'bg-red-500 text-white' : 'bg-blue-500 text-white';

  return (
    <div className={`bg-zinc-900/90 border rounded-3xl overflow-hidden shadow-xl ${headerGradient}`}>
      {/* Team Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-md ${badgeColor}`}>
            {isTeamA ? 'RED' : 'BLUE'}
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{team.name}</h2>
            <p className="text-xs text-zinc-400">
              {team.assignedPlayers.length} Starting Lineup
              {team.benchPlayers.length > 0 && ` + ${team.benchPlayers.length} Subs`}
            </p>
          </div>
        </div>
      </div>

      {/* Starting Squad List */}
      <div className="p-4 space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
          Starting Lineup
        </h3>

        <div className="space-y-1.5">
          {team.assignedPlayers.map((ap) => {
            const posInfo = POSITIONS.find((p) => p.key === ap.assignedPosition);
            const badgeClass = posInfo
              ? getCategoryBadgeClass(posInfo.category)
              : 'bg-zinc-800 text-zinc-300';

            return (
              <div
                key={ap.player.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${badgeClass}`}>
                    {ap.assignedPosition}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{ap.player.name}</span>
                      {ap.isCaptain && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px] shadow-sm">
                          <Crown className="w-3 h-3" /> CAPTAIN
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSwapCaptain(team.id, ap.player.id)}
                  title="Make Captain"
                  className={`p-1.5 rounded-xl border transition-colors ${
                    ap.isCaptain
                      ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-amber-300'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bench Players */}
        {team.benchPlayers.length > 0 && (
          <div className="pt-4 space-y-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
              Substitutes
            </h3>
            <div className="space-y-1.5">
              {team.benchPlayers.map((bp) => (
                <div
                  key={bp.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/30 border border-zinc-800/50 text-xs text-zinc-300"
                >
                  <span className="font-medium text-white">{bp.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">SUB</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
