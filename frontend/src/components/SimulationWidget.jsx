import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Compass, Coffee, Clock, RefreshCw, X, AlertCircle } from 'lucide-react';

export default function SimulationWidget({
  onSimulateTraffic,
  onSimulateAttractionClosed,
  onSimulateRestaurantFull,
  onSimulateNewEvent,
  onResetSimulation,
  activeAlert
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Alert Banner / Notification Toast */}
      {activeAlert && (
        <div className="w-80 sm:w-96 bg-slate-900/95 border-2 border-amber-500/50 backdrop-blur-md p-4 rounded-xl shadow-xl pointer-events-auto animate-bounce-short text-white">
          <div className="flex gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#ff7a18]">
                {activeAlert.agentName} Live Assist
              </span>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                {activeAlert.message}
              </p>
              {activeAlert.action && (
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={activeAlert.action.handler}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                  >
                    {activeAlert.action.text}
                  </button>
                  <button
                    type="button"
                    onClick={activeAlert.onDismiss}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-gray-300 text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Widget Panel */}
      {isOpen ? (
        <div className="w-80 bg-slate-950/90 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#ff7a18] animate-pulse" />
              <h3 className="font-bold text-sm">AI Agent Live Simulator</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Trigger real-time scenarios to simulate how the AI agent collective coordinates updates during the trip.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => onSimulateTraffic && onSimulateTraffic()}
              className="flex items-center gap-3 p-2 bg-slate-900 border border-white/5 hover:border-blue-500/30 rounded-xl transition-all hover:bg-slate-900/60 cursor-pointer text-left group"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 shrink-0">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">1. Traffic Congestion</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Recalculates route with detours (+15m)</div>
              </div>
            </button>

            <button
              onClick={() => onSimulateAttractionClosed && onSimulateAttractionClosed()}
              className="flex items-center gap-3 p-2 bg-slate-900 border border-white/5 hover:border-[#ff7a18]/30 rounded-xl transition-all hover:bg-slate-900/60 cursor-pointer text-left group"
            >
              <div className="p-2 bg-[#ff7a18]/10 rounded-lg text-[#ff7a18] group-hover:bg-[#ff7a18]/20 shrink-0">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">2. Attraction Closed</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Suggests an alternative scenic spot</div>
              </div>
            </button>

            <button
              onClick={() => onSimulateRestaurantFull && onSimulateRestaurantFull()}
              className="flex items-center gap-3 p-2 bg-slate-900 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all hover:bg-slate-900/60 cursor-pointer text-left group"
            >
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 shrink-0">
                <Coffee className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">3. Restaurant Booked Out</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Recommends an available alternative</div>
              </div>
            </button>

            <button
              onClick={() => onSimulateNewEvent && onSimulateNewEvent()}
              className="flex items-center gap-3 p-2 bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all hover:bg-slate-900/60 cursor-pointer text-left group"
            >
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 shrink-0">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">4. Live Event Notification</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Discovers popup food festival nearby</div>
              </div>
            </button>
          </div>

          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
            <button
              onClick={() => onResetSimulation && onResetSimulation()}
              className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset simulation
            </button>
            <span className="text-[9px] bg-slate-800 text-gray-400 px-2 py-0.5 rounded font-mono">
              Live updates active
            </span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="h-12 px-4 rounded-full bg-[#1e293b] border border-white/10 shadow-2xl flex items-center gap-2 pointer-events-auto hover:bg-[#334155] active:scale-95 transition-all text-white cursor-pointer"
        >
          <Sparkles className="h-5 w-5 text-[#ff7a18] animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase">Simulate Agents</span>
        </button>
      )}
    </div>
  );
}
