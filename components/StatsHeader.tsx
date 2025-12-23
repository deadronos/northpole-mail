
import React from 'react';
import { GameState } from '../types';

interface StatsHeaderProps {
  state: GameState;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ state }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-yellow-500/20 p-3 rounded-lg text-yellow-500">
          <i className="fas fa-star text-xl"></i>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase font-bold">Total Score</p>
          <p className="text-2xl font-black text-white">{state.score}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500">
          <i className="fas fa-check-circle text-xl"></i>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase font-bold">Resolved</p>
          <p className="text-2xl font-black text-white">{state.ticketsResolved}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-1">
          <p className="text-slate-400 text-xs uppercase font-bold">Satisfaction</p>
          <span className="text-xs font-bold text-green-400">{state.satisfaction}%</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500" 
            style={{ width: `${state.satisfaction}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-1">
          <p className="text-slate-400 text-xs uppercase font-bold">Stress Level</p>
          <span className={`text-xs font-bold ${state.stressLevel > 70 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
            {state.stressLevel}%
          </span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${state.stressLevel > 70 ? 'bg-red-500' : 'bg-orange-500'}`} 
            style={{ width: `${state.stressLevel}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
