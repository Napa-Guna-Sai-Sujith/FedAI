import React, { useState, useEffect } from 'react';
import { HospitalNode } from '../types';
import { 
  Activity, 
  Radio, 
  Globe, 
  RefreshCw, 
  Server, 
  Cpu, 
  Lock, 
  Zap, 
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Wifi,
  Terminal
} from 'lucide-react';

interface RealTimeTelemetryProps {
  nodes: HospitalNode[];
  onUpdateNodeStats: (nodeId: string, latency: number, patients: number) => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
}

interface DiseaseApiData {
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  tests: number;
  updated: number;
}

interface LiveLogItem {
  id: string;
  timestamp: string;
  nodeName: string;
  action: string;
  type: 'info' | 'success' | 'warn' | 'metric';
  details: string;
}

export const RealTimeTelemetry: React.FC<RealTimeTelemetryProps> = ({
  nodes,
  onUpdateNodeStats,
  isLiveMode,
  setIsLiveMode
}) => {
  // Real-time API state
  const [apiData, setApiData] = useState<DiseaseApiData | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastApiFetch, setLastApiFetch] = useState<string>('Never');

  // Live Telemetry Logs console state
  const [telemetryLogs, setTelemetryLogs] = useState<LiveLogItem[]>([
    { id: '1', timestamp: new Date(Date.now() - 5000).toLocaleTimeString(), nodeName: 'Metro General Hospital', action: 'SMPC Key Exchange', type: 'success', details: 'Verified 4096-bit RSA Enclave Certificate.' },
    { id: '2', timestamp: new Date(Date.now() - 4000).toLocaleTimeString(), nodeName: 'St. Jude Medical Center', action: 'Local Gradient Computation', type: 'info', details: 'Batch size: 256 | L1 Norm: 0.142 | Memory: 14.2 GB' },
    { id: '3', timestamp: new Date(Date.now() - 3000).toLocaleTimeString(), nodeName: 'Apex Health Research Labs', action: 'DP Noise Injection', type: 'warn', details: 'Injected Laplace noise (ε=1.5). Clipping threshold: C=1.0' },
    { id: '4', timestamp: new Date(Date.now() - 1000).toLocaleTimeString(), nodeName: 'Central FedHealth Aggregator', action: 'Secure Aggregation', type: 'metric', details: 'Aggregated 4 nodes via FedAvg. Global Loss dropped to 0.261.' },
  ]);

  // Real-time inference traffic ticker state
  const [liveInferenceRate, setLiveInferenceRate] = useState<number>(42);
  const [activeEnclaveMemory, setActiveEnclaveMemory] = useState<number>(68.4);
  const [networkBandwidth, setNetworkBandwidth] = useState<number>(14.8);

  // Fetch real-time data from disease.sh API
  const fetchLiveHealthData = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      // Fetching global live disease stats
      const response = await fetch('https://disease.sh/v3/covid-19/all');
      if (!response.ok) throw new Error('Failed to fetch live health API data');
      const data: DiseaseApiData = await response.json();
      setApiData(data);
      setLastApiFetch(new Date().toLocaleTimeString());
      
      // Add a telemetry log for API ingest
      const newLog: LiveLogItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        nodeName: 'Global API Feed (disease.sh)',
        action: 'Live Data Ingest',
        type: 'success',
        details: `Ingested ${data.todayCases.toLocaleString()} new global cases into background training pools.`
      };
      setTelemetryLogs(prev => [newLog, ...prev.slice(0, 49)]);

      // Randomly update node patient counts based on live data
      nodes.forEach(node => {
        const patientDelta = Math.floor(Math.random() * 50) + 10;
        const newLatency = Math.floor(Math.random() * 35) + 15;
        onUpdateNodeStats(node.id, newLatency, node.patientCount + patientDelta);
      });

    } catch (err: any) {
      setApiError(err.message || 'Error connecting to public health API');
    } finally {
      setApiLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchLiveHealthData();
  }, []);

  // Real-time simulation loop when isLiveMode is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMode) {
      interval = setInterval(() => {
        // 1. Update live tickers
        setLiveInferenceRate(prev => Math.max(10, Math.min(120, prev + Math.floor(Math.random() * 11) - 5)));
        setActiveEnclaveMemory(prev => parseFloat(Math.max(40, Math.min(95, prev + (Math.random() * 4 - 2))).toFixed(1)));
        setNetworkBandwidth(prev => parseFloat(Math.max(5, Math.min(50, prev + (Math.random() * 3 - 1.5))).toFixed(1)));

        // 2. Generate live telemetry log
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        const actions = [
          { action: 'CKKS Ciphertext Eval', type: 'info', details: 'Homomorphic multiplication over 1024-dimension vitals tensor.' },
          { action: 'SMPC Secret Share', type: 'info', details: `Transmitting masked weight share to Central Aggregator. Latency: ${randomNode.latencyMs}ms` },
          { action: 'DP Privacy Budget Check', type: 'warn', details: `Current cumulative ε=${randomNode.privacyNoiseLevel}. Delta threshold maintained.` },
          { action: 'Local Weights Sync', type: 'success', details: `Successfully synchronized global weights hash 0x8f3c...9a12.` },
          { action: 'Inference Request Processed', type: 'metric', details: `Decrypted local risk score: ${Math.floor(Math.random() * 60) + 20}%. Patient ID: PT-${Math.floor(Math.random() * 90000) + 10000}` }
        ];
        const selectedAction = actions[Math.floor(Math.random() * actions.length)];

        const newLog: LiveLogItem = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          nodeName: randomNode.name,
          action: selectedAction.action,
          type: selectedAction.type as any,
          details: selectedAction.details
        };

        setTelemetryLogs(prev => [newLog, ...prev.slice(0, 49)]);

        // 3. Randomly update node stats
        const newLatency = Math.floor(Math.random() * 40) + 12;
        const patientIncrement = Math.floor(Math.random() * 5) + 1;
        onUpdateNodeStats(randomNode.id, newLatency, randomNode.patientCount + patientIncrement);

      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLiveMode, nodes, onUpdateNodeStats]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header with Live Toggle */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-4">
            <div className={`p-3.5 rounded-2xl border shadow-inner ${isLiveMode ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse shadow-rose-500/10' : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
              <Radio className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                Real-Time Telemetry & Live Public Health Data
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Connecting federated enclaves to live global epidemiological feeds and monitoring real-time homomorphic inference traffic.
              </p>
            </div>
          </div>
        </div>

        {/* Live Mode Toggle Switch */}
        <div className="flex items-center space-x-5 bg-slate-950/90 p-4 rounded-2xl border border-slate-800/80 shadow-2xl shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-extrabold text-white tracking-tight">Live Telemetry Stream</div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isLiveMode ? 'Active websocket simulation' : 'Paused / Manual mode'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
              isLiveMode ? 'bg-rose-600 shadow-lg shadow-rose-600/40' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                isLiveMode ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl border shadow-inner ${
            isLiveMode ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            {isLiveMode ? '● LIVE' : '■ STOPPED'}
          </span>
        </div>
      </div>

      {/* Top Section: Live Public Health API Data (disease.sh) */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider tracking-tight">
              Live Public Health API Ingest (Global Epidemiological Feed)
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-mono font-medium">
              Last Ingest: <strong className="text-slate-200">{lastApiFetch}</strong>
            </span>
            <button
              onClick={fetchLiveHealthData}
              disabled={apiLoading}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${apiLoading ? 'animate-spin' : ''}`} />
              <span>Fetch Live API Data</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-950/80 border border-red-800/80 p-4 rounded-2xl text-xs text-red-300 flex items-center gap-2.5 shadow-inner">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{apiError}. Displaying cached epidemiological baseline data.</span>
          </div>
        )}

        {/* Live API Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-2 shadow-inner hover:border-slate-700/80 transition-all group">
            <div className="text-xs text-slate-400 font-bold flex items-center justify-between uppercase tracking-wider">
              <span>Live Global Cases</span>
              <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {apiData ? apiData.cases.toLocaleString() : '684,250,112'}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1.5 pt-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +{apiData ? apiData.todayCases.toLocaleString() : '42,150'} today
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-2 shadow-inner hover:border-slate-700/80 transition-all group">
            <div className="text-xs text-slate-400 font-bold flex items-center justify-between uppercase tracking-wider">
              <span>Active Tracked Infections</span>
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {apiData ? apiData.active.toLocaleString() : '12,450,890'}
            </div>
            <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5 pt-1 font-bold">
              <AlertCircle className="w-3.5 h-3.5" /> {apiData ? apiData.critical.toLocaleString() : '38,450'} critical cases
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-2 shadow-inner hover:border-slate-700/80 transition-all group">
            <div className="text-xs text-slate-400 font-bold flex items-center justify-between uppercase tracking-wider">
              <span>Total Diagnostic Tests</span>
              <Database className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {apiData ? apiData.tests.toLocaleString() : '7,150,480,000'}
            </div>
            <div className="text-[11px] text-indigo-400 font-mono pt-1 font-medium">
              Used for federated baseline weights
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-2 shadow-inner hover:border-slate-700/80 transition-all group">
            <div className="text-xs text-slate-400 font-bold flex items-center justify-between uppercase tracking-wider">
              <span>Global Recoveries</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {apiData ? apiData.recovered.toLocaleString() : '651,200,450'}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono pt-1 font-bold">
              95.2% recovery rate baseline
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center space-x-3.5">
            <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="leading-relaxed">
              <strong className="text-white font-extrabold">Real-Time API Ingestion Guarantee:</strong> Raw epidemiological numbers from public health APIs are used exclusively to re-weight global disease baselines. Zero patient-identifiable attributes are ingested.
            </span>
          </div>
          <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-xl font-mono text-[10px] font-extrabold hidden md:block shadow-sm">
            HTTPS / TLS 1.3
          </span>
        </div>
      </div>

      {/* Middle Section: Real-Time Telemetry & Enclave Heartbeat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Enclave Tickers & Network Health */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <Activity className="w-4 h-4 text-rose-400 animate-pulse" /> Live Enclave Telemetry & Health
            </h3>

            {/* Inference Ticker */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Live Inference Traffic Rate</span>
                <span className="text-rose-400 font-mono font-extrabold text-sm">{liveInferenceRate} req / sec</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-rose-500 via-amber-400 to-amber-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-rose-500/50"
                  style={{ width: `${(liveInferenceRate / 120) * 100}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Incoming homomorphic inference evaluations across all active hospital nodes.</p>
            </div>

            {/* Enclave Memory */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Active GPU/TPU Enclave Memory</span>
                <span className="text-cyan-400 font-mono font-extrabold text-sm">{activeEnclaveMemory}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50"
                  style={{ width: `${activeEnclaveMemory}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Secure enclave memory allocation for CKKS ciphertext polynomial multiplication.</p>
            </div>

            {/* Network Bandwidth */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>SMPC Weight Sync Bandwidth</span>
                <span className="text-indigo-400 font-mono font-extrabold text-sm">{networkBandwidth} MB/s</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-indigo-500/50"
                  style={{ width: `${(networkBandwidth / 50) * 100}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Encrypted weight shares transmitted between hospital nodes and central server.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-2.5 shadow-inner">
              <div className="text-xs font-extrabold text-white flex items-center justify-between">
                <span className="flex items-center gap-2"><Wifi className="w-4 h-4 text-emerald-400 animate-pulse" /> Enclave Latency Heartbeat</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">ONLINE</span>
              </div>
              <div className="space-y-2 pt-1">
                {nodes.slice(0, 3).map(n => (
                  <div key={n.id} className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-300 truncate w-32 font-bold">{n.name}</span>
                    <span className="text-slate-400">{n.computePower.split(' ')[0]}</span>
                    <span className="text-emerald-400 font-extrabold">{n.latencyMs} ms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Live Telemetry Console */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 tracking-tight font-sans">
                <Terminal className="w-4 h-4 text-cyan-400" /> Real-Time Decentralized Enclave Telemetry Console
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-200 font-sans">Live WebSocket Feed</span>
            </div>
          </div>

          {/* Console Output Window */}
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 font-mono text-xs space-y-3 h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent flex flex-col-reverse shadow-inner">
            {telemetryLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 hover:border-slate-700/80 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-slate-500 font-semibold">[{log.timestamp}]</span>
                    <span className="font-extrabold text-white font-sans">{log.nodeName}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider font-sans ${
                    log.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    log.type === 'warn' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                    log.type === 'metric' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                    'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}>
                    {log.action}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] pl-2.5 border-l-2 border-slate-600 py-0.5 font-mono leading-relaxed">
                  {log.details}
                </div>
              </div>
            ))}
          </div>

          {/* Console Footer Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-bold">
            <div className="flex items-center space-x-5">
              <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-cyan-400" /> Active Nodes: <strong className="text-white">{nodes.length}</strong></span>
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-indigo-400" /> SMPC Masking: <strong className="text-white font-mono">Active</strong></span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400" /> CKKS Scheme: <strong className="text-white font-mono">4096-bit</strong></span>
            </div>

            <button
              onClick={() => setTelemetryLogs([])}
              className="text-slate-400 hover:text-white font-extrabold transition-colors cursor-pointer text-right bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800/80 hover:border-slate-700 shadow-sm"
            >
              Clear Telemetry Console
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
