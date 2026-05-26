/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, Image, Mic, Sparkles, Wand2, Copy, History, 
  HelpCircle, Check, ArrowRight, UploadCloud, AlertCircle, Share2, 
  Twitter, Code, HelpCircle as HelpIcon, Play, RefreshCw, X, Download
} from 'lucide-react';
import { VideoAsset, ImageAsset, VoiceAsset, GenerationHistory } from '../types';

interface StudioViewProps {
  user: any;
  onAssetGenerated: (type: 'video' | 'image' | 'voice', asset: any) => void;
  onDeductCredits: (amount: number) => void;
  savedHistory: GenerationHistory[];
  onAddHistory: (item: GenerationHistory) => void;
  remixedPrompt?: string;
  onClearRemix?: () => void;
}

export default function StudioView({ 
  user, onAssetGenerated, onDeductCredits, savedHistory, onAddHistory, remixedPrompt, onClearRemix 
}: StudioViewProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'voice'>('video');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic Video');
  
  // Video-specific states
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<number>(1);
  const [imageReference, setImageReference] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Image-specific states
  const [imageStyle, setImageStyle] = useState<string>('Realistic');

  // Voice-specific states
  const [voiceLanguage, setVoiceLanguage] = useState<'English' | 'Hindi'>('English');
  const [voiceName, setVoiceName] = useState<string>('Arthur (Deep British Male Pro)');
  const [backgroundMusic, setBackgroundMusic] = useState<string>('Lofi Ambient Beat');

  // Platform auxiliary states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [promptEnhancing, setPromptEnhancing] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [generatedSuccessfully, setGeneratedSuccessfully] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listening to template remixes
  useEffect(() => {
    if (remixedPrompt) {
      setPrompt(remixedPrompt);
      if (onClearRemix) onClearRemix();
    }
  }, [remixedPrompt]);

  // Load prompt suggestions on load
  useEffect(() => {
    fetchSuggestions();
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const res = await fetch('/api/generate/suggestions');
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Drag and Drop simulation handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageReference(event.target.result as string);
          showToast("Starting Image referenced correctly.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageReference(event.target.result as string);
          showToast("Starting Image uploaded.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Enhance prompt calling serverless API proxy using Gemini
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      showToast("Write a simple phrase first!");
      return;
    }
    setPromptEnhancing(true);
    try {
      const res = await fetch('/api/generate/prompt-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode: activeTab,
          style: activeTab === 'video' ? style : imageStyle,
        })
      });
      const data = await res.json();
      if (data.success && data.enhanced) {
        setPrompt(data.enhanced);
        showToast("Cinematic variables injected via Gemini!");
      }
    } catch (error) {
      showToast("Failed to communicate with AI prompter.");
    } finally {
      setPromptEnhancing(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    showToast("Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Sequential loading simulation labels
  const videoSteps = [
    "Contacting Nexiva tensor nodes...",
    "Injecting Google Gemini enhanced descriptors...",
    "Synthesizing latent 3D fluid vectors...",
    "Reconstructing photorealistic lighting textures...",
    "Baking custom ambient synth track harmonics...",
    "Generating auto-tuned lip synchronization...",
    "Compiling final H.264 high-fidelity MP4 bundle..."
  ];

  const imageSteps = [
    "Initializing digital canvas diffusion layers...",
    "Resolving style matrix coordinates...",
    "Unbluring neural canvas checkpoints...",
    "Injecting HDR cinematic color curves...",
    "Exporting raw 1024x1024 image stream..."
  ];

  const voiceSteps = [
    "Analyzing semantic phonetic pacing...",
    "Synthesizing customized human-sounding syllabics...",
    "Mixing high-pass background audio layers...",
    "Generating auto-sync subtitle marks...",
    "Rendering 24,000Hz master wave clip..."
  ];

  const currentSteps = activeTab === 'video' ? videoSteps : activeTab === 'image' ? imageSteps : voiceSteps;

  // Real-time Loading Animation Step cycler
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % currentSteps.length);
      }, 1400);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [loading, currentSteps]);

  // Core generator submission handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast("A detailed description prompt is required!");
      return;
    }

    const videoCredits = 15;
    const imageCredits = 5;
    const voiceCredits = 2;
    const currentCost = activeTab === 'video' ? (videoCredits * duration) : activeTab === 'image' ? imageCredits : voiceCredits;

    // Credits check disabled - Unlimited free generations active!
    // if (user.credits < currentCost) {
    //   showToast(`Insufficient balance! This action costs ${currentCost} credits.`);
    //   return;
    // }

    setLoading(true);
    setGeneratedSuccessfully(null);

    // Call dynamic backend endpoints
    try {
      const endpoint = `/api/generate/${activeTab}`;
      const payload = activeTab === 'video' ? {
        prompt,
        style,
        duration,
        aspectRatio,
        imagePrefix: imageReference ? "referenced-image" : null
      } : activeTab === 'image' ? {
        prompt,
        style: imageStyle
      } : {
        text: prompt,
        language: voiceLanguage,
        voiceName,
        bgMusic: backgroundMusic
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Generation error.");
        setLoading(false);
        return;
      }

      // Complete generator mockup loader delay
      setTimeout(() => {
        setLoading(false);
        if (data.success) {
          if (activeTab === 'video') {
            onAssetGenerated('video', data.video);
            setGeneratedSuccessfully({ ...data.video, type: 'video' });
          } else if (activeTab === 'image') {
            onAssetGenerated('image', data.image);
            setGeneratedSuccessfully({ ...data.image, type: 'image' });
          } else {
            onAssetGenerated('voice', data.voice);
            setGeneratedSuccessfully({ ...data.voice, type: 'voice' });
          }
          // Deduct credits disabled - completely free!
          onDeductCredits(0);
          onAddHistory({
            id: "hist_" + Math.random().toString(36).substr(2, 9),
            type: activeTab,
            prompt: prompt,
            status: "success",
            createdAt: new Date().toISOString()
          });
          showToast("AI generation synthesized successfully!");
        }
      }, 7000); // 7 seconds immersive full-stack loader
    } catch (err) {
      showToast("Communication with generation nodes severed.");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left relative">
      {/* Toast Alert popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-xl flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Configuration Form Column - col-span-8 */}
      <div className="lg:col-span-8 space-y-6">
        {/* Core Generator Selection Tab Rails */}
        <div className="flex rounded-xl glass p-1">
          <button 
            onClick={() => { setActiveTab('video'); setPrompt(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'video' ? 'bg-cyan-500/10 text-cyan-400 font-bold border-b border-cyan-500/35' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Video className="w-4 h-4" /> Text/Image to Video <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-400">15 Crd</span>
          </button>
          <button 
            onClick={() => { setActiveTab('image'); setPrompt(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'image' ? 'bg-purple-500/10 text-purple-400 font-bold border-b border-purple-500/35' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Image className="w-4 h-4" /> Cinematic Diffusion <span className="text-[9px] font-mono px-1 rounded bg-purple-950 text-purple-400">5 Crd</span>
          </button>
          <button 
            onClick={() => { setActiveTab('voice'); setPrompt(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'voice' ? 'bg-fuchsia-500/10 text-fuchsia-400 font-bold border-b border-fuchsia-500/35' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Mic className="w-4 h-4" /> AI Voice Generator <span className="text-[9px] font-mono px-1 rounded bg-fuchsia-950 text-fuchsia-400">2 Crd</span>
          </button>
        </div>

        {/* Input Formulation Area */}
        <div className="p-6 rounded-2xl glass space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              {activeTab === 'video' ? 'Describe Video Scene' : activeTab === 'image' ? 'Describe Cinematic Image' : 'Input Audio Narration Script'}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleEnhancePrompt} 
                disabled={promptEnhancing || !prompt}
                className="px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Wand2 className="w-3.5 h-3.5" /> {promptEnhancing ? "Enhancing via Gemini..." : "Gemini Enhance"}
              </button>
              <button 
                onClick={handleCopyPrompt} 
                disabled={!prompt}
                className="p-1 px-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 text-xs"
                title="Copy Prompt"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              activeTab === 'video' ? "e.g. A cybernetic dragon taking flight from a crystal volcanic lake under ambient blue nebulas, realistic 8K, depth of field..." :
              activeTab === 'image' ? "e.g. Golden futuristic space station viewing port looking down onto tropical clouds on Mars, detailed 3D render..." :
              "e.g. Welcome to Nexiva AI Studio. Where artificial generation unlocks full cinematic trailer pipelines. (Script for English or Hindi voices)"
            }
            className="w-full min-h-[120px] bg-slate-950 border border-slate-850 focus:border-cyan-500 rounded-xl p-4 text-sm font-sans outline-none text-slate-200 resize-y leading-relaxed"
          />

          {/* AI Prompt suggestions lists */}
          {suggestions.length > 0 && (
            <div className="pt-2">
              <span className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wide block mb-2">Smart suggestions:</span>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((sug, i) => (
                  <button 
                    key={i}
                    onClick={() => { setPrompt(sug); showToast("Selected prompt suggestion!"); }}
                    className="text-[10px] text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-850 border border-slate-855 px-2.5 py-1 rounded transition-colors text-left max-w-full truncate"
                  >
                    💡 {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab-driven visual parameter controls */}
        {activeTab === 'video' && (
          <div className="p-6 rounded-2xl glass space-y-6">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Technical Camera Specs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image to Video Upload Zone */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 mb-2 uppercase">Image Baseline (Optional)</label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors flex flex-col items-center justify-center min-h-[120px] ${dragActive ? 'border-cyan-500 bg-cyan-950/15' : imageReference ? 'border-purple-500/55 bg-purple-950/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}`}
                >
                  {imageReference ? (
                    <div className="relative w-full h-24 rounded overflow-hidden">
                      <img src={imageReference} alt="Ref Uploaded" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImageReference(null)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-950 border border-slate-850 hover:text-red-400 text-slate-400"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-[11px] text-slate-400">Drag static photo or click to explore files</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                        className="hidden" 
                        id="studio-file-upload" 
                      />
                      <label 
                        htmlFor="studio-file-upload" 
                        className="mt-2 text-[10px] font-mono font-bold px-2 py-1 rounded border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Aspect Ratio & Style selector presets */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-2 uppercase">Aspect Framing</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all ${aspectRatio === '16:9' ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' : 'border-slate-850 hover:border-slate-800 text-slate-400'}`}
                    >
                      📺 16:9 Landscape
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all ${aspectRatio === '9:16' ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' : 'border-slate-850 hover:border-slate-800 text-slate-400'}`}
                    >
                      📱 9:16 Portrait
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-2 uppercase text-[#00f2ff]">Video Duration</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 text-xs font-mono p-2.5 rounded-lg text-slate-300 outline-none focus:border-cyan-500"
                  >
                    <option value={1}>⏱ 1 Minute Video (lite)</option>
                    <option value={2}>⏱ 2 Minutes Video</option>
                    <option value={3}>⏱ 3 Minutes Video</option>
                    <option value={5}>⏱ 5 Minutes Video (standard)</option>
                    <option value={7}>⏱ 7 Minutes Video (max length)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 mb-2 uppercase text-[#00f2ff]">Video Style Preset</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Realistic Video', name: '🎥 Realistic', icon: '🎥' },
                      { id: '2D Animation', name: '🎨 2D Anime', icon: '🎨' },
                      { id: '3D Animation', name: '🧊 3D Pixar', icon: '🧊' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStyle(item.id)}
                        className={`py-2.5 px-1 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${style === item.id ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400 font-extrabold' : 'border-slate-850 hover:border-slate-800 text-slate-400'}`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-[10px] whitespace-nowrap">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="p-6 rounded-2xl glass space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Image Diffusion Styles</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['Realistic', 'Anime', 'Pixar', 'Cartoon', '3D Render'].map((st) => (
                <button 
                  key={st}
                  type="button"
                  onClick={() => setImageStyle(st)}
                  className={`py-2 px-3 text-xs font-mono rounded-lg border transition-all ${imageStyle === st ? 'border-purple-500 bg-purple-950/20 text-purple-400 font-bold' : 'border-slate-850 text-slate-400'}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="p-6 rounded-2xl glass space-y-6">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Synthesizer Harmonics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Language Accent</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setVoiceLanguage('English'); setVoiceName('Arthur (Deep British Male Pro)'); }}
                    className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all ${voiceLanguage === 'English' ? 'border-fuchsia-500 bg-fuchsia-950/25 text-fuchsia-350' : 'border-slate-805 text-slate-400'}`}
                  >
                    🇺🇸 English Accent
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setVoiceLanguage('Hindi'); setVoiceName('Aarav (Warm Indian Male Pro)'); }}
                    className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all ${voiceLanguage === 'Hindi' ? 'border-fuchsia-500 bg-fuchsia-950/25 text-fuchsia-350' : 'border-slate-805 text-slate-400'}`}
                  >
                    🇮🇳 Hindi Accent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase text-[#f73bc0]">Prebuilt Voice Character</label>
                <select 
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs font-mono text-slate-300 outline-none"
                >
                  {voiceLanguage === 'English' ? (
                    <>
                      <option value="Arthur (Deep British Male Pro)">🎙️ Arthur (Deep British Male Pro)</option>
                      <option value="Emily (Soft American Female Pro)">🎙️ Emily (Soft American Female Pro)</option>
                      <option value="Marcus (Energetic Podcast Male)">🎙️ Marcus (Energetic Podcast Male)</option>
                      <option value="Isabella (Polished Corporate Female)">🎙️ Isabella (Polished Corporate Female)</option>
                    </>
                  ) : (
                    <>
                      <option value="Aarav (Warm Indian Male Pro)">🎙️ Aarav (Warm Indian Male Pro)</option>
                      <option value="Ananya (Sweet Indian Female Pro)">🎙️ Ananya (Sweet Indian Female Pro)</option>
                      <option value="Kabir (Rich Baritone Male)">🎙️ Kabir (Rich Baritone Male)</option>
                      <option value="Diya (Clear Broadcast Female)">🎙️ Diya (Clear Broadcast Female)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Background Music Track</label>
                <select 
                  value={backgroundMusic}
                  onChange={(e) => setBackgroundMusic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs font-mono text-slate-100 outline-none"
                >
                  <option value="None">None (Silent background)</option>
                  <option value="Lofi Ambient Beat">Lofi Ambient Beat</option>
                  <option value="Cyber Horizon Synthwave">Cyber Horizon Synthwave</option>
                  <option value="Epic Cinematic Orchestration">Epic Cinematic Orchestration</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Generate submission row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl gradient-border">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>🔥 <strong className="text-cyan-400">Unlimited FREE Generation Active</strong> — No Credit Deductions! (Asset: {activeTab === 'video' ? 'Video' : activeTab === 'image' ? 'Image' : 'Voice'})</span>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl glow-btn text-black text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            {loading ? "Synthesizing Canvas..." : "Generate AI Asset"}
          </button>
        </div>
      </div>

      {/* Production Preview & Prompt History Column - col-span-4 */}
      <div className="lg:col-span-4 space-y-6">
        {/* Real-time Loading Animation Simulator Console */}
        <div className="p-5 rounded-2xl glass text-left relative overflow-hidden">
          <h3 className="text-xs font-mono font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>LIVE PRODUCTION OUTBOX</span>
            {loading && <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-400 font-bold uppercase animate-pulse">PROCESSING</span>}
          </h3>

          <div className="min-h-[220px] rounded-xl bg-[#050505]/80 border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loader-active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative mx-auto w-12 h-12">
                    <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{currentSteps[loadingStep]}</h4>
                    <p className="text-[10px] text-slate-500 mt-2">Connecting cloud graphics servers, estimated wait time 7.0s</p>
                  </div>
                </motion.div>
              ) : generatedSuccessfully ? (
                <motion.div 
                  key="generation-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-3.5"
                >
                  <div className="w-full h-32 rounded-lg border border-white/15 bg-slate-950/80 overflow-hidden relative flex items-center justify-center">
                    {generatedSuccessfully.type === 'video' ? (
                      <video 
                        src={generatedSuccessfully.src} 
                        poster={generatedSuccessfully.thumbnail}
                        controls 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : generatedSuccessfully.type === 'image' ? (
                      <img 
                        src={generatedSuccessfully.src} 
                        alt="Asset" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="p-4 flex flex-col items-center justify-center gap-2">
                        <Sparkles className="w-8 h-8 text-fuchsia-400 animate-bounce" />
                        <span className="text-[10px] font-mono text-slate-300">WAV Voice synthesis finalized.</span>
                        <span className="text-[9px] text-fuchsia-400 bg-fuchsia-950/40 px-2 py-0.5 rounded font-mono">{generatedSuccessfully.voiceName}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-[9px] font-mono text-emerald-400 block font-bold">✓ ASSET READY</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5 uppercase">{generatedSuccessfully.title || "AI Diffusion file"}</h4>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed mt-1 font-light italic">"{generatedSuccessfully.prompt}"</p>
                  </div>

                  {/* Intersecting action buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-900">
                    <a 
                      href={generatedSuccessfully.src || generatedSuccessfully.audioSrc || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-semibold flex items-center justify-center gap-1 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                    
                    <button 
                      onClick={() => showToast("Simulated Share URL copied!")}
                      className="px-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      title="Share to social"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-2 select-none">
                  <Wand2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Your generated asset will preview directly inside this box.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Prompt History list */}
        <div className="p-5 rounded-2xl glass">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <History className="w-4 h-4 text-cyan-400" /> GENERATION HISTORIES
          </h3>

          {savedHistory.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center select-none">No previous generations recorded in this session.</p>
          ) : (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {savedHistory.slice(0, 5).map((hist) => (
                <div 
                  key={hist.id} 
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 flex justify-between items-start gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className={`text-[8.5px] font-mono font-bold uppercase ${hist.type === 'video' ? 'text-cyan-400' : hist.type === 'image' ? 'text-purple-400' : 'text-fuchsia-400'}`}>
                      {hist.type}
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-tight font-light italic">"{hist.prompt}"</p>
                  </div>
                  
                  <button 
                    onClick={() => { setPrompt(hist.prompt); showToast("Recalled prompt from logs!"); }}
                    className="text-[9.5px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
