/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Sparkles, Video, Image, Mic, Layers, Star, 
  HelpCircle, ShieldCheck, ArrowRight, Zap, ArrowUpRight, 
  TrendingUp, RefreshCw, Layers2, Lock, Disc
} from 'lucide-react';

interface LandingPageProps {
  onStartGenerating: () => void;
  onLogin: () => void;
  onViewPricing: () => void;
  user: any;
}

export default function LandingPage({ onStartGenerating, onLogin, onViewPricing, user }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoMode, setDemoMode] = useState<'video' | 'image' | 'voice'>('video');

  const features = [
    {
      icon: <Video className="w-6 h-6 text-cyan-400" />,
      title: "Text to Video AI",
      description: "Generate cinematic 8K video content in any style simply by writing a description. Driven by Veo AI models."
    },
    {
      icon: <Image className="w-6 h-6 text-purple-400" />,
      title: "Styles & Aspect Ratios",
      description: "Instantly create high-resolution content matching Pixar, Anime, Realistic, or 3D animations with single click presets."
    },
    {
      icon: <Mic className="w-6 h-6 text-fuchsia-400" />,
      title: "AI Voice & Lip Sync",
      description: "Convert scripts into rich English or Hindi natural voices. Layer premium background tracks automatically."
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      title: "Full Studio Editor",
      description: "Trim videos, customize auto-generated subtitles, adjust dynamic sound overlays, and export MP4 clips directly."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-pink-500" />,
      title: "Admin Panel & Governance",
      description: "Analyze credit consumption, oversee generated assets, and test billing setups inside a secure, high-tech admin module."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Instant Prompt Improver",
      description: "Leverage Google Gemini API server-side to auto-expand basic lines into comprehensive cinematic prompts."
    }
  ];

  const faqItems = [
    {
      q: "How does the AI Video Generation process work?",
      a: "Nexiva AI uses advanced video synthesis models (Veo-3.1-lite) to translate text instructions or reference static images into fluid, smooth-animated MP4 video clips. Our pipeline is optimized for zero visual distortion and realistic lighting rendering."
    },
    {
      q: "Can I choose dynamic aspect ratios and styles?",
      a: "Yes! Nexiva AI Studio allows generating in popular ratios like cinematic 16:9 for YouTube/Web, or vertical 9:16 for TikTok, Shorts, and Reels. You can switch styles easily between Anime, Pixar, Cartoon, Realistic, and 3D."
    },
    {
      q: "How are video subtitles and voice narration handled?",
      a: "Our platform supports voice generators in multiple languages including Hindi and English. High-precision speech-to-text models can render beautiful subtitle layers which you can modify, shift, or format inside the built-in Video Editor."
    },
    {
      q: "Is there a trial credit grant available?",
      a: "Absolutely! New sign-ups receive 120 free platform credits to explore Video, Image, and Speech tools. Pro pricing plans grant additional automated credit limits plus high-speed rendering threads."
    }
  ];

  const howItWorks = [
    { step: "01", title: "Write or Embed prompt", desc: "Type a descriptive scene or upload an image as your animation baseline, then enrich it using our Gemini assistant." },
    { step: "02", title: "Select Aesthetic specs", desc: "Pick your preferred visual template (Anime, Realistic etc.) along with target aspect ratios and vocal lines." },
    { step: "03", title: "Generate & Refine", desc: "Watch the generative loader output your asset in real-time, then use our trim and subtitle tools to polish." }
  ];

  return (
    <div className="bg-[#050505] text-[#eee] min-h-screen relative overflow-hidden font-sans grid-bg">
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Landing Header */}
      <header className="border-b border-white/5 bg-[#050505]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glow-btn flex items-center justify-center shadow-lg shadow-cyan-500/15">
              <Sparkles className="w-5 h-5 text-black animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
              NEXIVA <span className="neon-cyan text-xs tracking-widest font-mono font-medium">STUDIO</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#editor-demo" className="hover:text-cyan-400 transition-colors">Interactive Demo</a>
            <a href="#how" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={onStartGenerating}
                className="px-5 py-2 text-sm font-semibold rounded-xl border border-cyan-500/40 bg-cyan-950/25 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all hover:neon-cyan flex items-center gap-2"
              >
                Go to AI Studio <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button onClick={onLogin} className="text-sm font-medium px-4 py-2 text-white/70 hover:text-cyan-400 transition-colors">
                  Log In
                </button>
                <button 
                  onClick={onLogin} 
                  className="glow-btn px-5 py-2 text-sm font-bold rounded-xl text-black shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Start Generating
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono neon-cyan mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Video Synthesis Is Alive
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-tight"
        >
          Animate Your Thoughts <br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Into Cinematic Masterpieces
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base md:text-xl text-slate-400 max-w-2xl mt-6 font-light leading-relaxed"
        >
          Transform scripts, simple prompts, and images into spectacular 8K videos, cinematic snapshots, and high-fidelity Hindi & English voices.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <button 
            onClick={onStartGenerating}
            className="px-8 py-4 text-base font-semibold rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2"
          >
            Enter Nexiva AI Studio <Sparkles className="w-5 h-5 fill-slate-950" />
          </button>
          <button 
            onClick={onViewPricing}
            className="px-8 py-4 text-base font-semibold rounded-2xl border border-slate-800 bg-slate-900/35 hover:bg-slate-900 text-white hover:border-slate-700 transition-all"
          >
            Check Pro Tiers
          </button>
        </motion.div>

        {/* Demo App Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="w-full max-w-5xl mt-20 relative rounded-2xl overflow-hidden gradient-border p-1 shadow-2xl"
          id="editor-demo"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-600/5 pointer-events-none" />
          
          {/* Header controls inside mockup */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/85 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-semibold text-slate-200">Interactive Preview Console</span>
            </div>
            <div className="flex rounded-md bg-slate-950 border border-slate-800 p-0.5">
              <button 
                onClick={() => setDemoMode('video')}
                className={`px-3 py-1 rounded text-xs transition-colors ${demoMode === 'video' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:text-white'}`}
              >
                AI Video
              </button>
              <button 
                onClick={() => setDemoMode('image')}
                className={`px-3 py-1 rounded text-xs transition-colors ${demoMode === 'image' ? 'bg-purple-500/20 text-purple-400' : 'hover:text-white'}`}
              >
                AI Image
              </button>
              <button 
                onClick={() => setDemoMode('voice')}
                className={`px-3 py-1 rounded text-xs transition-colors ${demoMode === 'voice' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'hover:text-white'}`}
              >
                AI Voice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
            {/* Control Panel Simulation */}
            <div className="md:col-span-5 p-6 border-r border-slate-800/80 flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  {demoMode === 'video' ? 'Veo Generative Engine' : demoMode === 'image' ? 'Cinematic Text Diffusion' : 'Narrative Synthesizer'}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  {demoMode === 'video' ? 'Cyberpunk Horizon Loop' : demoMode === 'image' ? 'Solar Mech-bonsai Greenhouse' : 'English Ethereal Voice'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {demoMode === 'video' ? 'A dramatic high-speed flight across deep cyberpunk canyons illuminated by flickering vertical projection advertising billboards.' :
                   demoMode === 'image' ? 'Mecha robot tenderly inspecting complex glowing plants with bioluminescent leaves, raytracing, intricate mechanical gears, volumetric steam.' :
                   'Converts dense scripting text into highly emotional voice lines with warm reverb, paired background audio, and customized lip-synced subtitles.'}
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-fuchsia-500 block mb-1">PROMPT USED:</span>
                    {demoMode === 'video' ? 'Slick cyberpunk flying cars drifting between digital neon sky-bridges...' :
                     demoMode === 'image' ? 'Mech commander inspecting rare bioluminescent orchid bonsai...' :
                     'High fidelity synthesis: Nexiva AI represents unlimited cinematic possibilities...'}
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">Aspect Ratio: 16:9</span>
                    <span className="text-[10px] font-mono rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">Style: Realistic 3D</span>
                    <span className="text-[10px] font-mono rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">Credits: Free Taster</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-905 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Estimated duration: <span className="text-slate-200 font-mono">10.0s</span>
                </div>
                <button 
                  onClick={onStartGenerating}
                  className="px-4 py-2 rounded-lg bg-cyan-950/45 border border-cyan-500/40 text-cyan-400 text-xs font-semibold hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Initialize Creator Mode
                </button>
              </div>
            </div>

            {/* Simulated Live Renderer Screen */}
            <div className="md:col-span-7 bg-slate-950 relative flex items-center justify-center p-6 md:p-10">
              <AnimatePresence mode="wait">
                {demoMode === 'video' && (
                  <motion.div 
                    key="video-demo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full min-h-[250px] relative rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center"
                  >
                    <video 
                      src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-futuristic-cyberpunk-city-43110-large.mp4"
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-500/20 inline-block max-w-xs">
                        "Welcome to Nexiva Cyberpunk Tokyo 2099"
                      </p>
                    </div>
                  </motion.div>
                )}

                {demoMode === 'image' && (
                  <motion.div 
                    key="image-demo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-[300px] relative rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-900"
                  >
                    <img 
                      src="https://picsum.photos/seed/cyberbonsai/800/500" 
                      alt="Bonsai Mecha Concept by Nexiva"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-fuchsia-400">
                      8K Cinematic PNG
                    </div>
                  </motion.div>
                )}

                {demoMode === 'voice' && (
                  <motion.div 
                    key="voice-demo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full min-h-[250px] flex flex-col items-center justify-center text-center p-6 gap-4"
                  >
                    {/* Pulsing Audio Sphere */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-md animate-ping" />
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                        <Disc className="w-8 h-8 text-white animate-spin" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Ethereal Male Syllables</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">Simulated 24,000Hz WAV studio streaming. Beautiful, crisp speech matching auto-generated transcript subtitles.</p>
                    </div>
                    <div className="w-full max-w-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex gap-1.5 items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400">● Live Audio Stream</span>
                      <span className="text-slate-400">0:10 / 0:10s</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 border-t border-white/5 bg-[#050505]/40 backdrop-blur-sm relative" id="features">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-mono neon-cyan uppercase tracking-widest block mb-2">Architectural Powerhouse</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Full-Stack AI Production Suite</h2>
            <p className="text-white/60 mt-4 leading-relaxed font-light">Every single element necessary to produce, narrative voice-layer, customize subtitles, test checkout models and administer client growth curves.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-2xl glass hover:border-cyan-500/30 transition-all group hover:bg-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{feat.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer" onClick={onStartGenerating}>
                  <span>Explore Creator Tool</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-t border-white/5 bg-[#050505]/20" id="how">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-mono neon-purple uppercase tracking-widest block mb-2">Simplified Workflow</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Three Steps to Stardom</h2>
            <p className="text-white/60 mt-4 font-light">See how fast ideas convert to studio clips.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl glass relative overflow-hidden">
                <div className="text-6xl font-bold font-mono text-cyan-950 absolute -top-4 -right-2 tracking-tighter opacity-20">{item.step}</div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-4">Step {item.step}</span>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-white/5 bg-[#050505]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Loved by Modern Creators</h2>
            <p className="text-white/60 mt-4 font-light">Read feedback from our global generative video production community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"Nexiva's video generation engine completely transformed our sci-fi trailer workflow. Expanding ideas with the integrated Gemini prompter produces beautiful outputs!"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Alex" alt="Alex" className="w-9 h-9 rounded-full bg-slate-800" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-white">Alex Mercer</h4>
                  <span className="text-[10px] font-mono text-slate-500">Sci-Fi Director, Nexus Labs</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-850">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"I produced a 2-minute narrative cartoon with localized Hindi voice support in less than one afternoon. The subtitle editor lets us adjust precise sync times easily."</p>
              <div className="mt-6 flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Priya" alt="Priya" className="w-9 h-9 rounded-full bg-slate-800" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-white">Priya Patel</h4>
                  <span className="text-[10px] font-mono text-slate-500">Cartoon Content Strategist</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-850">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"The glassmorphic dashboard interface is blazing fast. Plus, having simulated billing and full analytics controls has given us incredible flexibility."</p>
              <div className="mt-6 flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Sven" alt="Sven" className="w-9 h-9 rounded-full bg-slate-800" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-white">Sven Lindqvist</h4>
                  <span className="text-[10px] font-mono text-slate-500">UI/UX Designer & Cinematic Artist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Pricing Teaser Section */}
      <section className="py-24 border-t border-white/5 bg-[#050505]/40" id="pricing">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-600/5 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">Choose Your Creative Orbit</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto font-light">Flexible credit bundles and subscription tools designed for ambitious designers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 text-left max-w-3xl mx-auto">
            <div className="glass p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Standard Starter</span>
                <h3 className="text-2xl font-bold text-white">Free Plan</h3>
                <p className="text-3xl font-extrabold text-cyan-400 mt-2">$0 <span className="text-xs text-slate-500">/ forever</span></p>
                <p className="text-slate-400 text-xs mt-3">Try out basic features with standard priority processing.</p>
                <ul className="text-xs text-slate-300 space-y-2 mt-4 font-light">
                  <li className="flex items-center gap-2">✓ 120 credit welcome allocation</li>
                  <li className="flex items-center gap-2">✓ Aspect ratios (16:9, 1:1)</li>
                  <li className="flex items-center gap-2">✓ Sample video & music presets</li>
                </ul>
              </div>
              <button onClick={onStartGenerating} className="mt-6 w-full py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 hover:bg-slate-900 transition-colors">
                Launch Dashboard
              </button>
            </div>

            <div className="border border-cyan-500/30 bg-slate-950 p-6 rounded-2xl flex flex-col justify-between relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono">POPULAR CHOICE</span>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">Unleashed Creativity</span>
                <h3 className="text-2xl font-bold text-white">Pro Creator</h3>
                <p className="text-3xl font-extrabold text-cyan-400 mt-2">$29 <span className="text-xs text-slate-500">/ user / mo</span></p>
                <p className="text-slate-400 text-xs mt-3">High speed model priorities, unlimited asset saving, and full vocal synchronization overlays.</p>
                <ul className="text-xs text-slate-300 space-y-2 mt-4 font-light">
                  <li className="flex items-center gap-2">✓ 1000 credit monthly gift</li>
                  <li className="flex items-center gap-2">✓ Professional Hindi, English voices</li>
                  <li className="flex items-center gap-2">✓ High value 4K prompt enhancements</li>
                  <li className="flex items-center gap-2">✓ Full Admin module access</li>
                </ul>
              </div>
              <button onClick={onViewPricing} className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/10">
                Upgrade with Razorpay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-slate-900 max-w-4xl mx-auto px-4" id="faq">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-8 h-8 text-cyan-400" /> FAQ
          </h2>
          <p className="text-slate-400 mt-2 font-light">Have questions before launching? Find answers quickly below.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div 
              key={idx} 
              className="border border-slate-900 bg-slate-900/20 rounded-xl overflow-hidden transition-all"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center text-slate-200 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm md:text-base">{item.q}</span>
                <span className="text-xs font-mono text-cyan-400">{activeFaq === idx ? "Collapse -" : "Expand +"}</span>
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-850 bg-slate-950/40"
                  >
                    <p className="p-6 text-sm text-slate-400 leading-relaxed font-light">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-300">Nexiva AI Studio</span>
          </div>
          
          <div className="text-xs font-mono text-slate-500">
            Powered by gemini-3.5-flash & veo models. All rights reserved &copy; 2026.
          </div>

          <div className="flex gap-4 text-xs font-mono text-slate-400">
            <span className="cursor-pointer hover:text-cyan-400" onClick={onStartGenerating}>Studio Console</span>
            <span className="cursor-pointer hover:text-cyan-400" onClick={onViewPricing}>Razorpay Test</span>
            <span className="text-slate-600">v1.2.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
