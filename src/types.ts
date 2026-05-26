/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro';
  credits: number;
}

export interface VideoAsset {
  id: string;
  title: string;
  prompt: string;
  src: string; // url or placeholder
  thumbnail: string;
  duration: number; // in seconds
  style?: string;
  lyrics?: string;
  subtitles?: string[];
  musicTrack?: string;
  createdAt: string;
  aspectRatio: '16:9' | '9:16';
}

export interface ImageAsset {
  id: string;
  prompt: string;
  style: string;
  src: string;
  createdAt: string;
}

export interface VoiceAsset {
  id: string;
  text: string;
  language: 'English' | 'English (British)' | 'Hindi' | 'Spanish' | 'Japanese';
  voiceName: string;
  bgMusic: string;
  duration: number;
  audioSrc: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  prompt: string;
  style: string;
}

export interface GenerationHistory {
  id: string;
  type: 'video' | 'image' | 'voice';
  prompt: string;
  status: 'pending' | 'success' | 'failed';
  resultUrl?: string;
  createdAt: string;
}
