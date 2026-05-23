import React, { useState } from 'react';
import { 
  Brain,
  Cpu, 
  Activity, 
  Heart, 
  Layers, 
  GitBranch, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2,
  Database,
  Zap
} from 'lucide-react';

interface NeuralNetworkVisualizerProps {
  onNavigateToTab?: (tab: string) => void;
}

export const NeuralNetworkVisualizer: React.FC<NeuralNetworkVisualizerProps> = () => {
  const [activeModelId, setActiveModelId] = useState<string>('diabetes');

  const diseaseModels = [
    {
      id: 'diabetes',
      name: 'DiaFed-AI',
      title: 'Diabetes Type 2 Progression',
      color: 'cyan',
      architecture: [
        { name: 'Input Layer (6 neurons)', detail: 'Age, Glucose, BMI, BP, Smoker, FamilyHistory' },
        { name: 'Dense(128) + BatchNorm', detail: 'Linear → BatchNorm → ReLU → Dropout(0.3)' },
        { name: 'Dense(64) + LeakyReLU', detail: 'Linear → LeakyReLU(α=0.01) → BatchNorm' },
        { name: 'Dense(32) + ReLU', detail: 'Linear → ReLU → Dropout(0.2)' },
        { name: 'Output Layer (1 neuron)', detail: 'Dense(1) → Sigmoid → Binary CrossEntropy' }
      ],
      weights: 'W: [0.85, 2.45, 1.65, 0.55, 0.35, 1.10] | b: -4.20',
      optimizer: 'Adam (η=0.001, β1=0.9, β2=0.999)',
      totalParams: 12_481,
      epochs: 50,
      batchSize: 128,
      activation: 'ReLU + LeakyReLU + Sigmoid'
    },
    {
      id: 'cvd',
      name: 'CVD-Net',
      title: 'Cardiovascular Disease Risk',
      color: 'rose',
      architecture: [
        { name: 'Input Layer (6 neurons)', detail: 'Age, Glucose, BMI, BP, Smoker, FamilyHistory' },
        { name: 'Dense(128) + BatchNorm', detail: 'Linear → BatchNorm → ReLU → Dropout(0.3)' },
        { name: 'Dense(64) + LeakyReLU', detail: 'Linear → LeakyReLU(α=0.01) → BatchNorm' },
        { name: 'Dense(32) + ReLU', detail: 'Linear → ReLU → Dropout(0.25)' },
        { name: 'Output Layer (1 neuron)', detail: 'Dense(1) → Sigmoid → Binary CrossEntropy' }
      ],
      weights: 'W: [1.45, 0.65, 1.15, 2.25, 1.95, 0.85] | b: -4.80',
      optimizer: 'Adam (η=0.001, β1=0.9, β2=0.999)',
      totalParams: 12_481,
      epochs: 75,
      batchSize: 128,
      activation: 'ReLU + LeakyReLU + Sigmoid'
    },
    {
      id: 'ckd',
      name: 'RenalGuard FNN',
      title: 'Chronic Kidney Disease',
      color: 'amber',
      architecture: [
        { name: 'Input Layer (6 neurons)', detail: 'Age, Creatinine, eGFR, Glucose, BMI, BP' },
        { name: 'Dense(96) + ELU', detail: 'Linear → ELU(α=1.0) → BatchNorm → Dropout(0.2)' },
        { name: 'Dense(48) + ReLU', detail: 'Linear → ReLU → BatchNorm' },
        { name: 'Dense(24) + LeakyReLU', detail: 'Linear → LeakyReLU(α=0.01) → Dropout(0.15)' },
        { name: 'Output Layer (1 neuron)', detail: 'Dense(1) → Sigmoid → Binary CrossEntropy' }
      ],
      weights: 'W: [1.55, 3.05, -2.45, 1.10, 0.95, 1.85] | b: -3.90',
      optimizer: 'Adam (η=0.0008, β1=0.9, β2=0.999)',
      totalParams: 7_225,
      epochs: 40,
      batchSize: 96,
      activation: 'ELU + ReLU + LeakyReLU + Sigmoid'
    },
    {
      id: 'copd',
      name: 'PneumoFed',
      title: 'COPD Respiratory Risk',
      color: 'purple',
      architecture: [
        { name: 'Input Layer (6 neurons)', detail: 'Age, Smoking, FEV1%, BMI, BP, Glucose' },
        { name: 'Dense(64) + Tanh', detail: 'Linear → Tanh → BatchNorm → Dropout(0.4)' },
        { name: 'Dense(32) + ReLU', detail: 'Linear → ReLU → BatchNorm' },
        { name: 'Dense(16) + LeakyReLU', detail: 'Linear → LeakyReLU(α=0.01) → Dropout(0.2)' },
        { name: 'Output Layer (1 neuron)', detail: 'Dense(1) → Sigmoid → Binary CrossEntropy' }
      ],
      weights: 'W: [2.10, 3.35, -2.85, 0.45, 0.65, 0.35] | b: -4.10',
      optimizer: 'Adam (η=0.001, β1=0.9, β2=0.999)',
      totalParams: 3_969,
      epochs: 35,
      batchSize: 64,
      activation: 'Tanh + ReLU + LeakyReLU + Sigmoid'
    },
    {
      id: 'oncology',
      name: 'OncoFed-Pro',
      title: 'Oncology Recurrence Risk',
      color: 'red',
      architecture: [
        { name: 'Input Layer (6 neurons)', detail: 'Age, FamilyHistory, TumorGrade, LymphNode, BMI, Biomarker' },
        { name: 'Dense(128) + GELU', detail: 'Linear → GELU → BatchNorm → Dropout(0.35)' },
        { name: 'Dense(64) + ReLU', detail: 'Linear → ReLU → BatchNorm' },
        { name: 'Dense(32) + LeakyReLU', detail: 'Linear → LeakyReLU(α=0.01) → Dropout(0.3)' },
        { name: 'Output Layer (1 neuron)', detail: 'Dense(1) → Sigmoid → Binary CrossEntropy' }
      ],
      weights: 'W: [2.05, 2.65, 2.15, 0.55, 0.95, 0.25] | b: -5.10',
      optimizer: 'Adam (η=0.0005, β1=0.9, β2=0.999)',
      totalParams: 16_641,
      epochs: 60,
      batchSize: 64,
      activation: 'GELU + ReLU + LeakyReLU + Sigmoid'
    }
  ];

  const activeModel = diseaseModels.find(m => m.id === activeModelId) || diseaseModels[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-950 border border-indigo-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl -mb-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2.5 bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider shadow-lg backdrop-blur-sm">
            <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Deep Feedforward Neural Network Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Neural Network Architecture & <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Clinical Deep Learning Visualizer
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl font-normal">
            Explore the exact multi-layer Feedforward Neural Network (FNN) architectures powering each disease prediction model. Each network uses Batch Normalization, Dropout regularization, advanced activation functions (ReLU, LeakyReLU, ELU, GELU, Tanh), and Adam optimization with Differential Privacy (ε-controlled Laplace noise injection).
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Layer FNN</span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> BatchNorm + Dropout</span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Adam Optimizer</span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Differential Privacy SGD</span>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-2 grid grid-cols-2 sm:grid-cols-5 gap-2 shadow-2xl">
        {diseaseModels.map(model => (
          <button
            key={model.id}
            onClick={() => setActiveModelId(model.id)}
            className={`py-3.5 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeModelId === model.id
                ? `bg-gradient-to-r from-${model.color}-500 to-${model.color === 'amber' ? 'orange' : model.color}-600 text-slate-950 shadow-lg shadow-${model.color}-500/20`
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {model.id === 'diabetes' ? <Activity className="w-4 h-4" /> :
             model.id === 'cvd' ? <Heart className="w-4 h-4" /> :
             model.id === 'ckd' ? <Database className="w-4 h-4" /> :
             model.id === 'copd' ? <Zap className="w-4 h-4" /> :
             <Sparkles className="w-4 h-4" />}
            <span>{model.name}</span>
          </button>
        ))}
      </div>

      {/* Selected Model Deep Dive */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-8">
        
        {/* Model Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 bg-gradient-to-tr from-${activeModel.color}-500 to-${activeModel.color === 'amber' ? 'orange' : activeModel.color}-600 rounded-3xl text-slate-950 shadow-xl shadow-${activeModel.color}-500/20`}>
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-extrabold uppercase tracking-wider">{activeModel.name} v4.2</span>
              <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight">{activeModel.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pre-trained Federated FNN with Differential Privacy</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-400 font-mono">Total Params</div>
              <div className="text-sm font-extrabold text-white font-mono">{activeModel.totalParams.toLocaleString()}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-400 font-mono">Epochs</div>
              <div className="text-sm font-extrabold text-white font-mono">{activeModel.epochs}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-400 font-mono">Batch Size</div>
              <div className="text-sm font-extrabold text-white font-mono">{activeModel.batchSize}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-[10px] text-slate-400 font-mono">Optimizer</div>
              <div className="text-sm font-extrabold text-cyan-300 font-mono">Adam</div>
            </div>
          </div>
        </div>

        {/* Neural Network Layers Visual Stack */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" /> Multi-Layer Architecture Stack (Input → Hidden → Output)
          </h3>

          <div className="bg-slate-950/90 border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-4">
            {activeModel.architecture.map((layer, idx) => {
              const isInput = idx === 0;
              const isOutput = idx === activeModel.architecture.length - 1;
              const isHidden = !isInput && !isOutput;

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Layer Node */}
                  <div className={`w-full p-5 rounded-2xl border shadow-xl transition-all ${
                    isInput 
                      ? 'bg-slate-900/80 border-slate-700/80' 
                      : isHidden
                      ? `bg-gradient-to-r from-${activeModel.color}-500/10 to-${activeModel.color === 'amber' ? 'orange' : activeModel.color}-500/10 border-${activeModel.color}-500/30`
                      : `bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/40 shadow-indigo-500/10`
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl ${
                          isInput ? 'bg-slate-800 text-slate-300' :
                          isHidden ? `bg-${activeModel.color}-500/20 text-${activeModel.color}-300` :
                          'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {isInput ? <Database className="w-5 h-5" /> :
                           isHidden ? <Cpu className="w-5 h-5" /> :
                           <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-white font-sans tracking-tight">{layer.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{layer.detail}</div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center space-x-2">
                        <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-lg border ${
                          isInput ? 'bg-slate-800 text-slate-400 border-slate-700' :
                          isHidden ? `bg-${activeModel.color}-500/10 text-${activeModel.color}-300 border-${activeModel.color}-500/20` :
                          'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        }`}>
                          {isInput ? 'Input' : isHidden ? `Layer ${idx}` : 'Classification Head'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connector Arrow between layers */}
                  {idx < activeModel.architecture.length - 1 && (
                    <div className="flex flex-col items-center py-2">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-slate-600 via-cyan-500/40 to-slate-600"></div>
                      <ArrowDown className="w-5 h-5 text-cyan-400/60" />
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5 text-center">
                        {isInput ? 'W_1 · X + b_1 → Act → Norm → Drop' : 'W_n · h_{n-1} + b_n → Act → Norm → Drop'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weight Matrix & Activation Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-inner">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <GitBranch className="w-4 h-4 text-cyan-400" /> Weight Matrix Configuration
            </h4>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 space-y-2 leading-relaxed">
              <div className="text-slate-300"><span className="text-slate-400">Type:</span> Feedforward Neural Network (FNN)</div>
              <div className="text-slate-300">{activeModel.weights}</div>
              <div className="text-slate-300"><span className="text-slate-400">Init:</span> Xavier/Glorot Uniform</div>
              <div className="text-slate-300"><span className="text-slate-400">Regularization:</span> L2(λ=1e-4) + Dropout</div>
              <div className="text-slate-300"><span className="text-slate-400">Privacy:</span> Laplace DP (ε=1.24, δ=1e-5)</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-inner">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Cpu className="w-4 h-4 text-emerald-400" /> Activation & Optimization
            </h4>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 space-y-2 leading-relaxed">
              <div className="text-slate-300"><span className="text-slate-400">Activation:</span> {activeModel.activation}</div>
              <div className="text-slate-300"><span className="text-slate-400">Optimizer:</span> {activeModel.optimizer}</div>
              <div className="text-slate-300"><span className="text-slate-400">Loss Function:</span> Binary Cross-Entropy</div>
              <div className="text-slate-300"><span className="text-slate-400">Gradient Clipping:</span> C = 1.0 (L2 Norm)</div>
              <div className="text-slate-300"><span className="text-slate-400">DP Noise:</span> Laplace(2C/ε)</div>
            </div>
          </div>
        </div>

        {/* Connection to Federated Training */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-4">
            <GitBranch className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold text-white tracking-tight">Federated Training Integration</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Each neural network architecture trains locally inside isolated hospital enclaves using the same multi-layer FNN topology. The FedAvg algorithm aggregates differentially-private weight updates from all enclaves into a global consensus model without ever sharing raw patient data.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
              <div className="text-xs font-extrabold text-cyan-400">Local SGD</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">End-to-end backpropagation with DP noise injection is executed locally on each clinical enclave.</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
              <div className="text-xs font-extrabold text-cyan-400">FedAvg Aggregation</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">Central server merges encrypted ΔW_i from 3 hospitals into W_(t+1) using sample-weighted FedAvg.</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
              <div className="text-xs font-extrabold text-cyan-400">SHAP Evaluated</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">Global model is evaluated with exact Shapley feature attributions for transparent clinical trust.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};