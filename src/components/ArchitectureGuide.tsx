import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Lock, 
  ShieldCheck, 
  FileText, 
  Layers, 
  CheckCircle,
  Network,
  Sparkles
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fnn' | 'dp' | 'smpc' | 'he' | 'compliance'>('fnn');

  const pillars = [
    { id: 'fnn', label: '1. Federated Neural Networks', icon: Cpu },
    { id: 'dp', label: '2. Differential Privacy', icon: Lock },
    { id: 'smpc', label: '3. SMPC Secure Aggregation', icon: Network },
    { id: 'he', label: '4. Homomorphic Encryption', icon: ShieldCheck },
    { id: 'compliance', label: '5. HIPAA / GDPR Compliance', icon: FileText },
  ] as const;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          System Architecture & Cryptographic Knowledge Base
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Explore the theoretical foundations and implementation details of FedHealth AI. Learn how decentralized deep learning converges with cutting-edge cryptography to protect patient privacy while achieving clinical-grade predictive accuracy.
        </p>
      </div>

      {/* Tabs & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activeTab === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{pillar.label}</span>
              </button>
            );
          })}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Takeaway
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              FedHealth AI replaces central data silos with an encrypted mathematical consensus—allowing global medical discoveries without transferring a single raw patient file.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 min-h-[450px] flex flex-col justify-between">
          
          {/* FNN Content */}
          {activeTab === 'fnn' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Federated Neural Networks (FNN)</h3>
                  <p className="text-xs text-slate-400">Decentralized Deep Learning across Clinical Enclaves</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  Traditional deep learning requires aggregating massive datasets into a single centralized server or cloud bucket. In healthcare, this poses severe legal, ethical, and logistical hurdles due to patient confidentiality laws.
                </p>
                <p>
                  <strong>Federated Learning (FL)</strong> inverts this paradigm. Instead of bringing the data to the model, FedHealth AI brings the model to the data. Participating hospitals (client nodes) download the current global neural network weights W_t, train the model locally on their private patient cohorts using Stochastic Gradient Descent (SGD), and produce local weight updates W_i(t+1).
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
                  <div className="text-cyan-400 font-bold">// Federated Averaging (FedAvg) Mathematical Objective</div>
                  <div>min f(w) = Σ (n_k / n) * F_k(w)</div>
                  <div className="text-slate-500">// Where n_k is local patient count, n is total global patients, and F_k is local empirical risk.</div>
                </div>

                <h4 className="text-sm font-bold text-white pt-2">Handling Non-IID Data Distributions</h4>
                <p>
                  Clinical data is inherently non-IID (Independent and Identically Distributed). For example, a specialized cardiology center will have different feature distributions than an oncology research lab. To prevent model divergence, FedHealth AI implements advanced optimization algorithms like <strong>FedProx</strong> (adding a proximal term to restrict local updates) and <strong>FedNova</strong> (normalizing gradient steps).
                </p>
              </div>
            </div>
          )}

          {/* DP Content */}
          {activeTab === 'dp' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Differential Privacy (DP)</h3>
                  <p className="text-xs text-slate-400">Rigorous Mathematical Protection against Reverse-Engineering</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  While Federated Learning prevents raw data transmission, neural network weights can still memorize sensitive training examples. An adversary could execute a <strong>Membership Inference Attack (MIA)</strong> or Model Inversion Attack to determine if a specific patient was in the training set.
                </p>
                <p>
                  To eliminate this vulnerability, FedHealth AI applies <strong>$(\epsilon, \delta)$-Differential Privacy</strong>. Before transmitting local weight updates to the central server, each enclave clips gradient norms and injects calibrated Laplace or Gaussian noise.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
                  <div className="text-cyan-400 font-bold">// Laplace Mechanism for Differential Privacy</div>
                  <div>M(x) = f(x) + Laplace(Δf / ε)</div>
                  <div className="text-slate-500">// Where Δf is the L1 sensitivity of the gradient query, and ε is the privacy budget.</div>
                </div>

                <h4 className="text-sm font-bold text-white pt-2">The Privacy vs. Utility Trade-Off</h4>
                <p>
                  The privacy budget $\epsilon$ controls the noise magnitude. A smaller $\epsilon$ provides stronger privacy guarantees but can reduce model accuracy. Our platform allows clinical administrators to dynamically adjust $\epsilon$ to achieve the optimal balance between diagnostic precision and regulatory compliance.
                </p>
              </div>
            </div>
          )}

          {/* SMPC Content */}
          {activeTab === 'smpc' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Secure Multi-Party Computation (SMPC)</h3>
                  <p className="text-xs text-slate-400">Cryptographic Weight Aggregation without Central Trust</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  Even with Differential Privacy, transmitting individual weight updates to a central server requires trusting the aggregator. What if the central server is compromised?
                </p>
                <p>
                  <strong>Secure Multi-Party Computation (SMPC)</strong> ensures that the central server can compute the weighted average of local model updates without ever learning the individual weight values from any specific hospital.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
                  <div className="text-cyan-400 font-bold">// Secret Sharing Scheme Protocol</div>
                  <div>1. Node A splits its weight update W_A into random shares: W_A = s_1 + s_2 + s_3</div>
                  <div>2. Shares are distributed securely among peer enclaves.</div>
                  <div>3. Central server aggregates summed shares without knowing individual components.</div>
                  <div>4. Reconstructed sum yields the exact global update W_(t+1).</div>
                </div>

                <h4 className="text-sm font-bold text-white pt-2">Robustness against Collusion</h4>
                <p>
                  Our SMPC protocol utilizes Shamir's Secret Sharing and additive homomorphic masking, guaranteeing that even if a subset of participating hospitals collude with the central server, the individual model updates of the remaining hospitals remain perfectly secure.
                </p>
              </div>
            </div>
          )}

          {/* HE Content */}
          {activeTab === 'he' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Homomorphic Encryption (HE)</h3>
                  <p className="text-xs text-slate-400">Zero-Knowledge Clinical Inference over Encrypted Vitals</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  While Federated Learning secures the <em>training</em> phase, patient privacy must also be protected during the <em>inference</em> phase (when a doctor uses the trained model to predict disease risk for a new patient).
                </p>
                <p>
                  FedHealth AI implements the <strong>CKKS (Cheon-Kim-Kim-Song) Fully Homomorphic Encryption</strong> scheme. This breakthrough cryptographic protocol allows our neural network to perform addition and multiplication operations directly on encrypted ciphertext vectors.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
                  <div className="text-cyan-400 font-bold">// Homomorphic Evaluation over Ciphertext</div>
                  <div>Enc(x) ⊕ Enc(y) = Enc(x + y)</div>
                  <div>Enc(x) ⊗ Enc(y) = Enc(x · y)</div>
                  <div className="text-slate-500">// Neural network weights evaluate the encrypted patient vitals, producing an encrypted risk score.</div>
                </div>

                <h4 className="text-sm font-bold text-white pt-2">End-to-End Privacy Guarantee</h4>
                <p>
                  The patient's vitals are encrypted on their local device before transmission. The central server processes the ciphertext and returns an encrypted risk score. Because only the patient/doctor holds the private decryption key, the central server never sees the raw vitals or the final prediction.
                </p>
              </div>
            </div>
          )}

          {/* Compliance Content */}
          {activeTab === 'compliance' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HIPAA & GDPR Compliance</h3>
                  <p className="text-xs text-slate-400">Solving the Legal Bottleneck of Medical AI Collaboration</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  The Health Insurance Portability and Accountability Act (HIPAA) in the US and the General Data Protection Regulation (GDPR) in Europe impose strict penalties for the unauthorized sharing or exposure of Protected Health Information (PHI).
                </p>
                <p>
                  Traditional data sharing requires complex legal Data Use Agreements (DUAs), patient re-consent, and costly de-identification pipelines (which are often reversible).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> HIPAA Safe Harbor / Expert Determination
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Because raw patient records never leave the local hospital firewall and model weights are mathematically protected by Differential Privacy, FedHealth AI satisfies the Safe Harbor and Expert Determination standards for de-identification.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> GDPR Data Minimization & Purpose Limitation
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      FedHealth AI strictly adheres to GDPR Article 5. Local weights are ephemeral and aggregated immediately via SMPC, ensuring no personal data is stored centrally or transferred across international borders.
                    </p>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white pt-2">Unlocking Multi-Center Clinical Trials</h4>
                <p>
                  By eliminating legal liability and preserving institutional data sovereignty, FedHealth AI enables competing medical centers, pharmaceutical companies, and international research consortiums to collaborate freely on rare disease models and oncology research.
                </p>
              </div>
            </div>
          )}

          {/* Footer Navigation within Tab */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>FedHealth Core Cryptographic Engine v4.2</span>
            </div>
            <span className="font-mono text-cyan-400">Active Scheme: CKKS + SMPC</span>
          </div>

        </div>

      </div>

    </div>
  );
};
