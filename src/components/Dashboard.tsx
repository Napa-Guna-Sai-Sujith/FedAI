import React from 'react';
import { DiseaseModel, HospitalNode } from '../types';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Server, 
  CheckCircle2, 
  Lock,
  RefreshCw,
  TrendingUp,
  FileText
} from 'lucide-react';

interface DashboardProps {
  models: DiseaseModel[];
  nodes: HospitalNode[];
  onSelectModelForTraining: (modelId: string) => void;
  onSelectModelForPrediction: (modelId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  models,
  nodes,
  onSelectModelForTraining,
  onSelectModelForPrediction,
  onNavigateToTab
}) => {
  const totalRounds = models.reduce((acc, m) => acc + m.totalRounds, 0);
  const avgAccuracy = (models.reduce((acc, m) => acc + m.globalAccuracy, 0) / models.length).toFixed(1);
  const totalPatients = nodes.reduce((acc, n) => acc + n.patientCount, 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl -mb-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-400/40 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Next-Gen Decentralized Healthcare AI</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Privacy-Preserving Disease Risk Prediction <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Using Federated Neural Networks
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl font-normal">
            Traditional AI requires centralizing sensitive patient records, creating massive HIPAA/GDPR liabilities. 
            <strong className="text-white font-semibold"> FedHealth AI</strong> enables hospitals to collaboratively train clinical deep neural networks 
            locally. Only differentially-private model weights are encrypted and aggregated centrally—achieving state-of-the-art predictive accuracy with zero raw data exposure.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onNavigateToTab('training')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-cyan-500/20 flex items-center space-x-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-slate-950" />
              <span>Simulate Federated Training</span>
            </button>
            <button
              onClick={() => onNavigateToTab('predictor')}
              className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700/80 font-bold px-6 py-3.5 rounded-xl text-sm flex items-center space-x-2.5 transition-all transform hover:-translate-y-0.5 shadow-lg backdrop-blur-sm cursor-pointer"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Patient Risk Predictor</span>
            </button>
            <button
              onClick={() => onNavigateToTab('guide')}
              className="bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-slate-700 font-semibold px-5 py-3.5 rounded-xl text-sm flex items-center space-x-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Read Architecture Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all group backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Global Models</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{models.length}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% SMPC Protected
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all group backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Aggregated FL Rounds</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{totalRounds}</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-4 h-4" /> FedAvg / FedProx algorithms
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all group backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Average Global Accuracy</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{avgAccuracy}%</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">Across diverse demographics</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all group backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Total Patient Records</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{totalPatients.toLocaleString()}</div>
          <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1.5 font-medium">
            <Lock className="w-4 h-4" /> 0 Raw Records Transmitted
          </div>
        </div>
      </div>

      {/* Disease Models Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5 tracking-tight">
              <Layers className="w-6 h-6 text-cyan-400" />
              Active Federated Disease Models
            </h2>
            <p className="text-xs text-slate-400 mt-1">Collaboratively trained neural networks ready for privacy-preserved clinical inference.</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('training')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <span>View All Training Logs</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div 
              key={model.id} 
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:border-cyan-500/40 hover:shadow-cyan-500/5 transition-all duration-300 group"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] px-3 py-1 rounded-full font-mono font-bold tracking-wide shadow-sm">
                      {model.codeName}
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-3 group-hover:text-cyan-300 transition-colors tracking-tight leading-snug">
                      {model.name}
                    </h3>
                  </div>
                  <span className="bg-slate-800/90 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg font-bold border border-slate-700/60 shrink-0 shadow-sm">
                    {model.clinicalFocus}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 font-normal">
                  {model.description}
                </p>

                {/* Accuracy Bar */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Global Model Accuracy</span>
                    <span className="text-emerald-400 font-mono text-sm">{model.globalAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50" 
                      style={{ width: `${model.globalAccuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 shadow-inner">
                    <div className="text-slate-400 text-[11px] font-medium">Communication Rounds</div>
                    <div className="font-extrabold text-slate-100 mt-1 text-sm">{model.totalRounds} Rounds</div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 shadow-inner">
                    <div className="text-slate-400 text-[11px] font-medium">Privacy Epsilon</div>
                    <div className="font-extrabold text-cyan-400 mt-1 font-mono text-sm">ε = {model.privacyEpsilon}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
                  <span className="truncate max-w-[180px]">Arch: {model.architecture.split('(')[0]}</span>
                  <span className="shrink-0">{model.lastUpdated}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-6 mt-5 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectModelForTraining(model.id)}
                  className="bg-slate-800/90 hover:bg-slate-700 text-slate-100 text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer border border-slate-700/80 hover:border-slate-600"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Train Model</span>
                </button>
                <button
                  onClick={() => onSelectModelForPrediction(model.id)}
                  className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Run Predictor</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Network Topology Visualizer */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5 tracking-tight">
              <Server className="w-6 h-6 text-indigo-400" />
              Decentralized Federated Network Topology
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Visualizing how secure multi-party computation (SMPC) and homomorphic encryption isolate raw patient data at local clinical enclaves.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-bold bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 shadow-inner">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500"></span>
              <span className="text-slate-300 font-sans font-medium">Local Data Enclave</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
              <span className="text-slate-300 font-sans font-medium">Encrypted Weights ($W_i$)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500"></span>
              <span className="text-slate-300 font-sans font-medium">Central Aggregator</span>
            </div>
          </div>
        </div>

        {/* Diagram container */}
        <div className="relative bg-slate-950/90 rounded-2xl p-8 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center py-16 shadow-2xl">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-30"></div>

          {/* Central Server */}
          <div className="relative z-10 flex flex-col items-center mb-20">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/40 animate-bounce-slow">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-3 text-center">
                <Cpu className="w-10 h-10 text-indigo-400 mb-1 animate-pulse" />
                <span className="text-xs font-extrabold text-white">FedAvg / SMPC</span>
                <span className="text-[10px] text-cyan-300 font-mono font-semibold mt-0.5">Central Aggregator</span>
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-700/80 px-5 py-2 rounded-full text-xs text-slate-200 mt-4 shadow-xl flex items-center gap-2 backdrop-blur-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Raw Data Access Guarantee</span>
            </div>
          </div>

          {/* Connecting Animated Lines */}
          <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-full max-w-5xl h-36 pointer-events-none flex justify-around px-8">
            {nodes.slice(0, 4).map((_, idx) => (
              <div key={idx} className="w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-400 to-slate-800 h-full relative opacity-70">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 animate-ping shadow-md shadow-cyan-400"></div>
                <div className="absolute bottom-1/2 left-2 transform -translate-y-1/2 bg-slate-900/90 border border-slate-700/80 text-[10px] text-cyan-300 px-2 py-1 rounded-lg font-mono hidden md:block font-bold shadow-md backdrop-blur-sm">
                  ΔW_{idx+1} (Encrypted)
                </div>
              </div>
            ))}
          </div>

          {/* Client Nodes Row */}
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {nodes.slice(0, 4).map((node) => (
              <div key={node.id} className="bg-slate-900/90 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-5 shadow-2xl text-center space-y-3 hover:border-slate-700/80 hover:shadow-indigo-500/5 transition-all duration-300 group">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <Server className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-base font-extrabold text-white truncate tracking-tight">{node.name}</h4>
                <div className="text-[11px] text-slate-400 font-mono">{node.location}</div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-left text-xs space-y-1.5 shadow-inner">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Local Records:</span>
                    <span className="font-mono text-cyan-300 font-bold">{node.patientCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Privacy Noise:</span>
                    <span className="font-mono text-indigo-300 font-bold">ε = {node.privacyNoiseLevel}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Local Acc:</span>
                    <span className="font-mono text-emerald-400 font-bold">{node.localAccuracy}%</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1.5 pt-1">
                  <Lock className="w-3.5 h-3.5" /> Encrypted Local Enclave
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigateToTab('nodes')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1.5 cursor-pointer bg-slate-900/80 px-5 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-md"
            >
              <span>Manage All {nodes.length} Client Nodes & Data Distributions</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
