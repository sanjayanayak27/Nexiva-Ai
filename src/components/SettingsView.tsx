/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Shield, Key, AlertTriangle, RefreshCw, 
  Settings2, Activity, Sparkles, Terminal, Check
} from 'lucide-react';

interface SettingsViewProps {
  user: any;
  onUpdateUser: (name: string, email: string) => void;
  onNavigate: (tab: string) => void;
}

export default function SettingsView({ user, onUpdateUser, onNavigate }: SettingsViewProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateUser(name, email);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-left font-sans">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          Platform Security & Profiles
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust credential metadata formats, check backend API endpoints, or launch the master tracking panel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile update form - col-span-7 */}
        <div className="md:col-span-7 p-6 rounded-2xl glass space-y-5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Profile Configuration</h3>

          {success && (
            <div className="p-3 rounded-lg bg-green-950/20 border border-green-500/20 text-xs text-green-400 font-mono flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile credentials synchronized securely!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Display Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-cyan-500 p-3 pl-10 rounded-xl text-xs outline-none text-slate-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">E-Mail Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-cyan-500 p-3 pl-10 rounded-xl text-xs outline-none text-slate-100 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:text-white text-xs font-extrabold transition-colors cursor-pointer"
            >
              {updating ? "Syncing..." : "Update Credentials"}
            </button>
          </form>
        </div>

        {/* Administration shortcuts - col-span-5 */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl glass flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-fuchsia-400 uppercase tracking-wider block mb-2">MASTER COMMAND CONTROL</span>
              <h4 className="font-bold text-slate-100 text-sm">Nexiva Administrator Room</h4>
              <p className="text-[11px] text-slate-400 mt-2 font-light leading-relaxed">
                Unlock elevated privileges to compile revenue statistics, review active member lists, audit client video files, and adjust platform coefficients.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-950">
              <button 
                onClick={() => onNavigate('admin')}
                className="w-full py-2.5 rounded-xl glow-btn text-black font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Go to Administration Panel
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850">
            <span className="text-xs font-mono text-slate-500 uppercase block mb-1">LOCAL CODES</span>
            <div className="space-y-2 text-[10px] font-mono text-slate-400">
              <div className="flex justify-between"><span>User ID:</span><span className="text-slate-300">usr_nexiva_101</span></div>
              <div className="flex justify-between"><span>Active Session Token:</span><span className="text-emerald-400">JWT_OK_2026</span></div>
              <div className="flex justify-between"><span>Region:</span><span className="text-slate-300">asia-east1</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
