/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Video, Image, Mic, Play, ArrowRight, TrendingUp, 
  Database, RefreshCw, Layers, Calendar, ChevronRight, UserCheck
} from 'lucide-react';
import { VideoAsset, Template } from '../types';

interface DashboardViewProps {
  user: any;
  videos: VideoAsset[];
  onNavigate: (tab: string) => void;
  onSelectVideo: (video: VideoAsset) => void;
  onSelectTemplate: (template: Template) => void;
}

export default function DashboardView({ user, videos, onNavigate, onSelectVideo, onSelectTemplate }: DashboardViewProps) {
  // Seeding trending templates
  const templates: Template[] = [
    {
      id: "tpl_1",
      title: "Mech Bonsai Conservatory",
      description: "Organic cybernetic greenhouse with glowing leaves.",
      thumbnail: "https://picsum.photos/seed/cyberbonsai/640/360",
      prompt: "A beautiful organic mecha-bonsai tree inside a glass high-tech conservatory greenhouse, glowing pastel leaves, raytracing 8K",
      style: "3D Art",
    },
    {
      id: "tpl_2",
      title: "Cyberpunk Rain Night",
      description: "Neon Tokyo driving with vertical holographic signs.",
      thumbnail: "https://picsum.photos/seed/cyberrain/640/360",
      prompt: "Slick rain-soaked cyberpunk Tokyo street, high speed flying car reflecting red billboard lights, cinematic depth of field",
      style: "Realistic",
    },
    {
      id: "tpl_3",
      title: "Cosmic Library Portal",
      description: "Warm mystical room of books with floating galaxy sphere.",
      thumbnail: "https://picsum.photos/seed/portal/640/360",
      prompt: "An ancient library room with gold-leaf ceiling where a glowing star system sphere floats silently above an open oak table",
      style: "Pixar 3D",
    }
  ];

  const recentVideos = videos.slice(0, 4);

  return (
    <div className="space-y-8 text-left">
      {/* Welcome & Credit Bar banner */}
      <div className="p-6 md:p-8 rounded-2xl glass relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-[20%] w-60 h-20 bg-purple-500/5 rounded-full blur-[50px] pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono uppercase tracking-widest font-bold">
              AUTHORIZED
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Active Session Secure
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Greetings, {user?.name || "Sanjay Nayak"}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl font-light">
            Ready to animate your vision? Your current workspaces have elevated priority processing on Nexiva's Veo network thread.
          </p>
        </div>

        {/* Credit display */}
        <div className="p-4 rounded-xl relative overflow-hidden flex flex-col gap-1 text-left min-w-[200px] border border-white/10 bg-[#050505]/80">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>CREDITS REMAINING</span>
            <span className="text-cyan-400 font-bold">{user?.credits} / 1000</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((user?.credits || 120) / 1000) * 100)}%` }}
            />
          </div>
          <button 
            onClick={() => onNavigate('pricing')}
            className="mt-3 py-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 text-[11px] font-semibold border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 transition-all text-center select-none"
          >
            Refill Engine Credits
          </button>
        </div>
      </div>

      {/* Main Grid: Tools / Templates and Recent items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core AI Tools Sections - col-span-8 */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> AI Creative Chambers
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => onNavigate('studio')}
                className="p-5 rounded-xl glass hover:border-cyan-500/30 transition-all cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="font-bold text-white text-sm">AI Video Studio</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 font-light leading-relaxed">Synthesize high precision text-to-video scenes easily.</p>
              </div>

              <div 
                onClick={() => onNavigate('studio')}
                className="p-5 rounded-xl glass hover:border-purple-500/30 transition-all cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Image className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-white text-sm">AI Image Chamber</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 font-light leading-relaxed">Exquisite cinematic text and image diffusion models.</p>
              </div>

              <div 
                onClick={() => onNavigate('studio')}
                className="p-5 rounded-xl glass hover:border-fuchsia-500/30 transition-all cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-fuchsia-950/50 border border-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5 text-fuchsia-400" />
                </div>
                <h4 className="font-bold text-white text-sm">Speech & Music Audio</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 font-light leading-relaxed">Generate Hindi and English voices with ambient tracks.</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" /> Trending Generators
              </h3>
              <span className="text-xs text-slate-500 flex items-center cursor-pointer hover:text-cyan-400" onClick={() => onNavigate('studio')}>
                All Presets <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id} 
                  className="rounded-xl overflow-hidden glass hover:border-cyan-500/30 transition-all group flex flex-col justify-between"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img 
                      src={tpl.thumbnail} 
                      alt={tpl.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-cyan-400 uppercase">
                      {tpl.style}
                    </span>
                  </div>
                  
                  <div className="p-4 text-left">
                    <h4 className="font-bold text-white text-xs leading-snug">{tpl.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light">{tpl.description}</p>
                    <button 
                      onClick={() => onSelectTemplate(tpl)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 test-xs text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 text-[10px] text-center font-semibold tracking-wide"
                    >
                      Remix Prompt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Videos & Action logs - col-span-4 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl glass">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
              <span>RECENT PRODUCTIONS</span>
              <span className="text-[10px] font-mono font-normal text-slate-500 cursor-pointer hover:text-cyan-400" onClick={() => onNavigate('my-videos')}>
                View Collection
              </span>
            </h3>

            {recentVideos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-500">No generated video files present.</p>
                <button 
                  onClick={() => onNavigate('studio')}
                  className="mt-3 text-[10px] px-3 py-1 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-500/20"
                >
                  Run Video Generator
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentVideos.map((vid) => (
                  <div 
                    key={vid.id}
                    onClick={() => onSelectVideo(vid)}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-805 hover:border-cyan-500/30 transition-all cursor-pointer flex gap-3 group text-left"
                  >
                    <div className="w-16 h-12 rounded bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative flex items-center justify-center">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-cyan-500/20 transition-all">
                        <Play className="w-3.5 h-3.5 text-white drop-shadow" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors uppercase leading-tight">
                        {vid.title}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-500 mt-1">Duration: {vid.duration}s | {vid.aspectRatio}</p>
                      <p className="text-[9px] font-light text-slate-400 line-clamp-1 mt-0.5">{vid.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Platform Statistics Box */}
          <div className="p-5 rounded-2xl glass">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-3">SYSTEM PIPELINES</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Veo Tensor Nodes</span>
                <span className="text-cyan-400 font-bold">128/128 Active</span>
              </div>
              <div className="flex justify-between font-mono text-slate-400">
                <span>Gemini API State</span>
                <span className="text-emerald-400 font-bold">Operational</span>
              </div>
              <div className="flex justify-between font-mono text-slate-400">
                <span>Razorpay Sandbox</span>
                <span className="text-fuchsia-400 font-bold">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
