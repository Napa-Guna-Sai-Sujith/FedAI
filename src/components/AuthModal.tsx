import React, { useState, useEffect } from 'react';
import {
  getSupabaseClient,
  hasValidSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  DEFAULT_SUPABASE_URL,
  DEFAULT_PROJECT_REF,
  updateUserProfile,
  upsertUserProfile,
  insertLoginRecord
} from '../utils/supabaseClient';
import { 
  Lock, 
  User, 
  Mail, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Copy, 
  Terminal, 
  LogOut,
  RefreshCw,
  Plug,
  Eye,
  EyeOff,
  Trash2,
  Building2,
  ClipboardList,
  Globe,
  Phone,
  BadgeCheck,
  FileText
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  currentUser: any | null;
  currentProfile?: any | null;
  loginRecords?: any[];
  onProfileUpdated?: (profile: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  currentProfile,
  loginRecords = [],
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'sql' | 'settings'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('Metro General Hospital');
  const [role, setRole] = useState('researcher');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [configUrl, setConfigUrl] = useState(DEFAULT_SUPABASE_URL);
  const [configAnonKey, setConfigAnonKey] = useState('');
  const [profileFullName, setProfileFullName] = useState('');
  const [profileInstitution, setProfileInstitution] = useState('');
  const [profileRole, setProfileRole] = useState('researcher');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDepartment, setProfileDepartment] = useState('');
  const [profileSpecialization, setProfileSpecialization] = useState('');
  const [profileLicense, setProfileLicense] = useState('');
  const [profileCountry, setProfileCountry] = useState('');
  const [profileBio, setProfileBio] = useState('');

  const isValidConfig = hasValidSupabaseConfig();

  useEffect(() => {
    if (isOpen) {
      setMessage(null);
      const cfg = getSupabaseConfig();
      setConfigUrl(cfg.url || DEFAULT_SUPABASE_URL);
      setConfigAnonKey(cfg.anonKey || '');
      setProfileFullName(currentProfile?.full_name || currentUser?.user_metadata?.full_name || '');
      setProfileInstitution(currentProfile?.institution || currentUser?.user_metadata?.institution || 'Metro General Hospital');
      setProfileRole(currentProfile?.role || currentUser?.user_metadata?.role || 'researcher');
      setProfilePhone(currentProfile?.phone || '');
      setProfileDepartment(currentProfile?.department || '');
      setProfileSpecialization(currentProfile?.specialization || '');
      setProfileLicense(currentProfile?.license_number || '');
      setProfileCountry(currentProfile?.country || '');
      setProfileBio(currentProfile?.bio || '');
    }
  }, [isOpen, currentProfile, currentUser]);

  const handleSaveConnection = () => {
    saveSupabaseConfig({ url: configUrl.trim(), anonKey: configAnonKey.trim() });
    setMessage({ text: 'Supabase connection saved locally. Re-open login or refresh to use the new client.', type: 'success' });
  };

  const handleClearConnection = () => {
    clearSupabaseConfig();
    setConfigUrl(DEFAULT_SUPABASE_URL);
    setConfigAnonKey('');
    setMessage({ text: 'Saved Supabase credentials cleared from local storage.', type: 'success' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isValidConfig) {
      // Simulate successful login in mock mode
      setTimeout(() => {
        const mockUser = {
          id: 'mock-uuid-1234',
          email,
          user_metadata: { full_name: fullName || 'Dr. Alex Vance', institution, role }
        };
        onLoginSuccess(mockUser);
        setMessage({ text: 'Logged in successfully (Local Mock Mode).', type: 'success' });
        setLoading(false);
        setTimeout(onClose, 1200);
      }, 1000);
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
          full_name: profileFullName || data.user.user_metadata?.full_name || fullName || 'FedHealth User',
          institution: profileInstitution || data.user.user_metadata?.institution || institution,
          role: profileRole || data.user.user_metadata?.role || role,
          phone: profilePhone,
          department: profileDepartment,
          specialization: profileSpecialization,
          license_number: profileLicense,
          country: profileCountry,
          bio: profileBio
        });
        await insertLoginRecord({
          user_id: data.user.id,
          email: data.user.email || email,
          institution: profileInstitution || data.user.user_metadata?.institution || institution,
          status: 'success'
        });
      }

      onLoginSuccess(data.user);
      setMessage({ text: 'Logged in successfully!', type: 'success' });
      setTimeout(onClose, 1200);
    } catch (err: any) {
      if ((err.message || '').toLowerCase().includes('email not confirmed')) {
        setPendingVerificationEmail(email);
        setMessage({ text: 'Your Supabase project still has email confirmation enabled. Disable Confirm email in Supabase > Authentication > Providers > Email to stop confirmation mails.', type: 'error' });
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

    if (!isValidConfig) {
      setTimeout(() => {
        const mockUser = {
          id: 'mock-uuid-5678',
          email,
          user_metadata: { full_name: fullName || 'Dr. Sarah Connor', institution, role }
        };
        onLoginSuccess(mockUser);
        setMessage({ text: 'Account created successfully (Local Mock Mode).', type: 'success' });
        setLoading(false);
        setTimeout(onClose, 1200);
      }, 1000);
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
            phone: profilePhone,
            department: profileDepartment,
            specialization: profileSpecialization,
            license_number: profileLicense,
            country: profileCountry,
            bio: profileBio
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
          phone: profilePhone,
          department: profileDepartment,
          specialization: profileSpecialization,
          license_number: profileLicense,
          country: profileCountry,
          bio: profileBio
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
        setMessage({ text: 'Signup successful!', type: 'success' });
        setTimeout(onClose, 1500);
      } else {
        setPendingVerificationEmail(email);
        setActiveTab('login');
        setMessage({ text: 'Account created in Supabase, but your project is still configured to require email confirmation. Disable Confirm email in Supabase to remove confirmation mails.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to sign up.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const targetEmail = pendingVerificationEmail || email;
    if (!targetEmail) {
      setMessage({ text: 'Enter your email first, then request a resend.', type: 'error' });
      return;
    }

    if (!isValidConfig) {
      setMessage({ text: 'In mock mode, email confirmation is not required. Add your anon key to test real verification.', type: 'success' });
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await (supabase.auth as any).resend({
        type: 'signup',
        email: targetEmail,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      setMessage({ text: `Verification email resent to ${targetEmail}.`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to resend confirmation email.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const profilePayload = {
        id: currentUser.id,
        email: currentUser.email,
        full_name: profileFullName,
        institution: profileInstitution,
        role: profileRole,
        phone: profilePhone,
        department: profileDepartment,
        specialization: profileSpecialization,
        license_number: profileLicense,
        country: profileCountry,
        bio: profileBio
      };
      const { data, error } = await updateUserProfile(currentUser.id, profilePayload);
      if (error) throw error;
      onProfileUpdated?.(data || profilePayload);
      setMessage({ text: 'Profile updated successfully in Supabase.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    if (isValidConfig) {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    }
    onLoginSuccess(null);
    setMessage({ text: 'Logged out successfully.', type: 'success' });
    setLoading(false);
    setTimeout(onClose, 1000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl text-slate-950 shadow-lg shadow-cyan-500/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Supabase Authentication & Database</h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isValidConfig ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span className="text-xs font-mono text-slate-400">
                  {isValidConfig ? 'Connected to Supabase Remote DB' : 'Local Mock Mode (Fallback Active)'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-2 cursor-pointer">✕</button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-1.5 shadow-inner">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'signup' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'settings' ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plug className="w-4 h-4" />
            <span>Connection</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sql' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>SQL Schema</span>
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold font-sans shadow-inner ${
            message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {pendingVerificationEmail && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-inner animate-fadeIn">
            <div className="text-xs text-amber-200 font-semibold leading-relaxed">
              Verification pending for <span className="font-mono text-white">{pendingVerificationEmail}</span>. Check your email inbox and click the confirmation link, or resend it below.
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Mail className="w-4 h-4 text-slate-950" />}
                <span>Resend Confirmation Email</span>
              </button>
              <button
                type="button"
                onClick={() => setPendingVerificationEmail('')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Current User Status + Full Profile if Logged In */}
        {currentUser && activeTab !== 'sql' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-inner animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Active Supabase Session + Profile Center
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-xl text-[10px] font-mono font-bold">
                {profileRole || currentUser.user_metadata?.role || 'researcher'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><User className="w-4 h-4 text-cyan-400" /> Full Name</label>
                <input value={profileFullName} onChange={(e) => setProfileFullName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> Email</label>
                <input value={currentUser.email || ''} disabled className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Institution</label>
                <input value={profileInstitution} onChange={(e) => setProfileInstitution(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Role</label>
                <select value={profileRole} onChange={(e) => setProfileRole(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner">
                  <option value="researcher">Clinical Researcher</option>
                  <option value="doctor">Attending Physician</option>
                  <option value="admin">Enclave Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-400" /> Phone</label>
                <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /> Country</label>
                <input value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-cyan-400" /> Department</label>
                <input value={profileDepartment} onChange={(e) => setProfileDepartment(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-cyan-400" /> Specialization</label>
                <input value={profileSpecialization} onChange={(e) => setProfileSpecialization(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-cyan-400" /> Medical License Number</label>
                <input value={profileLicense} onChange={(e) => setProfileLicense(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-400" /> Bio / Notes</label>
                <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={4} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs shadow-inner resize-none" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                <span>Save Profile to Supabase</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-extrabold px-5 py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> Recent Login Records Stored in Supabase
              </h4>
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-950/90 text-slate-400 sticky top-0">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Institution</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {loginRecords.length > 0 ? loginRecords.map((record: any) => (
                        <tr key={record.id} className="hover:bg-slate-800/40">
                          <td className="p-3">{new Date(record.login_time || record.created_at).toLocaleString()}</td>
                          <td className="p-3">{record.email}</td>
                          <td className="p-3">{record.institution || '-'}</td>
                          <td className="p-3 text-emerald-400 font-bold">{record.status}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td className="p-3 text-slate-500" colSpan={4}>No login records available yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && !currentUser && (
          <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" /> Email Address
              </label>
              <input 
                type="email" 
                required
                placeholder="dr.vance@metrohospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-4 rounded-xl text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Lock className="w-4 h-4 text-slate-950" />}
                <span>Log In to FedHealth AI</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {activeTab === 'signup' && !currentUser && (
          <form onSubmit={handleSignup} className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> Full Name
              </label>
              <input 
                type="text" 
                required
                placeholder="Dr. Alex Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                placeholder="dr.vance@metrohospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2">Institution</label>
                <input 
                  type="text" 
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-2">Platform Role</label>
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
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-4 rounded-xl text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <ShieldCheck className="w-4 h-4 text-slate-950" />}
                <span>Create Secure Account</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CONNECTION SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-inner space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Plug className="w-4 h-4 text-emerald-400" /> Supabase Connection Settings
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Your project URL is prefilled from the credentials you shared. Paste the project anon key here to connect the app.
                  </p>
                </div>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-xl text-[10px] font-mono font-bold">
                  Ref: {DEFAULT_PROJECT_REF}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2">Project URL</label>
                  <input
                    type="text"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Use the project root URL, not the /rest/v1 path.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-2">Anon Public Key</label>
                  <div className="relative">
                    <input
                      type={showAnonKey ? 'text' : 'password'}
                      value={configAnonKey}
                      onChange={(e) => setConfigAnonKey(e.target.value)}
                      placeholder="Paste your Supabase anon public key here"
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
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Only the anon public key should be used in the browser. Never paste the service_role key here.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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

        {/* TAB 4: SUPABASE SQL SCHEMA */}
        {activeTab === 'sql' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
              <div>
                <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" /> Supabase SQL Schema & Migration Queries
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed max-w-lg">
                  Copy and paste the complete SQL script below into your Supabase project's SQL Editor to instantly create all necessary tables, Row Level Security (RLS) policies, and initial seed data.
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
  );
};
