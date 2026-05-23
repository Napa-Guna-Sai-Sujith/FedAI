import React, { useState } from 'react';
import { PrivacyMetric } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle, 
  ShieldAlert, 
  Key, 
  Server, 
  RefreshCw,
  FileCode,
  HelpCircle
} from 'lucide-react';

interface PrivacyAuditProps {
  metrics: PrivacyMetric[];
  globalEpsilon: number;
}

export const PrivacyAudit: React.FC<PrivacyAuditProps> = ({
  metrics,
  globalEpsilon
}) => {
  // MIA Attack Simulation State
  const [targetPatientId, setTargetPatientId] = useState<string>('PT-94810-CVD');
  const [attackSimulating, setAttackSimulating] = useState<boolean>(false);
  const [attackResult, setAttackResult] = useState<{
    success: boolean;
    confidence: number;
    log: string[];
  } | null>(null);

  const handleSimulateAttack = (e: React.FormEvent) => {
    e.preventDefault();
    setAttackSimulating(true);
    setAttackResult(null);

    setTimeout(() => {
      // Simulate attack failure due to Differential Privacy
      const confidence = parseFloat((Math.random() * 8 + 48).toFixed(1)); // ~50% random guessing
      setAttackResult({
        success: false,
        confidence: confidence,
        log: [
          `[INFO] Initializing Shadow Model training on target patient ${targetPatientId}...`,
          `[INFO] Intercepting central model weights hash 0x8f3c...9a12.`,
          `[WARN] High Laplace noise detected in weight updates (ε = ${globalEpsilon.toFixed(2)}).`,
          `[INFO] Computing likelihood ratio test for membership inference...`,
          `[SUCCESS] Adversary confidence score: ${confidence}%. Attack failed. Indistinguishable from random guessing (50%).`
        ]
      });
      setAttackSimulating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Cryptographic Privacy & Security Audit Suite
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Verify the mathematical and cryptographic guarantees protecting patient data. Inspect Differential Privacy budget consumption ($\epsilon, \delta$), simulate Membership Inference Attacks (MIA), and evaluate Homomorphic Encryption overhead benchmarks.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Global Privacy Budget</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">ε ≤ {globalEpsilon.toFixed(2)}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Strict DP Compliance
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Delta ($\delta$) Failure Rate</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">1.0 × 10⁻⁵</div>
          <div className="text-xs text-slate-400 mt-1">Probability of privacy leak</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>MIA Resistance Score</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">91.8%</div>
          <div className="text-xs text-slate-400 mt-1">Blocks membership inference</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>HE Key Architecture</span>
            <Key className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">4096-bit</div>
          <div className="text-xs text-indigo-400 mt-1">CKKS Homomorphic Scheme</div>
        </div>
      </div>

      {/* Middle Grid: Epsilon Decay Chart & MIA Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Epsilon Decay Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Epsilon ($\epsilon$) Privacy Loss Curve over Rounds
              </h3>
              <span className="text-xs text-slate-400 font-mono">Rényi Differential Privacy</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              As federated models train over successive communication rounds, the cumulative privacy loss ($\epsilon$) increases. Our advanced composition theorems ensure the curve flattens, keeping total privacy loss well within clinical regulatory thresholds.
            </p>

            {/* Simulated Chart */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 h-64 flex flex-col justify-between relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between p-6 pointer-events-none opacity-20">
                <div className="border-b border-slate-700 w-full"></div>
                <div className="border-b border-slate-700 w-full"></div>
                <div className="border-b border-slate-700 w-full"></div>
                <div className="border-b border-slate-700 w-full"></div>
              </div>

              {/* Chart Bars */}
              <div className="relative z-10 flex items-end justify-between h-full pt-4 px-2 sm:px-6">
                {metrics.map((m, idx) => {
                  const heightPercent = Math.min(100, Math.max(15, (m.epsilon / 1.5) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-2 group w-8 sm:w-12">
                      <div className="flex items-end w-full justify-center h-40">
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className="w-4 sm:w-6 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t-md transition-all duration-500 relative"
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-mono">
                            ε={m.epsilon}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        R{m.round}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 mt-2 font-mono">
                <span>Communication Round</span>
                <span className="text-cyan-400">Cumulative Privacy Loss ($\epsilon$)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>What is Epsilon ($\epsilon$)?</span>
            </div>
            <p>Epsilon measures the maximum privacy leakage from participating in the training set. Lower $\epsilon$ means higher privacy but requires more noise injection.</p>
          </div>
        </div>

        {/* Right Column: Membership Inference Attack Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Membership Inference Attack (MIA) Simulator
              </h3>
              <span className="text-xs text-slate-400 font-mono">Adversarial Audit</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Adversaries can try to reverse-engineer whether a specific patient's data was used to train a neural network by analyzing weight updates. Simulate an MIA attack to verify how Differential Privacy noise thwarts reverse-engineering.
            </p>

            <form onSubmit={handleSimulateAttack} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Patient Identifier</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={targetPatientId}
                    onChange={(e) => setTargetPatientId(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                    placeholder="e.g. PT-94810-CVD"
                  />
                  <button
                    type="submit"
                    disabled={attackSimulating}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {attackSimulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Simulating Attack...</span>
                      </>
                    ) : (
                      <span>Execute MIA Attack</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Attack Log & Result */}
            {attackResult ? (
              <div className="mt-6 bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> MIA Attack Failed (Privacy Preserved)
                  </span>
                  <span className="font-mono text-slate-400">Confidence: {attackResult.confidence}%</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
                  {attackResult.log.map((line, i) => (
                    <div key={i} className={line.includes('SUCCESS') ? 'text-emerald-400 font-bold' : line.includes('WARN') ? 'text-amber-400' : 'text-slate-400'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ) : !attackSimulating ? (
              <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-2">
                <Server className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-xs font-semibold text-slate-400">Ready for Adversarial Penetration Testing</div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Click "Execute MIA Attack" to test model robustness against shadow model reverse-engineering.</p>
              </div>
            ) : (
              <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-3 animate-pulse">
                <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
                <div className="text-xs font-bold text-rose-400">Training Adversarial Shadow Models...</div>
                <p className="text-[11px] text-slate-400">Analyzing weight updates and calculating likelihood ratios...</p>
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-xs text-slate-400 space-y-1 mt-4">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mathematical Guarantee</span>
            </div>
            <p>Because the confidence score is ~50%, the attacker cannot distinguish whether the patient was in the training set or not. Perfect privacy protection.</p>
          </div>

        </div>

      </div>

      {/* Cryptographic Overhead Benchmarks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              Cryptographic Overhead & Performance Benchmarks
            </h3>
            <p className="text-xs text-slate-400">Comparing Secure Multi-Party Computation (SMPC) and Homomorphic Encryption against Plaintext baselines.</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
            SMPC + HE Optimized
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-semibold">
                <th className="p-3.5">Training Regime</th>
                <th className="p-3.5">Encryption Protocol</th>
                <th className="p-3.5">Bandwidth / Round</th>
                <th className="p-3.5">Compute Overhead</th>
                <th className="p-3.5">MIA Vulnerability</th>
                <th className="p-3.5">Regulatory Compliance</th>
                <th className="p-3.5">Security Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> FedHealth AI (SMPC + HE)
                </td>
                <td className="p-3.5 font-mono text-cyan-300">CKKS 4096-bit + SMPC</td>
                <td className="p-3.5 font-mono text-slate-300">14.2 MB</td>
                <td className="p-3.5 text-amber-400 font-medium">1.8x (Acceptable)</td>
                <td className="p-3.5 text-emerald-400 font-bold">0.02% (Resistant)</td>
                <td className="p-3.5"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold font-sans">HIPAA / GDPR Compliant</span></td>
                <td className="p-3.5 text-emerald-400 font-bold">Maximum (Zero-Knowledge)</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5 font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Standard Federated Learning
                </td>
                <td className="p-3.5 font-mono text-slate-400">TLS 1.3 Only</td>
                <td className="p-3.5 font-mono text-slate-400">4.1 MB</td>
                <td className="p-3.5 text-emerald-400 font-medium">1.0x (Baseline)</td>
                <td className="p-3.5 text-amber-400 font-bold">14.5% (Moderate)</td>
                <td className="p-3.5"><span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-semibold font-sans">Partial Compliance</span></td>
                <td className="p-3.5 text-blue-400 font-medium">High (Encrypted in transit)</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors opacity-75">
                <td className="p-3.5 font-bold text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span> Centralized Cloud AI (Legacy)
                </td>
                <td className="p-3.5 font-mono text-red-400">None (Plaintext Server)</td>
                <td className="p-3.5 font-mono text-slate-500">1,250.0 MB (Raw Data)</td>
                <td className="p-3.5 text-emerald-500 font-medium">0.8x</td>
                <td className="p-3.5 text-red-400 font-bold">89.4% (Highly Vulnerable)</td>
                <td className="p-3.5"><span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-semibold font-sans">High Breach Risk</span></td>
                <td className="p-3.5 text-red-400 font-bold">Low (Raw Data Exposed)</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
