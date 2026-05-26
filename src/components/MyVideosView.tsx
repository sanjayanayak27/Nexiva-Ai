/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Plus, Music, Layers, Scissors, Video, Check, X, Sparkles, 
  Trash2, Download, Subtitles, HelpCircle, AlertCircle
} from 'lucide-react';
import { VideoAsset } from '../types';

interface MyVideosViewProps {
  videos: VideoAsset[];
  onDeleteAsset: (id: string, type: 'video') => void;
  onEditVideo: (videoId: string, updatedPayload: Partial<VideoAsset>) => void;
}

export default function MyVideosView({ videos, onDeleteAsset, onEditVideo }: MyVideosViewProps) {
  const [selectedVideoToEdit, setSelectedVideoToEdit] = useState<VideoAsset | null>(null);
  const [editorSubtitles, setEditorSubtitles] = useState<string[]>([]);
  const [editorMusic, setEditorMusic] = useState<string>('');
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(10);
  const [savingChanges, setSavingChanges] = useState(false);
  const [subInput, setSubInput] = useState('');
  const [editorToast, setEditorToast] = useState<string | null>(null);

  const showEditorToast = (msg: string) => {
    setEditorToast(msg);
    setTimeout(() => setEditorToast(null), 2500);
  };

  const handleOpenEditor = (vid: VideoAsset) => {
    setSelectedVideoToEdit(vid);
    setEditorSubtitles(vid.subtitles || []);
    setEditorMusic(vid.musicTrack || 'None');
    setTrimStart(0);
    setTrimEnd(vid.duration || 10);
  };

  const handleAddSubtitle = () => {
    if (!subInput.trim()) return;
    setEditorSubtitles([...editorSubtitles, subInput.trim()]);
    setSubInput('');
    showEditorToast("Subtitle line appended.");
  };

  const handleRemoveSubtitle = (idx: number) => {
    setEditorSubtitles(editorSubtitles.filter((_, i) => i !== idx));
  };

  const handleExportCompilation = async () => {
    if (!selectedVideoToEdit) return;
    setSavingChanges(true);

    // Call actual edit endpoint inside /api/collections/video/edit
    try {
      const res = await fetch('/api/collections/video/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedVideoToEdit.id,
          subtitles: editorSubtitles,
          musicTrack: editorMusic,
          trimStart,
          trimEnd,
        })
      });

      const data = await res.json();
      if (data.success && data.video) {
        onEditVideo(selectedVideoToEdit.id, data.video);
        showEditorToast("Video exported and metadata updated successfully!");
        setTimeout(() => {
          setSavingChanges(false);
          setSelectedVideoToEdit(null);
        }, 1200);
      }
    } catch (err) {
      showEditorToast("Error communicating with editor render compiler.");
      setSavingChanges(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            My Creative Video Vault
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse generated MP4 animations and access full subtitle/music layering tools.
          </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass space-y-3">
          <Video className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-sm">Vault is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Generate a high priority video clip inside the Nexiva AI Studio to populate your persistent vault lists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div 
              key={vid.id} 
              className="rounded-xl overflow-hidden glass hover:border-cyan-500/35 transition-all flex flex-col justify-between group"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-video overflow-hidden bg-slate-950 flex items-center justify-center">
                <video 
                  src={vid.src} 
                  poster={vid.thumbnail}
                  controls 
                  preload="metadata"
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-850 text-[10px] font-mono text-cyan-400 font-bold">
                  {vid.duration}s
                </span>
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-850 text-[10px] font-mono text-purple-400 uppercase font-semibold">
                  {vid.aspectRatio}
                </span>
              </div>

              {/* Text Context Description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm leading-snug line-clamp-1 uppercase tracking-tight">{vid.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light font-sans">"{vid.prompt}"</p>
                  
                  {vid.musicTrack && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-fuchsia-400 bg-fuchsia-950/30 px-2 py-0.5 rounded border border-fuchsia-500/20 mt-3">
                      <Music className="w-3 h-3" /> {vid.musicTrack}
                    </span>
                  )}

                  {vid.subtitles && vid.subtitles.length > 0 && (
                    <div className="mt-3 bg-[#050505]/60 p-2 rounded-lg border border-white/10">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Subtitles overlayed ({vid.subtitles.length}):</span>
                      <p className="text-[10px] text-slate-300 font-light truncate">"{vid.subtitles[0]}"</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-5 pt-4 border-t border-slate-950">
                  <button 
                    onClick={() => handleOpenEditor(vid)}
                    className="flex-1 py-1.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/25 walk-effects hover:bg-cyan-500 hover:text-slate-950 transition-colors text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" /> Video Editor
                  </button>

                  <button 
                    onClick={() => onDeleteAsset(vid.id, 'video')}
                    className="p-1.5 rounded bg-slate-950 hover:bg-red-950/30 hover:text-red-400 text-slate-400 border border-slate-850 transition-colors cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded High-Fidelity Video Editor Modal Overlay */}
      <AnimatePresence>
        {selectedVideoToEdit && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => setSelectedVideoToEdit(null)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl glass rounded-2xl overflow-hidden p-6 shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
                    <Scissors className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase font-mono">Nexiva Full Suite Editor</h3>
                    <p className="text-[10px] text-slate-400">Timeline subtitles synchronization & rendering console.</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVideoToEdit(null)} className="p-1 rounded hover:bg-slate-800 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast notifier for editor */}
              {editorToast && (
                <div className="p-2.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-xs font-mono text-cyan-400 text-center uppercase animate-pulse">
                  {editorToast}
                </div>
              )}

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Visual Video Playback & Timings */}
                <div className="space-y-4">
                  <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-805 flex items-center justify-center">
                    <video 
                      src={selectedVideoToEdit.src} 
                      controls 
                      loop
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Live previewed subtitle layer */}
                    {editorSubtitles.length > 0 && (
                      <div className="absolute bottom-5 left-4 right-4 text-center pointer-events-none">
                        <p className="bg-slate-950/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-cyan-500/25 inline-block text-shadow">
                          "{editorSubtitles[0]}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Range trimmer control simulation */}
                  <div className="p-4 rounded-xl bg-[#050505]/75 border border-white/10 space-y-3">
                    <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-widest block">Video Trimming Track</span>
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block">START (s)</span>
                        <input 
                          type="number" 
                          min={0}
                          max={trimEnd - 1}
                          value={trimStart}
                          onChange={(e) => setTrimStart(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-16 bg-slate-900 border border-slate-800 text-cyan-400 text-xs text-center font-mono py-1 rounded"
                        />
                      </div>
                      <div className="flex-1 bg-slate-900 h-1.5 rounded-full relative overflow-hidden mt-4">
                        <div className="absolute bg-cyan-500 h-full rounded-full" style={{ left: '0%', width: '100%' }} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block">END (s)</span>
                        <input 
                          type="number" 
                          min={trimStart + 1}
                          max={selectedVideoToEdit.duration || 15}
                          value={trimEnd}
                          onChange={(e) => setTrimEnd(Math.min(selectedVideoToEdit.duration || 15, parseFloat(e.target.value) || 10))}
                          className="w-16 bg-slate-900 border border-slate-800 text-cyan-400 text-xs text-center font-mono py-1 rounded"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Compiled edited duration target: <strong className="text-slate-350">{Math.max(1, Math.round(trimEnd - trimStart))} seconds</strong></span>
                  </div>
                </div>

                {/* Subtitle edits & music track selector */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Add subtitle layer */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Subtitles editor</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Type script line..."
                          value={subInput}
                          onChange={(e) => setSubInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSubtitle()}
                          className="flex-1 bg-slate-950 border border-slate-850 rounded-lg text-xs p-2 text-slate-200 outline-none focus:border-cyan-500"
                        />
                        <button 
                          onClick={handleAddSubtitle}
                          className="px-3 py-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-xs transition-colors"
                        >
                          Append
                        </button>
                      </div>

                      {/* Subtitle items list */}
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 space-y-2 max-h-[140px] overflow-y-auto">
                        {editorSubtitles.length === 0 ? (
                          <p className="text-[10px] text-slate-500 italic select-none">No custom subtitles created yet.</p>
                        ) : (
                          editorSubtitles.map((sub, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-slate-900">
                              <span className="text-slate-200 line-clamp-1 truncate font-light">"{sub}"</span>
                              <button onClick={() => handleRemoveSubtitle(idx)} className="text-[10px] hover:text-red-400 text-slate-500">✕</button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Change music track overlay */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-2 uppercase">Core Audio Soundtrack Layers</label>
                      <select 
                        value={editorMusic}
                        onChange={(e) => setEditorMusic(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-xs font-mono p-2.5 rounded-lg text-slate-300 outline-none"
                      >
                        <option value="None">None (Keep video silent / original audioOnly)</option>
                        <option value="Cyber Horizon Synthwave">Cyber Horizon Synthwave</option>
                        <option value="Epic Cinematic Orchestration">Epic Cinematic Orchestration</option>
                        <option value="Serene Lofi Study Beat">Serene Lofi Study Beat</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions footer inside modal */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button 
                      onClick={() => setSelectedVideoToEdit(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Dismiss Editor
                    </button>
                    <button 
                      onClick={handleExportCompilation}
                      disabled={savingChanges}
                      className="px-6 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold hover:bg-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      {savingChanges ? "Compiling & Exporting MP4..." : "Export Edited Video"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
