import React, { useState, useEffect } from 'react';
import { DiseaseModel, HospitalNode, TrainingLog } from '../types';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  TrendingUp, 
  Server, 
  Network, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface TrainingEngineProps {
  models: DiseaseModel[];
  nodes: HospitalNode[];
  trainingLogs: TrainingLog[];
  onAddTrainingLog: (log: TrainingLog) => void;
  onUpdateModelAccuracy: (modelId: string, newAccuracy: number, newRounds: number) => void;
  selectedModelId?: string;
}

export const TrainingEngine: React.FC<TrainingEngineProps> = ({
  models,
  nodes,
  trainingLogs,
  onAddTrainingLog,
  onUpdateModelAccuracy,
  selectedModelId: initialModelId
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId || models[0].id);
  const [aggregationMethod, setAggregationMethod] = useState<'FedAvg' | 'FedProx' | 'FedNova'>('FedAvg');
  const [learningRate, setLearningRate] = useState<number>(0.01);
  const [targetRounds, setTargetRounds] = useState<number>(5);
  const [privacyEpsilon, setPrivacyEpsilon] = useState<number>(1.2);

  // Simulation State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simulatedRound, setSimulatedRound] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Dynamic Chart Simulation Data
  const [chartData, setChartData] = useState<{ round: number; accuracy: number; loss: number }[]>([]);

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];
  const onlineNodes = nodes.filter(n => n.status !== 'offline');

  // Initialize chart data based on selected model
  useEffect(() => {
    if (selectedModel) {
      const baseAcc = selectedModel.globalAccuracy - 2.5;
      const baseLoss = 0.35;
      setChartData([
        { round: selectedModel.totalRounds - 4, accuracy: parseFloat((baseAcc - 1.2).toFixed(1)), loss: parseFloat((baseLoss + 0.04).toFixed(3)) },
        { round: selectedModel.totalRounds - 3, accuracy: parseFloat((baseAcc - 0.8).toFixed(1)), loss: parseFloat((baseLoss + 0.03).toFixed(3)) },
        { round: selectedModel.totalRounds - 2, accuracy: parseFloat((baseAcc - 0.3).toFixed(1)), loss: parseFloat((baseLoss + 0.02).toFixed(3)) },
        { round: selectedModel.totalRounds - 1, accuracy: parseFloat(baseAcc.toFixed(1)), loss: parseFloat((baseLoss + 0.01).toFixed(3)) },
        { round: selectedModel.totalRounds, accuracy: selectedModel.globalAccuracy, loss: 0.282 }
      ]);
    }
  }, [selectedModelId]);

  // Handle Training Simulation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTraining) {
      if (currentStep === 0) {
        // Step 1: Broadcast Weights
        timer = setTimeout(() => {
          setCurrentStep(1);
          setProgressPercent(25);
        }, 1200);
      } else if (currentStep === 1) {
        // Step 2: Local Client Training
        timer = setTimeout(() => {
          setCurrentStep(2);
          setProgressPercent(50);
        }, 1800);
      } else if (currentStep === 2) {
        // Step 3: Differential Privacy Noise Injection
        timer = setTimeout(() => {
          setCurrentStep(3);
          setProgressPercent(75);
        }, 1200);
      } else if (currentStep === 3) {
        // Step 4: Secure Aggregation
        timer = setTimeout(() => {
          setCurrentStep(4);
          setProgressPercent(100);
        }, 1500);
      } else if (currentStep === 4) {
        // Step 5: Global Model Update & Log Creation
        timer = setTimeout(() => {
          // Calculate new accuracy and loss
          const lastAcc = chartData[chartData.length - 1].accuracy;
          const lastLoss = chartData[chartData.length - 1].loss;
          
          const accGain = parseFloat((Math.random() * 0.4 + 0.1).toFixed(1));
          const newAcc = Math.min(98.5, parseFloat((lastAcc + accGain).toFixed(1)));
          const lossDrop = parseFloat((Math.random() * 0.015 + 0.005).toFixed(3));
          const newLoss = Math.max(0.05, parseFloat((lastLoss - lossDrop).toFixed(3)));

          const newRoundNum = selectedModel.totalRounds + simulatedRound;

          const newLog: TrainingLog = {
            id: `log-${Date.now()}`,
            round: newRoundNum,
            timestamp: 'Just now',
            modelId: selectedModel.id,
            modelName: selectedModel.name,
            participatingNodes: onlineNodes.map(n => n.name),
            globalLossBefore: lastLoss,
            globalLossAfter: newLoss,
            globalAccuracyBefore: lastAcc,
            globalAccuracyAfter: newAcc,
            aggregationMethod: aggregationMethod,
            privacyBudgetUsed: parseFloat((Math.random() * 0.02 + 0.01).toFixed(3)),
            timeTakenMs: Math.floor(Math.random() * 1500) + 3500,
            status: 'completed'
          };

          onAddTrainingLog(newLog);
          onUpdateModelAccuracy(selectedModel.id, newAcc, newRoundNum);

          setChartData(prev => [...prev.slice(1), { round: newRoundNum, accuracy: newAcc, loss: newLoss }]);

          if (simulatedRound < targetRounds) {
            setSimulatedRound(prev => prev + 1);
            setCurrentStep(0);
            setProgressPercent(0);
          } else {
            setIsTraining(false);
            setCurrentStep(0);
            setProgressPercent(0);
          }
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [isTraining, currentStep, simulatedRound, targetRounds, chartData, selectedModel, onlineNodes, aggregationMethod, onAddTrainingLog, onUpdateModelAccuracy]);

  const startTraining = () => {
    if (onlineNodes.length === 0) return;
    setIsTraining(true);
    setCurrentStep(0);
    setSimulatedRound(1);
    setProgressPercent(10);
  };

  const pauseTraining = () => {
    setIsTraining(false);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setCurrentStep(0);
    setSimulatedRound(1);
    setProgressPercent(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-cyan-400" />
          Federated Learning Aggregation & Training Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Configure hyperparameters and simulate decentralized communication rounds. Observe how the central server broadcasts global weights, local clinical enclaves compute gradients on private data, inject differential privacy noise, and securely aggregate updates via SMPC.
        </p>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Hyperparameter Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" /> Training Hyperparameters
            </h3>

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Disease Model</label>
              <select
                disabled={isTraining}
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.codeName})</option>
                ))}
              </select>
            </div>

            {/* Aggregation Algorithm */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Secure Aggregation Algorithm</label>
              <div className="grid grid-cols-3 gap-2">
                {(['FedAvg', 'FedProx', 'FedNova'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    disabled={isTraining}
                    onClick={() => setAggregationMethod(method)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      aggregationMethod === method
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    } disabled:opacity-50`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {aggregationMethod === 'FedAvg' && 'Standard Federated Averaging weighted by local patient volume.'}
                {aggregationMethod === 'FedProx' && 'Adds proximal term to stabilize training across non-IID data distributions.'}
                {aggregationMethod === 'FedNova' && 'Normalized averaging to handle heterogeneous local solver steps.'}
              </p>
            </div>

            {/* Target Rounds */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Simulated Rounds</span>
                <span className="text-cyan-400 font-mono">{targetRounds} Rounds</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                disabled={isTraining}
                value={targetRounds}
                onChange={(e) => setTargetRounds(parseInt(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Learning Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Client Learning Rate ($\eta$)</span>
                <span className="text-cyan-400 font-mono">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.05"
                step="0.001"
                disabled={isTraining}
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Privacy Budget */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Differential Privacy Noise ($\epsilon$)</span>
                <span className="text-cyan-400 font-mono">ε = {privacyEpsilon}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                disabled={isTraining}
                value={privacyEpsilon}
                onChange={(e) => setPrivacyEpsilon(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            {onlineNodes.length === 0 ? (
              <div className="bg-red-950/50 border border-red-800/50 p-3 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <span>All client nodes are offline. Please connect at least one node in the Federated Nodes tab to begin training.</span>
              </div>
            ) : !isTraining ? (
              <button
                onClick={startTraining}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Federated Training Round</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={pauseTraining}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause Training</span>
                </button>
                <button
                  onClick={resetTraining}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Simulation</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Training Visualizer & Curves (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Top Half: Step-by-Step FL Animation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-400" /> Secure Aggregation Pipeline Status
              </h3>
              {isTraining ? (
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1 rounded-full font-mono animate-pulse flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Round {simulatedRound} of {targetRounds} Active
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full font-mono">
                  Idle / Ready
                </span>
              )}
            </div>

            {/* Pipeline Steps Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {[
                { step: 0, label: '1. Broadcast Weights', desc: 'Central server sends global W_t' },
                { step: 1, label: '2. Local Training', desc: 'Nodes compute gradients locally' },
                { step: 2, label: '3. Privacy Noise', desc: 'Laplace noise injected to weights' },
                { step: 3, label: '4. SMPC Aggregation', desc: 'Secure Multi-Party Computation' },
                { step: 4, label: '5. Global Update', desc: 'New global model W_{t+1} verified' },
              ].map((item) => {
                const isActive = isTraining && currentStep === item.step;
                const isDone = isTraining && currentStep > item.step;
                return (
                  <div 
                    key={item.step} 
                    className={`p-3 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-105' 
                        : isDone 
                        ? 'bg-slate-800/80 border-emerald-500/50' 
                        : 'bg-slate-800/40 border-slate-700/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isActive ? 'text-cyan-300' : isDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {item.label}
                      </span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Step Visual Feedback Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 min-h-[80px]">
              {isTraining ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 animate-spin-slow">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-cyan-400 font-mono font-semibold uppercase">
                        Active Operation: Step {currentStep + 1}
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {currentStep === 0 && `Transmitting ${selectedModel.codeName} weights to ${onlineNodes.length} hospital enclaves...`}
                        {currentStep === 1 && `Executing backpropagation on ${onlineNodes.reduce((acc, n) => acc + n.patientCount, 0).toLocaleString()} local patient records...`}
                        {currentStep === 2 && `Applying Differential Privacy Laplace mechanism (ε=${privacyEpsilon}) to local weight tensors...`}
                        {currentStep === 3 && `Performing Secure Multi-Party Computation (SMPC) aggregation at central server...`}
                        {currentStep === 4 && `Updating global weights hash. Generating validation loss and accuracy metrics...`}
                      </div>
                    </div>
                  </div>

                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden shrink-0 hidden sm:block">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Server className="w-4 h-4 text-slate-500" />
                  <span>Select hyperparameter settings on the left and click "Start Federated Training Round" to observe the decentralized pipeline.</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Half: Live Metrics Charts & Curves */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Real-Time Global Model Performance Curves
              </h3>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[8px]">▲</span>
                  <span>Accuracy: {chartData[chartData.length - 1]?.accuracy}%</span>
                </div>
                <div className="flex items-center space-x-1.5 text-blue-400">
                  <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[8px]">▼</span>
                  <span>Loss: {chartData[chartData.length - 1]?.loss}</span>
                </div>
              </div>
            </div>

            {/* Simulated Graphic Chart */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-56 relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between p-6 pointer-events-none opacity-20">
                <div className="border-b border-slate-700 w-full"></div>
                <div className="border-b border-slate-700 w-full"></div>
                <div className="border-b border-slate-700 w-full"></div>
                <div className="border-b border-slate-700 w-full"></div>
              </div>

              {/* Chart Bars/Points */}
              <div className="relative z-10 flex items-end justify-between h-full pt-4 px-2 sm:px-8">
                {chartData.map((data, idx) => {
                  // Calculate height percentage based on accuracy (scaled between 80% and 100%)
                  const heightPercentAcc = Math.max(15, ((data.accuracy - 80) / 20) * 100);
                  // Calculate height percentage based on loss (scaled between 0.05 and 0.45)
                  const heightPercentLoss = Math.max(10, ((data.loss) / 0.45) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center space-y-2 group w-12 sm:w-16">
                      <div className="flex items-end space-x-1.5 w-full justify-center h-36">
                        {/* Loss Bar */}
                        <div 
                          style={{ height: `${heightPercentLoss}%` }} 
                          className="w-3 sm:w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 relative"
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-[10px] text-blue-300 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            {data.loss}
                          </span>
                        </div>

                        {/* Accuracy Bar */}
                        <div 
                          style={{ height: `${heightPercentAcc}%` }} 
                          className="w-3 sm:w-4 bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t-md transition-all duration-500 relative"
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-[10px] text-emerald-300 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            {data.accuracy}%
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        Round {data.round}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 mt-2">
                <span>Recent Communication Rounds</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Validation Accuracy</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Cross-Entropy Loss</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Training Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Federated Communication & Aggregation Audit Logs
            </h3>
            <p className="text-xs text-slate-400">Immutable record of secure global weight updates and differential privacy budget consumption.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            Total Logs: {trainingLogs.length}
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-semibold">
                <th className="p-3.5">Round</th>
                <th className="p-3.5">Model</th>
                <th className="p-3.5">Participating Enclaves</th>
                <th className="p-3.5">Aggregation</th>
                <th className="p-3.5">Loss Change</th>
                <th className="p-3.5">Accuracy Change</th>
                <th className="p-3.5">Privacy Epsilon ($\epsilon$) Used</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {trainingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors font-mono">
                  <td className="p-3.5 font-bold text-white">#{log.round}</td>
                  <td className="p-3.5 font-sans font-medium text-cyan-300">{log.modelName}</td>
                  <td className="p-3.5 font-sans text-slate-400 max-w-xs truncate" title={log.participatingNodes.join(', ')}>
                    {log.participatingNodes.length} Nodes ({log.participatingNodes.slice(0, 2).join(', ')}...)
                  </td>
                  <td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200 border border-slate-700">{log.aggregationMethod}</span></td>
                  <td className="p-3.5">
                    <span className="text-slate-400">{log.globalLossBefore}</span>{' '}
                    <ArrowRight className="w-3 h-3 inline text-slate-500" />{' '}
                    <span className="text-blue-400 font-bold">{log.globalLossAfter}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-400">{log.globalAccuracyBefore}%</span>{' '}
                    <ArrowRight className="w-3 h-3 inline text-slate-500" />{' '}
                    <span className="text-emerald-400 font-bold">{log.globalAccuracyAfter}%</span>
                  </td>
                  <td className="p-3.5 text-indigo-400">ε = {log.privacyBudgetUsed}</td>
                  <td className="p-3.5 text-slate-400">{log.timeTakenMs} ms</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
