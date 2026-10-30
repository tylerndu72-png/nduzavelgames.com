import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';
import { AppStorage } from '../utils/storage.ts';
import { X, Shield, Lock, Mail, User as UserIcon, CheckCircle, ArrowRight, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'verify' | 'recovery';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ text: 'Please fill in both email and password.', type: 'error' });
      return;
    }

    const users = AppStorage.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (existing) {
      AppStorage.setCurrentUser(existing);
      onLoginSuccess(existing);
      onClose();
    } else {
      // If Tyler Ndu's email is entered, automatically create owner
      const isTyler = email.trim().toLowerCase() === 'tylerndu72@gmail.com';
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: isTyler ? 'Mr. Tyler Ndu' : name || email.split('@')[0],
        email: email.trim(),
        role: isTyler ? 'owner' : 'member',
        avatar: isTyler
          ? '/src/assets/images/hero_tyler_ndu_1793347989778.jpg'
          : `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        title: isTyler ? 'Founder & Software Architect' : 'NDÛZAVÉL Member',
        verified: true,
        joinedAt: new Date().toISOString(),
      };
      AppStorage.saveUsers([...users, newUser]);
      AppStorage.setCurrentUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name || !email || !password) {
      setMessage({ text: 'All fields are required.', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    // Move to simulated email verification step
    setMode('verify');
    setMessage({
      text: `A 6-digit verification code was dispatched to ${email}. (Demo code: 720914)`,
      type: 'success',
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length < 4) {
      setMessage({ text: 'Please enter a valid verification code.', type: 'error' });
      return;
    }

    const users = AppStorage.getUsers();
    const isTyler = email.trim().toLowerCase() === 'tylerndu72@gmail.com';
    const role: UserRole = isTyler ? 'owner' : 'member';

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: isTyler ? 'Mr. Tyler Ndu' : name,
      email: email.trim(),
      role: role,
      avatar: isTyler
        ? '/src/assets/images/hero_tyler_ndu_1793347989778.jpg'
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      title: isTyler ? 'Founder & Architect' : 'Ecosystem Member',
      verified: true,
      joinedAt: new Date().toISOString(),
    };

    AppStorage.saveUsers([...users, newUser]);
    AppStorage.setCurrentUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setMessage({ text: 'Please enter your registered email.', type: 'error' });
      return;
    }
    setMessage({
      text: `Password reset instructions and a secure recovery link have been dispatched to ${recoveryEmail}.`,
      type: 'success',
    });
  };

  const quickLoginAs = (presetRole: 'owner' | 'member') => {
    const users = AppStorage.getUsers();
    if (presetRole === 'owner') {
      const owner = users.find((u) => u.role === 'owner') || {
        id: 'user-tyler-ndu',
        name: 'Mr. Tyler Ndu',
        email: 'tylerndu72@gmail.com',
        role: 'owner' as UserRole,
        avatar: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
        title: 'Founder & Software Architect',
        verified: true,
        joinedAt: '2026-01-01T00:00:00Z',
      };
      AppStorage.setCurrentUser(owner);
      onLoginSuccess(owner);
      onClose();
    } else {
      const member = users.find((u) => u.role === 'member') || {
        id: 'user-marcus',
        name: 'Marcus Vance',
        email: 'marcus.v@techinnovate.io',
        role: 'member' as UserRole,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
        title: 'Game Developer & Modeler',
        verified: true,
        joinedAt: '2026-02-10T12:00:00Z',
      };
      AppStorage.setCurrentUser(member);
      onLoginSuccess(member);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Account Authentication Modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-[#0D121D] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            {mode === 'login' && 'Sign In to NDÛZAVÉL'}
            {mode === 'register' && 'Create Member Account'}
            {mode === 'verify' && 'Verify Your Email'}
            {mode === 'recovery' && 'Recover Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Access member tools, interactive studio & community channels'}
            {mode === 'register' && 'Join the developer & gaming ecosystem owned by Tyler Ndu'}
            {mode === 'verify' && 'Enter the 6-digit confirmation code sent to your inbox'}
            {mode === 'recovery' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-xs mb-4 ${
              message.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Quick Demo Switchers */}
        <div className="mb-6 p-3 rounded-xl bg-[#090D15] border border-slate-800">
          <p className="text-[11px] font-mono uppercase text-slate-400 mb-2 tracking-wider">
            Quick One-Click Test Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLoginAs('owner')}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors text-left"
            >
              👑 Mr. Tyler Ndu
              <span className="block text-[10px] text-amber-400/80 font-normal">Platform Owner</span>
            </button>
            <button
              onClick={() => quickLoginAs('member')}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition-colors text-left"
            >
              👤 Marcus Vance
              <span className="block text-[10px] text-sky-400/80 font-normal">Verified Member</span>
            </button>
          </div>
        </div>

        {/* Form: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('recovery');
                    setMessage(null);
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setMessage(null);
                }}
                className="text-amber-400 font-medium hover:underline"
              >
                Register now
              </button>
            </div>
          </form>
        )}

        {/* Form: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setMessage(null);
                }}
                className="text-amber-400 font-medium hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* Form: VERIFY EMAIL */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enter 6-Digit Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="e.g. 720914"
                  maxLength={6}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white tracking-widest font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Activate Account</span>
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-slate-400 hover:text-white"
              >
                Back to registration
              </button>
            </div>
          </form>
        )}

        {/* Form: RECOVERY */}
        {mode === 'recovery' && (
          <form onSubmit={handlePasswordRecovery} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md transition-all"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setMessage(null);
                }}
                className="text-amber-400 font-medium hover:underline"
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
