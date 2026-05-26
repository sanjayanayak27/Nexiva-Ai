/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini safely, preserving server startup if the key is empty
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

function getAiClient() {
  if (!aiClient) {
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Successfully initialized GoogleGenAI with API Key.");
      } catch (e) {
        console.error("Error parsing GoogleGenAI API key:", e);
      }
    }
  }
  return aiClient;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Persistent In-Memory State
interface ServerState {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    plan: 'free' | 'pro';
    credits: number;
  };
  videos: any[];
  images: any[];
  voices: any[];
  history: any[];
  revenue: number;
}

const state: ServerState = {
  user: {
    id: "usr_nexiva_101",
    name: "Sanjay Nayak",
    email: "sanjaynayakbabu2001@gmail.com",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
    plan: "free",
    credits: 120,
  },
  videos: [
    {
      id: "vid_1",
      title: "Cyberpunk Tokyo Rain",
      prompt: "A neon-soaked cyberpunk Tokyo street with slick reflection puddles, high-speed flying cars drifting between digital holographic skyscrapers, photorealistic 8k, cinematic lighting",
      src: "https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-futuristic-cyberpunk-city-43110-large.mp4",
      thumbnail: "https://picsum.photos/seed/cyberrain/640/360",
      duration: 1, // 1 minute
      style: "Realistic Sci-Fi",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      aspectRatio: "16:9",
      subtitles: ["Welcome to Tokyo 2099", "Where rain washes away nothing", "Dynamic holograms illuminating the slick roads."],
      musicTrack: "Neo-Synth Horizon",
    },
    {
      id: "vid_2",
      title: "Ancient Portal Awakening",
      prompt: "A massive mechanical gate made of gold and emerald stone activation inside a jungle, glowing blue energy beam shooting into the cloudy cosmic sky, Pixar 3D style",
      src: "https://assets.mixkit.co/videos/preview/mixkit-animation-of-a-golden-energy-sphere-in-dark-ambient-48590-large.mp4",
      thumbnail: "https://picsum.photos/seed/portal/640/360",
      duration: 2, // 2 minutes
      style: "3D Animation",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      aspectRatio: "16:9",
      subtitles: ["The lock engages...", "Ancient structures hum with pure starlight energy", "The vortex is stable."],
      musicTrack: "Ethereal Dreamscape",
    },
  ],
  images: [
    {
      id: "img_1",
      prompt: "Mech warrior inspecting a futuristic bonsai tree in a digital glass greenhouse, raytracing neon light",
      style: "Scientific 3D",
      src: "https://picsum.photos/seed/mecha/1024/1024",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "img_2",
      prompt: "Astronaut cozy reading a paper book near an open screen window looking at Jupiter, detailed oil painting",
      style: "Cinematic",
      src: "https://picsum.photos/seed/astro/1024/1024",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ],
  voices: [
    {
      id: "voc_1",
      text: "Nexiva AI transforms your wildest imaginations into full high-fidelity cinema clips with just one text input.",
      language: "English",
      voiceName: "Zephyr (Male Pro)",
      bgMusic: "Lofi Ambient Beat",
      duration: 10,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
  ],
  history: [
    {
      id: "hist_1",
      type: "video",
      prompt: "Cyberpunk Tokyo Rain",
      status: "success",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: "hist_2",
      type: "image",
      prompt: "Mech warrior inspecting a futuristic bonsai tree",
      status: "success",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    }
  ],
  revenue: 2450, // simulated revenue in dollars
};

// Simple User Registry to support Login and Registration properly on the backend
const usersRegistry = new Map<string, any>();
usersRegistry.set("sanjaynayakbabu2001@gmail.com", {
  id: "usr_nexiva_101",
  name: "Sanjay Nayak",
  email: "sanjaynayakbabu2001@gmail.com",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
  plan: "free",
  credits: 120,
  password: "password123",
});

// ==================== API ENDPOINTS ====================

// GET: Current user profile
app.get("/api/user", (req, res) => {
  res.json(state.user);
});

// POST: Register User Account
app.post("/api/user/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Name, email and security key are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (usersRegistry.has(normalizedEmail)) {
    return res.status(400).json({ error: "Account credentials with this email already exist" });
  }

  const newUser = {
    id: "usr_" + Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    email: normalizedEmail,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
    plan: "free",
    credits: 250, // bonus starting credits so they can make high-minute videos!
    password: password,
  };

  usersRegistry.set(normalizedEmail, newUser);
  state.user = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    plan: newUser.plan as any,
    credits: newUser.credits,
  };

  res.json({ success: true, user: state.user });
});

// POST: Login User Account
app.post("/api/user/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const registeredUser = usersRegistry.get(normalizedEmail);

  if (!registeredUser || registeredUser.password !== password) {
    return res.status(401).json({ error: "Invalid email or security key credentials" });
  }

  state.user = {
    id: registeredUser.id,
    name: registeredUser.name,
    email: registeredUser.email,
    avatar: registeredUser.avatar,
    plan: registeredUser.plan,
    credits: registeredUser.credits,
  };

  res.json({ success: true, user: state.user });
});

// POST: Logout Session
app.post("/api/user/logout", (req, res) => {
  // Reset active session state back to standard template state
  state.user = {
    id: "usr_nexiva_101",
    name: "Sanjay Nayak",
    email: "sanjaynayakbabu2001@gmail.com",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
    plan: "free",
    credits: 120,
  };
  res.json({ success: true });
});

// POST: Update user info (profile)
app.post("/api/user/update", (req, res) => {
  const { name, email } = req.body;
  if (name) state.user.name = name;
  if (email) state.user.email = email;
  res.json({ success: true, user: state.user });
});

// POST: Adjust credits or Upgrade plan (simulated subscription)
app.post("/api/user/credits", (req, res) => {
  const { amount, action, plan } = req.body;
  
  if (action === "buy") {
    state.user.credits += amount || 100;
    state.revenue += (amount || 100) * 0.15; // 0.15 USD per credit
  } else if (action === "upgrade") {
    state.user.plan = plan || "pro";
    state.user.credits += 1000; // bonus credits on upgrade
    state.revenue += 29.00; // standard Pro subscription cost
  } else if (action === "deduct") {
    state.user.credits = Math.max(0, state.user.credits - (amount || 10));
  }
  
  res.json({ success: true, user: state.user, totalRevenue: state.revenue });
});

// GET: Collections (Videos, Images, Voices, History)
app.get("/api/collections", (req, res) => {
  res.json({
    videos: state.videos,
    images: state.images,
    voices: state.voices,
    history: state.history,
    revenue: state.revenue,
  });
});

// POST: AI Prompt Suggestions/Enhance using Gemini
app.post("/api/generate/prompt-enhance", async (req, res) => {
  const { prompt, mode, style } = req.body;
  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt cannot be empty" });
  }

  const client = getAiClient();
  if (client) {
    try {
      const systemInstruction = `You are Nexiva AI Prompt Engineer.
      Your task is to expand the user's short prompt into a premium, cinematic prompt for AI generation.
      Depending on the generation mode (video, image, or voice), produce an optimized formulation that includes detailed sensory inputs: lighting (e.g., golden hour, cyberpunk neon, volumetrics), framing (e.g., macro detail, extreme wide, anamorphic), mood (hyper-futuristic, rustic gothic, organic synthwave), and composition specs.
      Provide ONLY the enhanced prompt string. Bold keywords or keep it highly descriptive, and make it around 30 to 60 words. No chat metadata or extra friendly chatter, just the final formatted prompt.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Mode: ${mode || "video"}. Style Target: ${style || "cinematic"}. Prompt to enhance: "${prompt}"`,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      const text = response.text || "";
      return res.json({ success: true, enhanced: text.trim() });
    } catch (error: any) {
      console.error("Gemini prompt enhancement failed:", error);
      // fallback to custom local enhancer if API fails
    }
  }

  // Fallback engine if Gemini API Key is missing or failed
  const fallbacks: Record<string, string[]> = {
    cyberpunk: ["embedded in slick glassmorphism streets", "luminescent neon refraction in puddles", "octane render, hyperrealistic 8k details"],
    anime: ["vivid dreamy pastel cloud canvas", "Makoto Shinkai stunning lighting aesthetic", "glistening hand-drawn details with nostalgic lens flares"],
    realistic: ["shot on Hasselblad 100MP, cinematic volumetrics", "natural soft side-shadowing", "masterpiece hyper-resolution texture rendering"],
    pixar: ["warm digital clay 3D render", "playful character depth of field", "vibrant rich material textures with cute bounce lighting"],
  };

  const selectedStyles = fallbacks[style as string] || fallbacks.realistic;
  const enhanced = `${prompt}, ${selectedStyles.join(", ")}, ultra-detailed, futuristic production aesthetic.`;
  res.json({ success: true, enhanced, note: "Generated using Nexiva's local enhancement model (Gemini fallback)." });
});

// POST: AI Tool suggestion lists (Dynamic triggers)
app.get("/api/generate/suggestions", async (req, res) => {
  const client = getAiClient();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a JSON array of 4 short cinematic creative prompts for an AI video of the future. The output should be raw JSON ONLY, inside an array like: ["prompt 1", "prompt 2", "prompt 3", "prompt 4"].`,
        config: {
          responseMimeType: "application/json",
        },
      });
      const data = JSON.parse(response.text || "[]");
      return res.json({ success: true, suggestions: data });
    } catch (e) {
      // fallback handled below
    }
  }

  const defaultSuggestions = [
    "A majestic chrome eagle taking off from an abandoned high-tech neon observatory, synthwave retro aesthetic",
    "Liquid metallic rose slowly blooming in zero gravity, reflections of ambient purple nebulae, ultra high definition",
    "Steaming ramen shop under a futuristic Tokyo flyover route, holographic menu floating, volumetric warm steam",
    "A cozy wooden cabin inside a giant space bio-dome, viewing planet Saturn rising behind digital mountain range"
  ];
  res.json({ success: true, suggestions: defaultSuggestions });
});

// POST: Generate simulated video
app.post("/api/generate/video", (req, res) => {
  const { prompt, style, duration, aspectRatio, imagePrefix } = req.body;
  
  // Calculate cost based on duration minutes selected (range 1-7). Default to 1 if empty or legacy 8s.
  const videoMinutes = typeof duration === 'number' && duration <= 7 ? Math.max(1, duration) : 1;
  const cost = 15 * videoMinutes;

  // Credits check disabled - Unlimited free generation active!
  // if (state.user.credits < cost) {
  //   return res.status(400).json({ error: `Insufficient credits for video generation. This video requires ${cost} credits.` });
  // }

  // Deduct credits disabled - Unlimited free generation active!
  // state.user.credits -= cost;

  // Simulate a list of stunning sample video tracks to keep preview experience super rich!
  const videoPool = [
    "https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-futuristic-cyberpunk-city-43110-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-background-47402-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-rotating-world-globe-made-of-glowing-polygons-49033-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-futuristic-urban-street-view-at-night-with-digital-lights-51980-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-animation-of-a-golden-energy-sphere-in-dark-ambient-48590-large.mp4"
  ];

  const randomVideo = videoPool[Math.floor(Math.random() * videoPool.length)];
  const isImageToVideo = !!imagePrefix;
  const videoId = "vid_" + Math.random().toString(36).substr(2, 9);
  
  const subtitles = isImageToVideo ? [
    `Transforming reference frame...`,
    `Animating static texture lines.`,
    `Cinematic scale synthesis complete!`
  ] : [
    `Synthesized: ${prompt.slice(0, 25)}...`,
    `Fluid dynamics loaded beautifully.`,
    `Exporting final masterpiece.`
  ];

  const newVideo = {
    id: videoId,
    title: isImageToVideo ? "Animated Concept Shot" : (prompt.split(" ").slice(0, 4).join(" ") || "AI Video"),
    prompt: prompt,
    src: randomVideo,
    thumbnail: `https://picsum.photos/seed/${videoId}/640/360`,
    duration: videoMinutes,
    style: style || "Realistic Sci-Fi",
    createdAt: new Date().toISOString(),
    aspectRatio: aspectRatio || "16:9",
    subtitles,
    musicTrack: "Default Dynamic Synths",
  };

  state.videos.unshift(newVideo);
  state.history.unshift({
    id: "hist_" + videoId,
    type: "video",
    prompt: prompt,
    status: "success",
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, video: newVideo, creditsLeft: state.user.credits });
});

// POST: Generate simulated image
app.post("/api/generate/image", (req, res) => {
  const { prompt, style } = req.body;

  // Credits check disabled - Unlimited free generation active!
  // if (state.user.credits < 5) {
  //   return res.status(400).json({ error: "Insufficient credits for image generation. Image requires 5 credits." });
  // }

  // Deduct disabled - Unlimited free generation active!
  // state.user.credits -= 5;

  const imgId = "img_" + Math.random().toString(36).substr(2, 9);
  const newImage = {
    id: imgId,
    prompt: prompt,
    style: style || "Cinematic",
    src: `https://picsum.photos/seed/${imgId}/1024/1024`,
    createdAt: new Date().toISOString(),
  };

  state.images.unshift(newImage);
  state.history.unshift({
    id: "hist_" + imgId,
    type: "image",
    prompt: prompt,
    status: "success",
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, image: newImage, creditsLeft: state.user.credits });
});

// POST: Generate simulated voice
app.post("/api/generate/voice", (req, res) => {
  const { text, language, voiceName, bgMusic } = req.body;

  // Credits check disabled - Unlimited free generation active!
  // if (state.user.credits < 2) {
  //   return res.status(400).json({ error: "Insufficient credits for voice generation. Voice requires 2 credits." });
  // }

  // Deduct disabled - Unlimited free generation active!
  // state.user.credits -= 2;

  const vocId = "voc_" + Math.random().toString(36).substr(2, 9);
  const newVoice = {
    id: vocId,
    text: text,
    language: language || "English",
    voiceName: voiceName || "Puck Pro Voice",
    bgMusic: bgMusic || "None",
    duration: Math.ceil(text.split(" ").length * 0.4),
    createdAt: new Date().toISOString(),
  };

  state.voices.unshift(newVoice);
  state.history.unshift({
    id: "hist_" + vocId,
    type: "voice",
    prompt: text.slice(0, 50),
    status: "success",
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, voice: newVoice, creditsLeft: state.user.credits });
});

// PUT: Modify subtitles, music, or trim videos
app.post("/api/collections/video/edit", (req, res) => {
  const { videoId, subtitles, musicTrack, trimStart, trimEnd } = req.body;
  const videoIndex = state.videos.findIndex((v) => v.id === videoId);
  
  if (videoIndex === -1) {
    return res.status(404).json({ error: "Video asset not found." });
  }

  if (subtitles) state.videos[videoIndex].subtitles = subtitles;
  if (musicTrack) state.videos[videoIndex].musicTrack = musicTrack;
  if (trimStart !== undefined && trimEnd !== undefined) {
    state.videos[videoIndex].duration = Math.max(1, Math.round(trimEnd - trimStart));
  }

  res.json({ success: true, video: state.videos[videoIndex] });
});

// DELETE: Delete user assets from collection (Admin or user action)
app.post("/api/collections/delete", (req, res) => {
  const { id, type } = req.body;
  if (type === "video") {
    state.videos = state.videos.filter((v) => v.id !== id);
  } else if (type === "image") {
    state.images = state.images.filter((i) => i.id !== id);
  } else if (type === "voice") {
    state.voices = state.voices.filter((s) => s.id !== id);
  }
  res.json({ success: true });
});


// ==================== ASSET SERVING & VITE MIDDLEWARE ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexiva AI Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
