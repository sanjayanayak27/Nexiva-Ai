/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Video, Database, Check, ShieldAlert, 
  Trash2, Plus, Sparkles, RefreshCw, Layers, DollarSign, 
  Globe, AlertCircle, ShoppingCart, Ban
} from 'lucide-react';
import { VideoAsset, ImageAsset, VoiceAsset } from '../types';

interface AdminPanelProps {
  videos: VideoAsset[];
  images: ImageAsset[];
  voices: VoiceAsset[];
  revenue: number;
  user: any;
  onGrantCredits: (amount: number) => void;
  onToggleUserPlan: (plan: 'free' | 'pro') => void;
  onDeleteAsset: (id: string, type: 'video' | 'image' | 'voice') => void;
}

export default function AdminPanel({ 
  videos, images, voices, revenue, user, onGrantCredits, onToggleUserPlan, onDeleteAsset 
}: AdminPanelProps) {
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 2500);
  };

  const handleForceCredits = () => {
    onGrantCredits(250);
    triggerToast("Injected 250 credits to client session.");
  };

  const handleForceTogglePlan = () => {
    const nextPlan = user.plan === 'free' ? 'pro' : 'free';
    onToggleUserPlan(nextPlan);
    triggerToast(`Shifted client tier to ${nextPlan.toUpperCase()}.`);
  };

  const totalAssetsNum = videos.length + images.length + voices.length;

  // Custom Data points for the majestic SVG graph
  const revenueHistory = [
    { label: "Jan", val: 400 },
    { label: "Feb", val: 850 },
    { label: "Mar", val: 1300 },
    { label: "Apr", val: 1900 },
    { label: "May", val: revenue } // dynamic based on Razorpay transactions!
  ];

  // Map revenue values to coordinates path inside a standard viewBox="0 0 500 200"
  const paddingX = 40;
  const paddingY = 30;
  const widthVal = 420;
  const heightVal = 140;
  const maxVal = Math.max(...revenueHistory.map(d => d.val), 3000);

  const pointsPath = revenueHistory.map((d, idx) => {
    const x = paddingX + (idx / (revenueHistory.length - 1)) * widthVal;
    const y = paddingY + heightVal - (d.val / maxVal) * heightVal;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-8 text-left relative font-sans">
      {/* Toast Alert overlay */}
      {adminToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] px-4 py-2 bg-fuchsia-950 border border-fuchsia-400 text-fuchsia-400 text-xs font-mono rounded-xl shadow-lg">
          ⚙️ Admin Panel: {adminToast}
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-fuchsia-500" /> Nexiva Admin Control Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time server stats, revenue charts, user databases, and active media asset auditing libraries.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl glass text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">TOTAL NET REVENUE</span>
          <p className="text-3xl font-extrabold text-white mt-1">${revenue.toFixed(2)}</p>
          <span className="text-[9px] font-mono text-emerald-400 block mt-1">✓ Live Razorpay balance</span>
        </div>

        <div className="p-5 rounded-2xl glass text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">PLATFORM REGISTRATIONS</span>
          <p className="text-3xl font-extrabold text-white mt-1">54,012</p>
          <span className="text-[9px] font-mono text-cyan-400 block mt-1">+24 acquired today</span>
        </div>

        <div className="p-5 rounded-2xl glass text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">GENERATED ASSETS IN MEMORY</span>
          <p className="text-3xl font-extrabold text-white mt-1">{totalAssetsNum}</p>
          <span className="text-[9px] font-mono text-purple-400 block mt-1">{videos.length} videos | {images.length} images | {voices.length} voices</span>
        </div>

        <div className="p-5 rounded-2xl glass text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">ACTIVE SERVERS NODES</span>
          <p className="text-3xl font-extrabold text-white mt-1">100%</p>
          <span className="text-[9px] font-mono text-fuchsia-400 block mt-1">128 parallel tensor chips online</span>
        </div>
      </div>

      {/* Interactive Custom SVG Chart Graph */}
      <div className="p-6 rounded-2xl glass">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>REVENUE TRACKING OVERVIEW (USD)</span>
          <span className="text-[10px] font-mono text-purple-400">glowing neon canvas</span>
        </h3>

        <div className="w-full h-[240px] bg-slate-950 rounded-xl relative overflow-hidden p-4 border border-slate-850">
          <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="neonGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="40" y1="30" x2="460" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="100" x2="460" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="40" y1="170" x2="460" y2="170" stroke="#334155" strokeWidth="1.5" />

            {/* Glowing Gradient fill area */}
            <path 
              d={`M ${paddingX},170 L ${pointsPath} L 460,170 Z`} 
              fill="url(#neonGlow)" 
            />

            {/* Render line path */}
            <polyline 
              fill="none" 
              stroke="url(#neonGlowGradient)" 
              strokeWidth="3.5" 
              points={pointsPath} 
              className="stroke-fuchsia-500"
            />

            {/* Hover Points Circles */}
            {revenueHistory.map((d, idx) => {
              const x = paddingX + (idx / (revenueHistory.length - 1)) * widthVal;
              const y = paddingY + heightVal - (d.val / maxVal) * heightVal;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" className="fill-fuchsia-500 stroke-slate-950 stroke-2" />
                  <text x={x} y={y - 12} textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    ${Math.round(d.val)}
                  </text>
                  <text x={x} y="185" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Management table - col span 6 */}
        <div className="lg:col-span-6 p-5 rounded-2xl glass font-sans">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-4">
            Active User accounts Directory
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                  <th className="pb-3 text-left">MEMBER</th>
                  <th className="pb-3 text-center">PLAN</th>
                  <th className="pb-3 text-right">CREDITS</th>
                  <th className="pb-3 text-right">CONTROLS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-805">
                {/* Simulated other records */}
                <tr>
                  <td className="py-3 flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Amit" alt="AI Avatar" className="w-[28px] h-[28px] rounded-full bg-slate-820" />
                    <div>
                      <p className="font-bold text-white text-[11px]">Amit Sharma</p>
                      <span className="text-[10px] text-slate-500 font-light block">amitsh@nexiva.in</span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-mono text-[9px] uppercase font-bold">PRO</span>
                  </td>
                  <td className="py-3 text-right font-mono text-[11.5px] font-bold text-slate-100">850</td>
                  <td className="py-3 text-right">
                    <span className="text-[9px] text-slate-500 font-mono font-bold">SYS CONST</span>
                  </td>
                </tr>

                {/* Primary User Row (allows live manipulations of client credentials in state!) */}
                <tr className="bg-slate-950/40">
                  <td className="py-3 px-1 flex items-center gap-2">
                    <img src={user.avatar} alt="AI Avatar" className="w-[28px] h-[28px] rounded-full bg-slate-820 border border-cyan-500" />
                    <div>
                      <p className="font-bold text-white text-[11.5px]">{user.name} <span className="text-[9px] px-1 text-cyan-400 font-mono bg-cyan-950 rounded">YOU</span></p>
                      <span className="text-[10px] text-slate-500 font-light block">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${user.plan === 'pro' ? 'bg-purple-950 text-purple-400 border border-purple-500/20' : 'bg-slate-950 text-slate-500'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-[11.5px] font-bold text-cyan-400">{user.credits}</td>
                  <td className="py-3 text-right space-y-1">
                    <button 
                      onClick={handleForceCredits}
                      className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-bold hover:bg-cyan-500 hover:text-slate-950 transition-colors block ml-auto select-none"
                    >
                      +250 CRD
                    </button>
                    <button 
                      onClick={handleForceTogglePlan}
                      className="text-[9px] px-2 py-0.5 rounded bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-500/30 font-mono font-bold hover:bg-fuchsia-500 hover:text-slate-950 transition-colors block ml-auto select-none"
                    >
                      TOGGLE TIER
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Asset Directory auditing - col span 6 */}
        <div className="lg:col-span-6 p-5 rounded-2xl glass font-sans">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-4">
            Generative Media Assets Audit Desk
          </h3>

          <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
            {videos.length === 0 && images.length === 0 && (
              <p className="text-xs text-slate-500 italic py-8 text-center select-none">No generated files registered to audit desk.</p>
            )}

            {/* Videos auditing */}
            {videos.map((vid) => (
              <div key={vid.id} className="p-2.5 rounded bg-slate-955 border border-slate-850 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-9 rounded bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                    <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-mono text-cyan-400 font-bold block">VIDEO</span>
                    <h4 className="text-xs font-bold text-white truncate leading-tight uppercase">{vid.title}</h4>
                    <p className="text-[9px] text-slate-500 line-clamp-1 truncate font-light leading-none mt-0.5">Prompt: {vid.prompt}</p>
                  </div>
                </div>

                <button 
                  onClick={() => { onDeleteAsset(vid.id, 'video'); triggerToast(`Purged collection video ${vid.id}`); }}
                  className="p-1 px-2.5 rounded bg-slate-950 hover:bg-red-950 text-red-500 border border-slate-850 hover:border-red-500/20 text-[10px] font-mono transition-all"
                  title="Purge Video Asset"
                >
                  PURGE
                </button>
              </div>
            ))}

            {/* Images auditing */}
            {images.map((img) => (
              <div key={img.id} className="p-2.5 rounded bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-9 rounded bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-mono text-purple-400 font-bold block">IMAGE</span>
                    <h4 className="text-xs font-bold text-white truncate leading-tight uppercase">{img.style} Diffusion File</h4>
                    <p className="text-[9px] text-slate-500 line-clamp-1 truncate font-light leading-none mt-0.5">Prompt: {img.prompt}</p>
                  </div>
                </div>

                <button 
                  onClick={() => { onDeleteAsset(img.id, 'image'); triggerToast(`Purged collection image ${img.id}`); }}
                  className="p-1 px-2.5 rounded bg-slate-950 hover:bg-red-950 text-red-500 border border-slate-850 hover:border-red-500/20 text-[10px] font-mono transition-all"
                  title="Purge Image Asset"
                >
                  PURGE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
