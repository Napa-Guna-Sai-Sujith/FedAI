import React from 'react';
import { 
  ShieldCheck, 
  Network, 
  Cpu, 
  Stethoscope, 
  Activity, 
  Lock, 
  BookOpen, 
  Server,
  Layers,
  Radio,
  Play,
  User,
  Database,
  Brain
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeNodesCount: number;
  globalEpsilon: number;
  totalRecords: number;
  isLiveMode?: boolean;
  onOpenAuth: () => void;
  currentUser: any | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeNodesCount,
  globalEpsilon,
  totalRecords,
  isLiveMode = false,
  onOpenAuth,
  currentUser
}) => {
  const tabs = [
    { id: 'livedemo', label: '🔴 Live Judges Demo', icon: Play },
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'working_model', label: 'End-to-End Working Model', icon: Layers },
    { id: 'nn_visualizer', label: 'Neural Network Architecture', icon: Brain },
    { id: 'telemetry', label: 'Live Telemetry & Feeds', icon: Radio },
    { id: 'nodes', label: 'Federated Nodes', icon: Server },
    { id: 'training', label: 'FL Live Training', icon: Cpu },
    { id: 'predictor', label: 'Risk Predictor', icon: Stethoscope },
    { id: 'datasets_repo', label: 'Clinical Datasets Repository', icon: Database },
    { id: 'audit', label: 'Privacy Audit', icon: ShieldCheck },
    { id: 'guide', label: 'FL Architecture', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/80 text-white sticky top-0 z-50 shadow-2xl shadow-slate-950/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setActiveTab('working_model')}>
            <div className={`bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 border ${
              activeTab === 'working_model'
                ? 'shadow-cyan-400/40 border-cyan-300/50 ring-4 ring-cyan-500/20'
                : 'shadow-cyan-500/20 border-cyan-400/30'
            }`}>
              <Network className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className={`font-extrabold text-xl tracking-tight bg-gradient-to-r bg-clip-text text-transparent transition-colors ${
                  activeTab === 'working_model'
                    ? 'from-white via-cyan-100 to-cyan-300'
                    : 'from-white via-slate-100 to-cyan-300 group-hover:text-cyan-300'
                }`}>
                  FedHealth AI
                </span>
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] px-2.5 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1 shadow-sm shadow-cyan-500/10">
                  <Lock className="w-3 h-3 text-cyan-400" /> SMPC Encrypted
                </span>
              </div>
              <p className={`text-xs hidden sm:block transition-colors ${activeTab === 'working_model' ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-300'}`}>
                Privacy-Preserving Disease Risk Prediction via Federated Neural Networks
              </p>
            </div>
          </div>

          {/* Global System Badges */}
          <div className="hidden lg:flex items-center space-x-5 text-xs border-l border-slate-800/80 pl-6">
            {isLiveMode ? (
              <div className="flex items-center space-x-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 animate-pulse shadow-inner">
                <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-rose-400 font-bold tracking-wider text-[10px]">LIVE TELEMETRY</div>
                  <div className="text-[11px] text-rose-300 font-mono font-semibold">Websocket Active</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl p-2.5">
                <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400 font-semibold text-[10px]">Telemetry Feed</div>
                  <div className="font-bold text-slate-300 text-[11px]">Paused / Standby</div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl p-2.5 hover:border-slate-600 transition-all">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 text-[10px] font-semibold">Active Nodes</div>
                <div className="font-bold text-slate-100 text-[11px]">{activeNodesCount} Enclaves</div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl p-2.5 hover:border-slate-600 transition-all">
              <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/20">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 text-[10px] font-semibold">Privacy Budget ($\epsilon$)</div>
                <div className="font-bold text-cyan-300 font-mono text-[11px]">ε ≤ {globalEpsilon.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl p-2.5 hover:border-slate-600 transition-all">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 text-[10px] font-semibold">Protected Records</div>
                <div className="font-bold text-indigo-300 font-mono text-[11px]">{totalRecords.toLocaleString()}</div>
              </div>
            </div>

            {/* Auth Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer ${
                currentUser 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="max-w-[120px] truncate font-sans">
                {currentUser ? currentUser.user_metadata?.full_name || currentUser.email : 'Sign In / Supabase'}
              </span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto py-2.5 border-t border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10 scale-105'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:border-slate-700 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-400 rounded-full shadow-md shadow-cyan-400"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
