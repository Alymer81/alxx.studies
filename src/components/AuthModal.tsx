import React, { useState } from 'react';
import { User } from '../types';
import { AVATAR_GRADIENTS } from '../data/defaults';
import { Shield, X, LogOut, Sparkles, AlertTriangle, Lock } from 'lucide-react';
import { AlxxLogo } from './AlxxLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister
        ? { email, username, password, avatarIndex }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      onLogin(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('alxx3433@gmail.com');
    setUsername('alxx');
    setPassword('adminpassword123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* Profile Details */
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${AVATAR_GRADIENTS[currentUser.avatarIndex || 0]} flex items-center justify-center text-2xl font-bold uppercase shadow-lg mb-4 ring-4 ring-white/10`}>
              {currentUser.username.slice(0, 2)}
            </div>

            <h3 className="text-xl font-bold flex items-center gap-2">
              {currentUser.username}
              {currentUser.role === 'admin' && (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">{currentUser.email}</p>

            {currentUser.email === 'alxx3433@gmail.com' && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 w-full text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Superadmin Authority Enabled</div>
                  <div className="text-[11px] text-amber-300/80">
                    You can manage passwords, promote users to admin, ban accounts, publish news updates, and add custom games.
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 w-full mt-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-left">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Study Streak</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">🔥 7 Days</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-left">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Role</div>
                <div className="text-lg font-bold text-amber-400 mt-0.5 capitalize">{currentUser.role}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-stone-300 hover:text-rose-400 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          /* Sign In & Registration Form */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlxxLogo size="sm" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              {isRegister ? 'Create alxx.studies Account' : 'Sign in to alxx.studies'}
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              {isRegister
                ? 'Create a secure account with a password to save custom bookmarks and desk stats.'
                : 'Enter your credentials to unlock your personalized study suite.'}
            </p>

            {/* Quick Admin Auto-Fill */}
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="mb-4 w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs hover:bg-amber-500/15 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Fill Owner Admin (alxx3433@gmail.com)</span>
              </span>
              <span className="text-[10px] font-semibold underline">Auto-fill</span>
            </button>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@school.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500/60"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-3" />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1.5">
                    Choose Avatar Color
                  </label>
                  <div className="flex items-center gap-2">
                    {AVATAR_GRADIENTS.map((grad, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarIndex(idx)}
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} transition-transform ${
                          avatarIndex === idx ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-stone-900' : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-white text-stone-950 font-semibold text-xs hover:bg-stone-200 transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-xs text-stone-400 hover:text-white transition-colors"
              >
                {isRegister
                  ? 'Already have an account? Sign In'
                  : "Don't have an account yet? Create one"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
