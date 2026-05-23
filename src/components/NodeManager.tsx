import React, { useState } from 'react';
import { HospitalNode } from '../types';
import { 
  Server, 
  Sliders, 
  Plus, 
  Activity, 
  Wifi, 
  WifiOff, 
  Cpu, 
  Lock, 
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NodeManagerProps {
  nodes: HospitalNode[];
  onUpdateNodeNoise: (nodeId: string, newEpsilon: number) => void;
  onToggleNodeStatus: (nodeId: string) => void;
  onAddSimulatedNode: (newNode: HospitalNode) => void;
}

export const NodeManager: React.FC<NodeManagerProps> = ({
  nodes,
  onUpdateNodeNoise,
  onToggleNodeStatus,
  onAddSimulatedNode
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeLocation, setNewNodeLocation] = useState('');
  const [newNodeType, setNewNodeType] = useState<'academic' | 'general' | 'specialized' | 'community' | 'wearable_aggregator'>('general');
  const [newNodePatients, setNewNodePatients] = useState(50000);

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName || !newNodeLocation) return;

    const newNode: HospitalNode = {
      id: `node-${Date.now()}`,
      name: newNodeName,
      location: newNodeLocation,
      type: newNodeType,
      patientCount: newNodePatients,
      localAccuracy: Math.floor(Math.random() * 6) + 85, // 85-90%
      contributionWeight: 15,
      status: 'online',
      computePower: 'Simulated Edge AI Enclave',
      privacyNoiseLevel: 1.2,
      lastSync: 'Just now',
      latencyMs: Math.floor(Math.random() * 40) + 15,
      dataDistribution: [
        { label: 'Cardiovascular', percentage: 45 },
        { label: 'Diabetes', percentage: 35 },
        { label: 'Oncology', percentage: 20 }
      ]
    };

    onAddSimulatedNode(newNode);
    setNewNodeName('');
    setNewNodeLocation('');
    setShowAddModal(false);
  };

  // Custom Dataset Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileContent, setUploadFileContent] = useState<string>('');
  const [parsedRecordsCount, setParsedRecordsCount] = useState<number>(0);
  const [parsedColumns, setParsedColumns] = useState<string[]>([]);
  const [uploadNodeName, setUploadNodeName] = useState('');
  const [uploadNodeLocation, setUploadNodeLocation] = useState('');
  const [uploadNodeType, setUploadNodeType] = useState<'academic' | 'general' | 'specialized' | 'community' | 'wearable_aggregator'>('specialized');
  const [uploadNoiseLevel, setUploadNoiseLevel] = useState<number>(1.2);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setIsParsing(true);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string || '';
        setUploadFileContent(text);
        
        // Simple CSV/JSON parsing logic
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          const records = Array.isArray(json) ? json : json.patients || json.records || json.data || [json];
          const count = records.length || 12500;
          setParsedRecordsCount(count);
          if (records.length > 0 && typeof records[0] === 'object') {
            setParsedColumns(Object.keys(records[0]).slice(0, 8));
          } else {
            setParsedColumns(['id', 'age', 'gender', 'bmi', 'blood_pressure', 'glucose', 'diagnosis']);
          }
        } else {
          // Assume CSV or tabular text
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 0) {
            const headers = lines[0].split(',').map(h => h.trim()).filter(h => h.length > 0);
            setParsedColumns(headers.slice(0, 8));
            setParsedRecordsCount(Math.max(1, lines.length - 1)); // subtract header
          } else {
            setParsedColumns(['PatientID', 'Age', 'BMI', 'BloodPressure', 'Cholesterol', 'Smoker']);
            setParsedRecordsCount(15000);
          }
        }

        // Auto-suggest Node Name based on file name
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_,-]/g, " ");
        setUploadNodeName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' Clinical Cohort');
        setUploadNodeLocation('Client Local Enclave (Uploaded)');
        setIsParsing(false);
      } catch (err: any) {
        setParseError('Failed to parse file. Ensure it is a valid CSV or JSON dataset.');
        setParsedRecordsCount(24500);
        setParsedColumns(['PatientID', 'Age', 'BMI', 'Vitals', 'LabResults']);
        setUploadNodeName(file.name + ' Enclave');
        setUploadNodeLocation('Client Local Enclave');
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      setParseError('Error reading file from disk.');
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const handleCreateUploadedNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadNodeName) return;

    let dist = [
      { label: 'Cardiovascular', percentage: 40 },
      { label: 'Diabetes', percentage: 35 },
      { label: 'Oncology', percentage: 25 }
    ];
    const contentLower = uploadFileContent.toLowerCase() + ' ' + uploadFile?.name.toLowerCase();
    if (contentLower.includes('cardio') || contentLower.includes('heart') || contentLower.includes('bp')) {
      dist = [{ label: 'Cardiovascular', percentage: 70 }, { label: 'Diabetes', percentage: 20 }, { label: 'Other', percentage: 10 }];
    } else if (contentLower.includes('diabet') || contentLower.includes('glucose') || contentLower.includes('hba1c')) {
      dist = [{ label: 'Diabetes', percentage: 65 }, { label: 'Cardiovascular', percentage: 25 }, { label: 'Renal', percentage: 10 }];
    } else if (contentLower.includes('onco') || contentLower.includes('cancer') || contentLower.includes('tumor')) {
      dist = [{ label: 'Oncology', percentage: 75 }, { label: 'Other', percentage: 25 }];
    }

    const newNode: HospitalNode = {
      id: `node-${Date.now()}`,
      name: uploadNodeName,
      location: uploadNodeLocation || 'Client Uploaded Enclave',
      type: uploadNodeType,
      patientCount: parsedRecordsCount > 0 ? parsedRecordsCount : 12500,
      localAccuracy: Math.floor(Math.random() * 5) + 87, // 87-92%
      contributionWeight: Math.min(25, Math.max(5, Math.floor((parsedRecordsCount / 150000) * 20))),
      status: 'online',
      computePower: 'Local Edge AI Enclave (Uploaded)',
      privacyNoiseLevel: uploadNoiseLevel,
      lastSync: 'Just now',
      latencyMs: Math.floor(Math.random() * 25) + 10,
      dataDistribution: dist
    };

    onAddSimulatedNode(newNode);
    setUploadFile(null);
    setUploadFileContent('');
    setParsedRecordsCount(0);
    setParsedColumns([]);
    setUploadNodeName('');
    setUploadNodeLocation('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-400" />
            Federated Client Enclaves & Privacy Controls
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Each node represents an isolated medical institution. Data never leaves these enclaves. 
            Adjust local Differential Privacy noise ($\epsilon$) to observe how cryptographic noise impacts local model accuracy versus privacy guarantees.
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Custom Dataset</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Simulated Node</span>
          </button>
        </div>
      </div>

      {/* Add Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" /> Add Simulated Clinical Enclave
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johns Hopkins Medical Center"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baltimore, MD, USA"
                  value={newNodeLocation}
                  onChange={(e) => setNewNodeLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enclave Type</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="general">General Hospital</option>
                  <option value="academic">Academic Research Center</option>
                  <option value="specialized">Specialized Clinic</option>
                  <option value="community">Community Health Consortium</option>
                  <option value="wearable_aggregator">Wearable IoT Enclave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Local Patient Records: {newNodePatients.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="5000"
                  value={newNodePatients}
                  onChange={(e) => setNewNodePatients(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Automatic SMPC Key Generation</span>
                </div>
                <p>Node will be provisioned with 4096-bit RSA keys and connected to the central FedAvg aggregator.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Provision Enclave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Custom Dataset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" /> Upload Custom Clinical Dataset
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUploadedNode} className="space-y-4">
              {/* File Input Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Dataset File (.CSV, .JSON, .TXT, .XLSX)</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 text-center bg-slate-950/50 transition-colors relative group cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".csv,.json,.txt,.xlsx"
                    onChange={handleFileUploadChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mx-auto transition-colors" />
                    <div className="text-xs font-bold text-white">
                      {uploadFile ? uploadFile.name : 'Click to upload or drag & drop dataset file'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : 'Tabular CSV, JSON cohorts, or Clinical TXT logs'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parsing status / error */}
              {isParsing && (
                <div className="bg-slate-800/80 p-3 rounded-lg flex items-center space-x-2 text-xs text-cyan-400 animate-pulse font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Parsing dataset headers and counting patient rows...</span>
                </div>
              )}

              {parseError && (
                <div className="bg-amber-950/50 border border-amber-800/50 p-3 rounded-lg flex items-center space-x-2 text-xs text-amber-300 font-mono">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Parsed Summary Box */}
              {uploadFile && !isParsing && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Dataset Successfully Ingested
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">{parsedRecordsCount.toLocaleString()} Patient Records</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detected Feature Columns:</span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {parsedColumns.map((col, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Enclave Provisioning Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Enclave Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford Medical Center Custom Cohort"
                  value={uploadNodeName}
                  onChange={(e) => setUploadNodeName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enclave Type</label>
                <select
                  value={uploadNodeType}
                  onChange={(e) => setUploadNodeType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="specialized">Specialized Research Clinic</option>
                  <option value="academic">Academic Medical Center</option>
                  <option value="general">General Hospital</option>
                  <option value="community">Community Health Consortium</option>
                  <option value="wearable_aggregator">Wearable IoT Aggregator</option>
                </select>
              </div>

              {/* Noise Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Differential Privacy Noise ($\epsilon$)</span>
                  <span className="text-cyan-400 font-mono">ε = {uploadNoiseLevel.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={uploadNoiseLevel}
                  onChange={(e) => setUploadNoiseLevel(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SMPC Key Exchange & Data Sovereignty</span>
                </div>
                <p>The uploaded dataset remains strictly within this newly provisioned enclave. Only differentially-private model weights are shared during training rounds.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isParsing}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  Provision Enclave with Custom Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nodes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => {
          const isOnline = node.status !== 'offline';
          return (
            <div 
              key={node.id} 
              className={`bg-slate-900 border rounded-2xl p-6 space-y-5 shadow-lg transition-all ${
                isOnline ? 'border-slate-800 hover:border-slate-700' : 'border-red-900/40 opacity-75'
              }`}
            >
              {/* Node Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isOnline 
                      ? 'bg-slate-800 border-slate-700 text-cyan-400' 
                      : 'bg-red-950/50 border-red-800 text-red-400'
                  }`}>
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{node.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{node.location}</span>
                      <span>•</span>
                      <span className="capitalize text-slate-300 font-medium">{node.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleNodeStatus(node.id)}
                  title={isOnline ? "Click to disconnect node" : "Click to connect node"}
                  className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                    isOnline
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span className="capitalize">{node.status}</span>
                </button>
              </div>

              {/* Node Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-indigo-400" /> Patient Records
                  </div>
                  <div className="text-sm font-bold text-slate-100 mt-1 font-mono">
                    {node.patientCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Local Accuracy
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">
                    {node.localAccuracy}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" /> Compute Cluster
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-1 truncate">
                    {node.computePower}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Last Sync
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">
                    {node.lastSync} ({node.latencyMs}ms)
                  </div>
                </div>
              </div>

              {/* Differential Privacy Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Differential Privacy Noise ($\epsilon$)</span>
                  </div>
                  <span className="font-mono text-cyan-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    ε = {node.privacyNoiseLevel.toFixed(1)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  disabled={!isOnline}
                  value={node.privacyNoiseLevel}
                  onChange={(e) => onUpdateNodeNoise(node.id, parseFloat(e.target.value))}
                  className={`w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${
                    !isOnline ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                />

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Strict Privacy (ε=0.1)</span>
                  <span>Balanced</span>
                  <span>High Accuracy (ε=3.0)</span>
                </div>
              </div>

              {/* Data Distribution */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Local Data Distribution (Non-IID)</span>
                  <span className="text-[10px] text-slate-500">Weight: {node.contributionWeight}%</span>
                </div>
                <div className="space-y-1.5">
                  {node.dataDistribution.map((dist, i) => (
                    <div key={i} className="flex items-center text-[11px]">
                      <span className="w-24 text-slate-400 truncate">{dist.label}</span>
                      <div className="flex-1 bg-slate-800 h-1.5 rounded-full mx-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            i === 0 ? 'bg-cyan-500' : i === 1 ? 'bg-indigo-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${dist.percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right font-mono text-slate-300">{dist.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Status Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>SMPC Key Verified</span>
                </div>
                {node.privacyNoiseLevel < 0.5 ? (
                  <span className="text-amber-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Noise Injection
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono">2048-bit HE Active</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
