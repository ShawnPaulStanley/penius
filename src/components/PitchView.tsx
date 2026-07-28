import React, { useState, useRef } from 'react';
import {
  DivisionResult,
  AssignedPlayer,
  Player,
  PositionKey,
  TacticalSlot,
} from '../types';
import { formatTeamsForWhatsApp, formatTeamsPlainText } from '../utils/whatsappFormatter';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Shuffle,
  Download,
  Copy,
  Check,
  Crown,
  Shirt,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Share2,
  Trophy,
} from 'lucide-react';

interface PitchViewProps {
  divisionResult: DivisionResult | null;
  onRandomizeAgain: () => void;
  onShuffle: () => void;
  onUpdateResult: (newResult: DivisionResult) => void;
  onOpenShareModal: () => void;
}

export const PitchView: React.FC<PitchViewProps> = ({
  divisionResult,
  onRandomizeAgain,
  onShuffle,
  onUpdateResult,
  onOpenShareModal,
}) => {
  const pitchRef = useRef<HTMLDivElement>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState<{
    teamId: 'teamA' | 'teamB';
    playerId: string;
  } | null>(null);

  if (!divisionResult) {
    return (
      <div className="py-20 text-center space-y-4 bg-zinc-900/40 rounded-3xl border border-zinc-800 p-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Shirt className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Teams Generated Yet</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Add players and select a formation, then click "Generate Teams" to view your football pitch lineups.
        </p>
      </div>
    );
  }

  const { teamA, teamB, formation } = divisionResult;

  // Trigger celebration confetti on view load if recently generated
  const handleCopyWhatsApp = () => {
    const text = formatTeamsForWhatsApp(divisionResult);
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  // Export Pitch PNG
  const handleExportPNG = async () => {
    if (!pitchRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toPng(pitchRef.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `Football_Teams_${formation.name}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export pitch image', err);
    } finally {
      setExporting(false);
    }
  };

  // Tap-to-swap logic between two players
  const handlePlayerTap = (teamId: 'teamA' | 'teamB', playerId: string) => {
    if (!selectedPlayerForSwap) {
      // First selection
      setSelectedPlayerForSwap({ teamId, playerId });
      return;
    }

    // Second selection -> Perform Swap!
    if (
      selectedPlayerForSwap.teamId === teamId &&
      selectedPlayerForSwap.playerId === playerId
    ) {
      // Deselect if same player tapped
      setSelectedPlayerForSwap(null);
      return;
    }

    const sourceTeamId = selectedPlayerForSwap.teamId;
    const sourcePlayerId = selectedPlayerForSwap.playerId;

    // Deep clone state for mutation
    const newTeamA = JSON.parse(JSON.stringify(teamA));
    const newTeamB = JSON.parse(JSON.stringify(teamB));

    const sourceTeam = sourceTeamId === 'teamA' ? newTeamA : newTeamB;
    const targetTeam = teamId === 'teamA' ? newTeamA : newTeamB;

    // Find assigned indexes
    const sourceIdx = sourceTeam.assignedPlayers.findIndex(
      (ap: AssignedPlayer) => ap.player.id === sourcePlayerId
    );
    const targetIdx = targetTeam.assignedPlayers.findIndex(
      (ap: AssignedPlayer) => ap.player.id === playerId
    );

    if (sourceIdx !== -1 && targetIdx !== -1) {
      // Swap assigned positions/slots
      const tempPlayer = sourceTeam.assignedPlayers[sourceIdx].player;
      sourceTeam.assignedPlayers[sourceIdx].player = targetTeam.assignedPlayers[targetIdx].player;
      targetTeam.assignedPlayers[targetIdx].player = tempPlayer;

      onUpdateResult({
        ...divisionResult,
        teamA: newTeamA,
        teamB: newTeamB,
      });

      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }

    setSelectedPlayerForSwap(null);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 p-5 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Lineup Pitch View</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-bold">
              {formation.name} ({formation.category})
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Tap any two player shirts to swap their tactical positions or teams instantly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRandomizeAgain}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Randomize</span>
          </button>

          <button
            onClick={onShuffle}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Shuffle Teams</span>
          </button>

          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWhatsApp ? 'Copied WhatsApp!' : 'Copy WhatsApp'}</span>
          </button>

          <button
            onClick={handleExportPNG}
            disabled={exporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{exporting ? 'Exporting...' : 'Export PNG'}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            title="Share Options"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedPlayerForSwap && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs animate-fadeIn">
          <span>Tap another player to swap positions with selected player.</span>
          <button
            onClick={() => setSelectedPlayerForSwap(null)}
            className="px-2.5 py-1 rounded-lg bg-amber-900 hover:bg-amber-800 text-white text-[11px] font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Pitch Graphic Container */}
      <div
        ref={pitchRef}
        className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800 bg-emerald-950 p-4 sm:p-6 text-white select-none space-y-6"
      >
        {/* Grass Texture Stripes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,78,59,0.9)_50%,rgba(4,120,87,0.85)_50%)] bg-[length:100%_40px] pointer-events-none" />

        {/* Outer Pitch Border & Lines */}
        <div className="relative min-h-[640px] sm:min-h-[720px] rounded-2xl border-2 border-white/30 p-2 flex flex-col justify-between overflow-hidden">
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2 pointer-events-none" />

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-white/30 pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>

          {/* Top Penalty Box (Team B Goal Area) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-28 border-b-2 border-x-2 border-white/30 rounded-b-xl pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 border-b-2 border-x-2 border-white/30 rounded-b-md" />
          </div>

          {/* Bottom Penalty Box (Team A Goal Area) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-28 border-t-2 border-x-2 border-white/30 rounded-t-xl pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 border-t-2 border-x-2 border-white/30 rounded-t-md" />
          </div>

          {/* --- TOP HALF: TEAM B (Attacking Downward) --- */}
          <div className="relative z-10 w-full h-[300px] sm:h-[340px] mb-4">
            <div className="absolute top-2 left-4 flex items-center gap-2 bg-blue-950/80 px-3 py-1 rounded-xl border border-blue-500/40 text-blue-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-blue-400" />
              <span>{teamB.name}</span>
              {teamB.captainId && <Crown className="w-3.5 h-3.5 text-amber-400" />}
            </div>

            {teamB.assignedPlayers.map((ap) => {
              const slot = {
                x: ap.x ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.x ?? 50,
                y: ap.y ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.y ?? 50,
              };
              // Top team (Team B) top-down position: slot.y percentage from top goal line
              const topY = slot.y;
              const isSelected =
                selectedPlayerForSwap?.teamId === 'teamB' &&
                selectedPlayerForSwap?.playerId === ap.player.id;

              return (
                <div
                  key={ap.player.id}
                  onClick={() => handlePlayerTap('teamB', ap.player.id)}
                  style={{
                    left: `${slot.x}%`,
                    top: `${topY}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                >
                  {/* Circular Shirt Token */}
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-white ring-4 ring-amber-400/50'
                        : 'bg-gradient-to-tr from-blue-700 to-blue-500 border-blue-300'
                    }`}
                  >
                    <span>{ap.assignedPosition}</span>

                    {/* Captain Badge */}
                    {ap.isCaptain && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center border border-white shadow-md"
                        title="Captain"
                      >
                        C
                      </div>
                    )}
                  </div>

                  {/* Player Name Pill */}
                  <div className="mt-1 px-2 py-0.5 rounded-md bg-zinc-950/90 text-white font-bold text-[10px] sm:text-xs tracking-tight truncate max-w-[90px] border border-white/20 shadow-md">
                    {ap.player.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- BOTTOM HALF: TEAM A (Attacking Upward) --- */}
          <div className="relative z-10 w-full h-[300px] sm:h-[340px] mt-4">
            <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-red-950/80 px-3 py-1 rounded-xl border border-red-500/40 text-red-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-red-400" />
              <span>{teamA.name}</span>
              {teamA.captainId && <Crown className="w-3.5 h-3.5 text-amber-400" />}
            </div>

            {teamA.assignedPlayers.map((ap) => {
              const slot = {
                x: ap.x ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.x ?? 50,
                y: ap.y ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.y ?? 50,
              };
              const isSelected =
                selectedPlayerForSwap?.teamId === 'teamA' &&
                selectedPlayerForSwap?.playerId === ap.player.id;

              return (
                <div
                  key={ap.player.id}
                  onClick={() => handlePlayerTap('teamA', ap.player.id)}
                  style={{
                    left: `${slot.x}%`,
                    bottom: `${slot.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                >
                  {/* Circular Shirt Token */}
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-white ring-4 ring-amber-400/50'
                        : 'bg-gradient-to-tr from-red-700 to-red-500 border-red-300'
                    }`}
                  >
                    <span>{ap.assignedPosition}</span>

                    {/* Captain Badge */}
                    {ap.isCaptain && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center border border-white shadow-md"
                        title="Captain"
                      >
                        C
                      </div>
                    )}
                  </div>

                  {/* Player Name Pill */}
                  <div className="mt-1 px-2 py-0.5 rounded-md bg-zinc-950/90 text-white font-bold text-[10px] sm:text-xs tracking-tight truncate max-w-[90px] border border-white/20 shadow-md">
                    {ap.player.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
