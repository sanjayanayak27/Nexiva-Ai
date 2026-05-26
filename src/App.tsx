/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Video, Image, Mic, LayoutDashboard, History, 
  Settings, Layers, LogOut, Menu, X, DollarSign, ShieldAlert,
  User, Database, RefreshCw, Key, ShieldCheck
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import DashboardView from './components/DashboardView';
import StudioView from './components/StudioView';
import MyVideosView from './components/MyVideosView';
import PricingView from './components/PricingView';
import SettingsView from './components/SettingsView';
import AdminPanel from './components/AdminPanel';

import { VideoAsset, ImageAsset, VoiceAsset, GenerationHistory, Template } from './types';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Collections fetched from full-stack api
  const [videos, setVideos] = useState<VideoAsset[]>([]);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [voices, setVoices] = useState<VoiceAsset[]>([]);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [revenue, setRevenue] = useState<number>(2450);

  // Modal / Alert triggers
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [remixedPrompt, setRemixedPrompt] = useState<string>('');

  // Fetch initial full-stack data on build/run
  useEffect(() => {
    fetchUserData();
    fetchCollectionsData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        // Keep user logged out on first run until they click authenticate, supporting landing page first flow!
        // We will store default profile model in memory
      }
    } catch (e) {
      console.error("Error retrieving full-stack user session:", e);
    }
  };

  const fetchCollectionsData = async () => {
    setLoadingCollections(true);
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
        setImages(data.images || []);
        setVoices(data.voices || []);
        setHistory(data.history || []);
        setRevenue(data.revenue || 2450);
      }
    } catch (e) {
      console.error("Error syncing collections databases:", e);
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleLoginSuccess = (usr: any) => {
    setUser(usr);
    setShowLogin(false);
    setActiveTab('dashboard');
  };

  const handleLogOut = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' });
    } catch (e) {
      console.error("Logout error", e);
    }
    setUser(null);
    setActiveTab('dashboard');
    setMobileMenuOpen(false);
  };

  // State update actions propagated up from child components
  const handleAssetGenerated = (type: 'video' | 'image' | 'voice', asset: any) => {
    if (type === 'video') {
      setVideos((prev) => [asset, ...prev]);
    } else if (type === 'image') {
      setImages((prev) => [asset, ...prev]);
    } else {
      setVoices((prev) => [asset, ...prev]);
    }
    // Automatically recall to sync collection arrays with Express state in background
    fetchCollectionsData();
  };

  const handleAddHistory = (item: GenerationHistory) => {
    setHistory((prev) => [item, ...prev]);
  };

  const handleDeductCredits = (amount: number) => {
    if (user) {
      setUser((prev: any) => ({
        ...prev,
        credits: Math.max(0, prev.credits - amount)
      }));
    }
  };

  const handleUpgradePlan = (plan: 'free' | 'pro') => {
    if (user) {
      setUser((prev: any) => ({
        ...prev,
        plan,
        credits: plan === 'pro' ? prev.credits + 1000 : prev.credits
      }));
    }
    fetchCollectionsData(); // fetches dynamic revenue increment
  };

  const handleAddCreditsDirectly = (amount: number) => {
    if (user) {
      setUser((prev: any) => ({
        ...prev,
        credits: prev.credits + amount
      }));
    }
    fetchCollectionsData();
  };

  const handleUpdateUserProfile = (name: string, email: string) => {
    if (user) {
      setUser((prev: any) => ({
        ...prev,
        name,
        email
      }));
    }
  };

  const handleDeleteAsset = async (id: string, type: 'video' | 'image' | 'voice') => {
    try {
      const res = await fetch('/api/collections/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type })
      });
      if (res.ok) {
        if (type === 'video') {
          setVideos((prev) => prev.filter((v) => v.id !== id));
        } else if (type === 'image') {
          setImages((prev) => prev.filter((i) => i.id !== id));
        } else {
          setVoices((prev) => prev.filter((vo) => vo.id !== id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditVideo = (videoId: string, updatedParams: Partial<VideoAsset>) => {
    setVideos((prev) => 
      prev.map((v) => (v.id === videoId ? { ...v, ...updatedParams } : v))
    );
  };

  const handleSelectTemplate = (tpl: Template) => {
    setRemixedPrompt(tpl.prompt);
    setActiveTab('studio');
  };

  const handleSelectVideoFromDashboard = (vid: VideoAsset) => {
    // Navigates directly to videos folder for rendering control and trimmer focus!
    setActiveTab('my-videos');
  };

  // Routing sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Overview Cockpit', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'studio', label: 'AI Generative Labs', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'my-videos', label: 'Video Subtitles Editor', icon: <Video className="w-4 h-4" /> },
    { id: 'pricing', label: 'Billing & Razorpay', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'settings', label: 'Profile Security', icon: <Settings className="w-4 h-4" /> },
  ];

  if (user && user.plan === 'pro') {
    // Add admin panel tab on sidebar directly if the user is authorized/Pro tier
    menuItems.push({ id: 'admin', label: 'Admin Command', icon: <ShieldAlert className="w-4 h-4 text-fuchsia-400" /> });
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen relative font-sans selection:bg-cyan-500/30 selection:text-cyan-200 grid-bg">
      
      {/* Dynamic Global layout checks */}
      {!user ? (
        <>
          <LandingPage 
            onStartGenerating={() => setShowLogin(true)}
            onLogin={() => setShowLogin(true)}
            onViewPricing={() => setShowLogin(true)}
            user={user}
          />
          
          <AnimatePresence>
            {showLogin && (
              <LoginModal 
                onClose={() => setShowLogin(false)}
                onSuccess={handleLoginSuccess}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        // Authenticated Full-Stack Interface
        <div className="flex flex-col min-h-screen">
          
          {/* Header Bar */}
          <header className="border-b border-white/5 bg-[#050505]/85 backdrop-blur-md sticky top-0 z-40">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
              
              {/* Logo */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white md:hidden"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg glow-btn flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-black animate-pulse" />
                  </div>
                  <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                    NEXIVA <span className="neon-cyan text-xs tracking-wider font-mono font-medium">STUDIO</span>
                  </span>
                </div>
              </div>

              {/* Status information */}
              <div className="flex items-center gap-4">
                
                {/* Credits indicator badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-xs font-mono">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white/50">CREDITS:</span>
                  <strong className="neon-cyan">{user.credits}</strong>
                </div>

                <div className="h-4 w-px bg-white/15 hidden sm:block" />

                {/* Profile pill dropdown */}
                <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full bg-slate-900 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left leading-none text-xs hidden sm:block">
                    <p className="font-bold text-slate-100">{user.name}</p>
                    <span className="text-[9.5px] font-mono font-semibold uppercase text-purple-400 tracking-wider font-semibold neon-purple">
                      ★ {user.plan} tier
                    </span>
                  </div>
                  <button 
                    onClick={handleLogOut}
                    className="p-1 rounded-full text-white/50 hover:text-red-400 transition-colors ml-1.5"
                    title="Sign Out Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </header>

          {/* Core Sidebar/Content Split Grid */}
          <div className="flex flex-1 relative">
            
            {/* Left Sidebar Static Panel with Glass Theme */}
            <aside className="w-64 border-r border-white/10 flex-col py-6 px-4 gap-6 hidden md:flex text-left relative z-10 glass">
              <span className="text-[9.5px] font-mono text-white/45 uppercase tracking-widest px-3 font-bold block mb-2">
                STUDIO MODULE RAILS
              </span>
              
              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full py-2.5 px-3.5 rounded-r-xl text-xs font-semibold flex items-center gap-3 text-left cursor-pointer ${isActive ? 'sidebar-active-immersive' : 'sidebar-link-immersive text-white/70'}`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 rounded-xl glass text-xs space-y-2">
                <span className="text-[9px] font-mono text-white/40 uppercase block font-bold">Local workspace</span>
                <p className="font-mono text-white/50 text-[10px] break-all leading-tight">NODE: a5334f9b</p>
                <p className="font-mono text-[9px] text-[#00f2ff] flex items-center gap-1 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse inline-block" /> System Online
                </p>
              </div>
            </aside>

            {/* Mobile Navigation overlay drawer */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                  
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    className="relative w-64 h-full p-6 flex flex-col justify-between text-left glass z-50 border-r border-white/10"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <span className="font-extrabold text-white text-sm tracking-widest font-mono">NEXIVA MODULES</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                          const isActive = activeTab === item.id;
                          return (
                            <button 
                              key={item.id}
                              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                              className={`w-full py-2.5 px-3.5 rounded-r-xl text-xs font-semibold flex items-center gap-3 text-left cursor-pointer ${isActive ? 'sidebar-active-immersive' : 'sidebar-link-immersive text-white/70'}`}
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    <div className="p-4 rounded-lg glass text-[10px] space-y-1 text-white/50 font-mono">
                      <p>Credits: {user.credits}</p>
                      <p>Active ID: user_101</p>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Primary content chamber view */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
              {loadingCollections ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Constructing studio libraries...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'dashboard' && (
                      <DashboardView 
                        user={user} 
                        videos={videos} 
                        onNavigate={(tab) => {
                          if (tab === 'pricing') {
                            setActiveTab('pricing');
                          } else {
                            setActiveTab(tab);
                          }
                        }}
                        onSelectVideo={handleSelectVideoFromDashboard}
                        onSelectTemplate={handleSelectTemplate}
                      />
                    )}

                    {activeTab === 'studio' && (
                      <StudioView 
                        user={user}
                        onAssetGenerated={handleAssetGenerated}
                        onDeductCredits={handleDeductCredits}
                        savedHistory={history}
                        onAddHistory={handleAddHistory}
                        remixedPrompt={remixedPrompt}
                        onClearRemix={() => setRemixedPrompt('')}
                      />
                    )}

                    {activeTab === 'my-videos' && (
                      <MyVideosView 
                        videos={videos}
                        onDeleteAsset={handleDeleteAsset}
                        onEditVideo={handleEditVideo}
                      />
                    )}

                    {activeTab === 'pricing' && (
                      <PricingView 
                        user={user}
                        onUpgradePlan={handleUpgradePlan}
                        onAddCredits={handleAddCreditsDirectly}
                        onRefetchUser={fetchCollectionsData} // syncs from server DB
                      />
                    )}

                    {activeTab === 'settings' && (
                      <SettingsView 
                        user={user}
                        onUpdateUser={handleUpdateUserProfile}
                        onNavigate={(tab) => setActiveTab(tab)}
                      />
                    )}

                    {activeTab === 'admin' && (
                      <AdminPanel 
                        videos={videos}
                        images={images}
                        voices={voices}
                        revenue={revenue}
                        user={user}
                        onGrantCredits={(amt) => handleAddCreditsDirectly(amt)}
                        onToggleUserPlan={(pl) => handleUpgradePlan(pl)}
                        onDeleteAsset={handleDeleteAsset}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>

          </div>
        </div>
      )}

    </div>
  );
}
