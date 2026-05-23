import React, { useState, useEffect } from 'react';
import { DiseaseModel, HospitalNode, TrainingLog, PrivacyMetric } from './types';
import { initialModels, initialNodes, initialTrainingLogs, initialPrivacyMetrics } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { NodeManager } from './components/NodeManager';
import { TrainingEngine } from './components/TrainingEngine';
import { RiskPredictor } from './components/RiskPredictor';
import { PrivacyAudit } from './components/PrivacyAudit';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { RealTimeTelemetry } from './components/RealTimeTelemetry';
import { WorkingModel } from './components/WorkingModel';
import { LiveDemoFlow } from './components/LiveDemoFlow';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { DatasetsDashboard } from './components/DatasetsDashboard';
import { NeuralNetworkVisualizer } from './components/NeuralNetworkVisualizer';
import { getSupabaseClient, hasValidSupabaseConfig, fetchUserProfile, fetchLoginRecords } from './utils/supabaseClient';
import { ShieldCheck, Network, Lock, Heart, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('working_model'); // Default to working_model after successful authentication
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any | null>(null);
  const [loginRecords, setLoginRecords] = useState<any[]>([]);

  // Check Supabase session on mount
  useEffect(() => {
    if (hasValidSupabaseConfig()) {
      const supabase = getSupabaseClient();
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        setCurrentUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setCurrentUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Load rich profile + login records after auth
  useEffect(() => {
    const loadProfileData = async () => {
      if (currentUser?.id && hasValidSupabaseConfig()) {
        const profile = await fetchUserProfile(currentUser.id);
        const records = await fetchLoginRecords(currentUser.id);
        setCurrentProfile(profile);
        setLoginRecords(records);
      } else if (currentUser) {
        setCurrentProfile({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || 'Dr. Alex Vance',
          institution: currentUser.user_metadata?.institution || 'Metro General Hospital',
          role: currentUser.user_metadata?.role || 'researcher'
        });
        setLoginRecords([]);
      } else {
        setCurrentProfile(null);
        setLoginRecords([]);
      }
    };

    loadProfileData();
  }, [currentUser]);
  
  // Global State
  const [models, setModels] = useState<DiseaseModel[]>(initialModels);
  const [nodes, setNodes] = useState<HospitalNode[]>(initialNodes);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>(initialTrainingLogs);
  const [privacyMetrics] = useState<PrivacyMetric[]>(initialPrivacyMetrics);

  // Cross-Tab Navigation State
  const [selectedModelForTraining, setSelectedModelForTraining] = useState<string>(initialModels[0].id);
  const [selectedModelForPrediction, setSelectedModelForPrediction] = useState<string>(initialModels[0].id);

  // Toast Notifications State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handlers for Global State Updates
  const handleUpdateNodeNoise = (nodeId: string, newEpsilon: number) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, privacyNoiseLevel: newEpsilon } : n));
    showToast(`Updated Differential Privacy noise (ε=${newEpsilon.toFixed(1)}) for enclave.`, 'info');
  };

  const handleToggleNodeStatus = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const nextStatus = n.status === 'offline' ? 'online' : 'offline';
        showToast(`Enclave ${n.name} is now ${nextStatus}.`, nextStatus === 'online' ? 'success' : 'info');
        return { ...n, status: nextStatus };
      }
      return n;
    }));
  };

  const handleAddSimulatedNode = (newNode: HospitalNode) => {
    setNodes(prev => [newNode, ...prev]);
    showToast(`Successfully provisioned new clinical enclave: ${newNode.name}.`, 'success');
  };

  const handleUpdateNodeStats = (nodeId: string, latency: number, patients: number) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, latencyMs: latency, patientCount: patients, lastSync: 'Just now' } : n));
  };

  const handleAddTrainingLog = (newLog: TrainingLog) => {
    setTrainingLogs(prev => [newLog, ...prev]);
    showToast(`Completed Federated Round #${newLog.round} for ${newLog.modelName}.`, 'success');
  };

  const handleUpdateModelAccuracy = (modelId: string, newAccuracy: number, newRounds: number) => {
    setModels(prev => prev.map(m => {
      if (m.id === modelId) {
        return {
          ...m,
          globalAccuracy: newAccuracy,
          totalRounds: newRounds,
          lastUpdated: 'Just now'
        };
      }
      return m;
    }));
  };

  const handleSelectModelForTraining = (modelId: string) => {
    setSelectedModelForTraining(modelId);
    setActiveTab('training');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModelForPrediction = (modelId: string) => {
    setSelectedModelForPrediction(modelId);
    setActiveTab('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculated Summary Metrics
  const activeNodesCount = nodes.filter(n => n.status !== 'offline').length;
  const globalEpsilon = models.reduce((acc, m) => acc + m.privacyEpsilon, 0) / models.length;
  const totalRecords = nodes.reduce((acc, n) => acc + n.patientCount, 0);

  if (!currentUser) {
    return (
      <AuthPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('working_model');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp flex items-center space-x-3 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl max-w-md">
          <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-200 leading-snug">
            {toast.message}
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeNodesCount={activeNodesCount}
        globalEpsilon={globalEpsilon}
        totalRecords={totalRecords}
        isLiveMode={isLiveMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentProfile || currentUser}
      />

      {/* Auth & Database Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user) setActiveTab('working_model');
        }}
        currentUser={currentUser}
        currentProfile={currentProfile}
        loginRecords={loginRecords}
        onProfileUpdated={(profile) => setCurrentProfile(profile)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'livedemo' && (
          <LiveDemoFlow onNavigateToTab={handleNavigateToTab} />
        )}

        {activeTab === 'working_model' && (
          <WorkingModel
            nodes={nodes}
            models={models}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'telemetry' && (
          <RealTimeTelemetry
            nodes={nodes}
            onUpdateNodeStats={handleUpdateNodeStats}
            isLiveMode={isLiveMode}
            setIsLiveMode={setIsLiveMode}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            models={models}
            nodes={nodes}
            onSelectModelForTraining={handleSelectModelForTraining}
            onSelectModelForPrediction={handleSelectModelForPrediction}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'nodes' && (
          <NodeManager
            nodes={nodes}
            onUpdateNodeNoise={handleUpdateNodeNoise}
            onToggleNodeStatus={handleToggleNodeStatus}
            onAddSimulatedNode={handleAddSimulatedNode}
          />
        )}

        {activeTab === 'training' && (
          <TrainingEngine
            models={models}
            nodes={nodes}
            trainingLogs={trainingLogs}
            onAddTrainingLog={handleAddTrainingLog}
            onUpdateModelAccuracy={handleUpdateModelAccuracy}
            selectedModelId={selectedModelForTraining}
          />
        )}

        {activeTab === 'predictor' && (
          <RiskPredictor
            models={models}
            selectedModelId={selectedModelForPrediction}
          />
        )}

        {activeTab === 'nn_visualizer' && (
          <NeuralNetworkVisualizer onNavigateToTab={handleNavigateToTab} />
        )}

        {activeTab === 'datasets_repo' && (
          <DatasetsDashboard />
        )}

        {activeTab === 'audit' && (
          <PrivacyAudit
            metrics={privacyMetrics}
            globalEpsilon={globalEpsilon}
          />
        )}

        {activeTab === 'guide' && (
          <ArchitectureGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Network className="w-6 h-6 text-cyan-400" />
              <span className="font-extrabold text-lg text-white tracking-tight">FedHealth AI</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              An advanced decentralized simulation and operational platform for Privacy-Preserving Disease Risk Prediction. Powered by Federated Neural Networks, Differential Privacy, and Fully Homomorphic Encryption.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>© 2026 FedHealth AI Consortium. All rights reserved.</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Cryptographic Standards</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-cyan-400" /> CKKS Homomorphic Encryption</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> $(\epsilon, \delta)$-Differential Privacy</li>
              <li className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-indigo-400" /> SMPC Shamir Secret Sharing</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> FedAvg & FedProx Algorithms</li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Clinical & Regulatory</h4>
            <ul className="space-y-2 text-slate-400">
              <li>HIPAA Safe Harbor De-identification</li>
              <li>GDPR Article 5 Data Minimization</li>
              <li>Multi-Center Clinical Trial Safe Enclaves</li>
              <li className="flex items-center gap-1 text-emerald-400 font-medium">
                <Heart className="w-3.5 h-3.5" /> 100% Patient Privacy Guaranteed
              </li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default App;
