import React, { useEffect, useState } from 'react';
import {
  getSupabaseClient,
  hasValidSupabaseConfig,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  DEFAULT_SUPABASE_URL,
  DEFAULT_PROJECT_REF,
  SUPABASE_SQL_SCHEMA,
  upsertUserProfile,
  insertLoginRecord
} from '../utils/supabaseClient';
import {
  Network,
  Lock,
  ShieldCheck,
  Mail,
  Key,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plug,
  Eye,
  EyeOff,
  Copy,
  Database,
  RefreshCw,
  Terminal,
  Trash2,
  Building2,
  ClipboardList,
  Globe,
  Phone,
  BadgeCheck,
  FileText
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'settings' | 'sql'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('Metro General Hospital');
  const [role, setRole] = useState('researcher');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [configUrl, setConfigUrl] = useState(DEFAULT_SUPABASE_URL);
  const [configAnonKey, setConfigAnonKey] = useState('');
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValidConfig = hasValidSupabaseConfig();

  useEffect(() => {
    const cfg = getSupabaseConfig();
    setConfigUrl(cfg.url || DEFAULT_SUPABASE_URL);
    setConfigAnonKey(cfg.anonKey || '');
  }, []);

  const handleSaveConnection = () => {
    saveSupabaseConfig({ url: configUrl.trim(), anonKey: configAnonKey.trim() });
    setMessage({ text: 'Supabase connection saved locally. You can now log in with your real project.', type: 'success' });
  };

  const handleClearConnection = () => {
    clearSupabaseConfig();
    setConfigUrl(DEFAULT_SUPABASE_URL);
    setConfigAnonKey('');
    setMessage({ text: 'Saved Supabase connection cleared.', type: 'success' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!hasValidSupabaseConfig()) {
      setTimeout(() => {
        onLoginSuccess({
          id: 'mock-auth-page-user',
          email,
          user_metadata: {
            full_name: fullName || 'Dr. Alex Vance',
            institution,
            role
          }
        });
      }, 900);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        await upsertUserProfile({
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName || data.user.user_metadata?.full_name || 'FedHealth User',
          institution,
          role,
          phone,
          department,
          specialization,
          license_number: licenseNumber,
          country,
          bio
        });
        await insertLoginRecord({
          user_id: data.user.id,
          email: data.user.email || email,
          institution,
          status: 'success'
        });
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      if ((err.message || '').toLowerCase().includes('email not confirmed')) {
        setPendingVerificationEmail(email);
        setMessage({ text: 'Your Supabase project still has Confirm email enabled. Disable it in Supabase Dashboard → Authentication → Providers → Email to stop confirmation mails.', type: 'error' });
      } else {
        setMessage({ text: err.message || 'Failed to log in.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!hasValidSupabaseConfig()) {
      setTimeout(() => {
        onLoginSuccess({
          id: 'mock-auth-page-user-signup',
          email,
          user_metadata: {
            full_name: fullName || 'Dr. Sarah Connor',
            institution,
            role
          }
        });
      }, 900);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
            institution,
            role,
            phone,
            department,
            specialization,
            license_number: licenseNumber,
            country,
            bio
          }
        }
      });
      if (error) throw error;

      if (data.user) {
        await upsertUserProfile({
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName,
          institution,
          role,
          phone,
          department,
          specialization,
          license_number: licenseNumber,
          country,
          bio
        });
      }

      if (data.session && data.user) {
        await insertLoginRecord({
          user_id: data.user.id,
          email: data.user.email || email,
          institution,
          status: 'success'
        });
        onLoginSuccess(data.user);
      } else {
        setPendingVerificationEmail(email);
        setActiveTab('login');
        setMessage({ text: 'Account created in Supabase. To remove confirmation mails, disable Confirm email in Supabase Dashboard → Authentication → Providers → Email.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to sign up.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.12),transparent_25%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Brand / Highlighted Logo */}
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Secure Clinical AI Access Portal</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/30 blur-2xl rounded-full scale-150"></div>
                <div className="relative bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-5 rounded-3xl shadow-2xl shadow-cyan-500/30 border border-cyan-300/30">
                  <Network className="w-14 h-14 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent leading-none">
                  FedHealth AI
                </h1>
                <p className="text-sm sm:text-base text-cyan-300 font-semibold mt-2 tracking-wide">
                  Privacy-Preserving Disease Risk Prediction
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Sign in to access the complete federated neural network platform. After authentication, you will be taken directly to the
              <strong className="text-white"> End-to-End Working Model</strong> so you can immediately study the architecture, models, privacy pipeline, and live AI workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
              <div className="text-cyan-400 font-extrabold text-lg">FNN</div>
              <div className="text-xs text-slate-400 mt-1">Federated Neural Networks</div>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
              <div className="text-emerald-400 font-extrabold text-lg">DP</div>
              <div className="text-xs text-slate-400 mt-1">Differential Privacy</div>
            </div>
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
              <div className="text-indigo-400 font-extrabold text-lg">CKKS</div>
              <div className="text-xs text-slate-400 mt-1">Homomorphic Encryption</div>
            </div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Login / Signup</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isValidConfig ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span className="text-xs font-mono text-slate-400">
                  {isValidConfig ? 'Supabase Connected' : 'Supabase anon key required'}
                </span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-[10px] font-mono text-slate-300">
              Ref: {DEFAULT_PROJECT_REF}
            </div>
          </div>

          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-1.5 shadow-inner">
            {[
              { id: 'login', label: 'Login', icon: User },
              { id: 'signup', label: 'Sign Up', icon: ShieldCheck },
              { id: 'settings', label: 'Connection', icon: Plug },
              { id: 'sql', label: 'SQL Schema', icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
              message.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Demo Users Seeded for Supabase
              </h4>
              <span className="text-[10px] font-mono text-slate-500">Run SQL Schema first</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Admin Demo', email: 'admin@fedhealth.ai', password: 'DemoAdmin123!', color: 'text-purple-300' },
                { label: 'Doctor Demo', email: 'doctor@fedhealth.ai', password: 'DemoDoctor123!', color: 'text-rose-300' },
                { label: 'Researcher Demo', email: 'researcher@fedhealth.ai', password: 'DemoResearch123!', color: 'text-emerald-300' }
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setEmail(demo.email);
                    setPassword(demo.password);
                    setMessage({ text: `${demo.label} credentials loaded. Click login to continue.`, type: 'success' });
                  }}
                  className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-left transition-all cursor-pointer"
                >
                  <div className={`text-xs font-extrabold ${demo.color}`}>{demo.label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">{demo.email}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{demo.password}</div>
                </button>
              ))}
            </div>
          </div>

          {pendingVerificationEmail && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2 shadow-inner animate-fadeIn">
              <div className="text-xs text-amber-200 font-semibold leading-relaxed">
                Account created for <span className="font-mono text-white">{pendingVerificationEmail}</span>, but your Supabase project is still configured to send confirmation emails.
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                To stop confirmation mails completely, go to <strong className="text-white">Supabase Dashboard → Authentication → Providers → Email</strong> and turn <strong className="text-white">Confirm email</strong> OFF.
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-4 rounded-xl text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Lock className="w-4 h-4 text-slate-950" />}
                <span>Log In and Open Working Model</span>
              </button>
            </form>
          )}

          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Alex Vance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Institution</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Institution"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                  >
                    <option value="researcher">Clinical Researcher</option>
                    <option value="doctor">Attending Physician</option>
                    <option value="admin">Enclave Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-400" /> Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /> Country</label>
                  <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-cyan-400" /> Department</label>
                  <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Cardiology" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-cyan-400" /> Specialization</label>
                  <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Preventive Cardiology" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-cyan-400" /> Medical License Number</label>
                  <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="LIC-2026-45892" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-400" /> Bio / Notes</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Short professional profile, interests, compliance notes..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner resize-none" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-4 rounded-xl text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <ShieldCheck className="w-4 h-4 text-slate-950" />}
                <span>Create Account + Store Full Profile in Supabase</span>
              </button>
            </form>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2">Project URL</label>
                  <input
                    type="text"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2">Anon Public Key</label>
                  <div className="relative">
                    <input
                      type={showAnonKey ? 'text' : 'password'}
                      value={configAnonKey}
                      onChange={(e) => setConfigAnonKey(e.target.value)}
                      placeholder="Paste Supabase anon key"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pr-12 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAnonKey(!showAnonKey)}
                      className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSaveConnection}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plug className="w-4 h-4 text-slate-950" />
                    <span>Save Connection</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearConnection}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Saved Keys</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
                <div>
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" /> Supabase SQL Schema & Migration Queries
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-lg">
                    Copy and paste this SQL into Supabase SQL Editor to create all required tables, policies, and seed data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                  <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-[11px] text-slate-300 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 shadow-inner leading-relaxed select-all">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};