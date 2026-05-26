/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Sparkles, AlertCircle, ShoppingCart, UserCheck, 
  ChevronRight, BadgePercent, Lock, Globe, RefreshCw, Star, X
} from 'lucide-react';

interface PricingViewProps {
  user: any;
  onUpgradePlan: (plan: 'free' | 'pro') => void;
  onAddCredits: (amount: number) => void;
  onRefetchUser: () => void;
}

export default function PricingView({ user, onUpgradePlan, onAddCredits, onRefetchUser }: PricingViewProps) {
  const [selectedPack, setSelectedPack] = useState<{ name: string; credits: number; price: number } | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'success' | 'canceled' | null>(null);
  const [razorpayOrderName, setRazorpayOrderName] = useState('');

  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      caption: "Excellent for trying out basic video framing capabilities.",
      credits: "120 credits welcome grant",
      features: [
        "Standard priority synthesis queues",
        "Generate 16:9 and 1:1 aspect ratios",
        "Custom subtitle editing controls",
        "Support standard English models"
      ],
      type: "free"
    },
    {
      name: "Pro Creator",
      price: "$29",
      caption: "Unlimited potential. Absolute best for creators and designers.",
      credits: "1000 monthly credits grant",
      features: [
        "High priority tensor node processing",
        "Full support for vertical 9:16 and custom formats",
        "Cinematic Gemini prompt expander integration",
        "High pitch premium English and Hindi speech",
        "Ad-free render editor exports",
        "Access full Admin metrics & analytics dashboard"
      ],
      type: "pro"
    }
  ];

  const creditBundles = [
    { name: "Mini Spark Bundle", credits: 100, price: 14.99, description: "Great for quick project previews." },
    { name: "Nebula Creator Pack", credits: 500, price: 59.99, description: "Generous credits for mid-tier cartoon projects." },
    { name: "Infinite Galaxy Vault", credits: 1000, price: 99.99, description: "Uninhibited premium 4K render sequences." }
  ];

  // Initializing simulated Razorpay checkout screen
  const handleTriggerRazorpay = (bundle: { name: string; credits: number; price: number }) => {
    setSelectedPack(bundle);
    setPaymentStep('checkout');
    setRazorpayOrderName(`ORD_NEXIVA_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  };

  const handleLaunchProUpgradeRazorpay = () => {
    setSelectedPack({
      name: "Pro Creator Membership Upgrade",
      credits: 1000, // awards bonus credits on upgrade
      price: 29.00
    });
    setPaymentStep('checkout');
    setRazorpayOrderName(`ORD_PRO_NEXIVA_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!selectedPack) return;
    setProcessingPayment(true);
    
    // Simulate API calls back to full-stack Express server to update live state!
    try {
      const isSubscription = selectedPack.name.includes("Membership");
      const res = await fetch('/api/user/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPack.credits,
          action: isSubscription ? 'upgrade' : 'buy',
          plan: 'pro'
        })
      });

      const data = await res.json();
      if (data.success) {
        // success! Update React parent states
        setTimeout(() => {
          setProcessingPayment(false);
          setPaymentStep('success');
          if (isSubscription) {
            onUpgradePlan('pro');
          } else {
            onAddCredits(selectedPack.credits);
          }
          onRefetchUser(); // synchronize credits properly
        }, 1500);
      }
    } catch (e) {
      setProcessingPayment(false);
      setPaymentStep('checkout');
    }
  };

  return (
    <div className="space-y-12 text-left relative font-sans">
      {/* Visual top decorative pattern */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero section */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          Credit Engine pricing
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Add dynamic credits or upgrade plans inside our secure sandbox. Driven securely by Sandbox Razorpay.
        </p>
      </div>

      {/* Plans Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((pl) => {
          const isUserPlan = user.plan === pl.type;
          return (
            <div 
              key={pl.name}
              className={`rounded-2xl glass p-6 flex flex-col justify-between relative relative overflow-hidden ${isUserPlan ? 'border-cyan-500 bg-gradient-to-tr from-[#050505]/80 to-cyan-950/20' : ''}`}
            >
              {isUserPlan && (
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase">
                  Current Orbit ACTIVE
                </span>
              )}

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono font-semibold block mb-1">Nexiva Tier</span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-100">{pl.name}</h3>
                <p className="text-xs text-slate-400 mt-2 font-light">{pl.caption}</p>
                
                <p className="text-3xl font-extrabold text-white mt-4">{pl.price} <span className="text-xs text-slate-500 font-normal">/ mo</span></p>
                
                <div className="mt-4 p-3 rounded-lg bg-slate-950/90 text-xs font-mono text-cyan-400 border border-cyan-500/10">
                  🎁 Allocation: {pl.credits}
                </div>

                <ul className="mt-6 space-y-3.5 text-xs text-slate-300 font-light">
                  {pl.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {pl.type === 'pro' && !isUserPlan ? (
                <button 
                  onClick={handleLaunchProUpgradeRazorpay}
                  className="mt-8 w-full py-3.5 rounded-xl glow-btn text-black font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-lg"
                >
                  Upgrade with Razorpay
                </button>
              ) : (
                <button 
                  disabled
                  className="mt-8 w-full py-3.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 text-xs font-semibold cursor-default"
                >
                  {isUserPlan ? 'Current Plan' : 'Free tier selected'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Credit-based bundles section */}
      <div className="border-t border-slate-900 pt-10">
        <div className="text-center md:text-left mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-400" /> Need Credit Injection Packets?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Top up your balance instantly without altering your billing tier. Purchases add straight to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {creditBundles.map((bun) => (
            <div 
              key={bun.name}
              className="p-5 rounded-xl glass hover:border-purple-500/30 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-fuchsia-400 font-mono font-bold uppercase tracking-wider block mb-1">Top-Up Preset</span>
                <h4 className="font-bold text-white text-sm">{bun.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-light leading-relaxed">{bun.description}</p>
                <div className="py-2.5 mt-4 border-t border-b border-slate-950 flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500">Allocation:</span>
                  <span className="font-bold text-white font-mono">+{bun.credits} Credits</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-100">${bun.price}</span>
                <button 
                  onClick={() => handleTriggerRazorpay(bun)}
                  className="px-4 py-2 text-xs font-bold rounded-lg glass border border-purple-500 text-purple-400 hover:bg-purple-505 hover:text-white transition-all cursor-pointer"
                >
                  Buy Packet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Absolute high-fidelity Razorpay Integrated Sandbox Overlay modal */}
      <AnimatePresence>
        {paymentStep && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            {/* dark backing */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setPaymentStep(null)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl overflow-hidden p-6 shadow-2xl space-y-5"
            >
              {paymentStep === 'checkout' && (
                <div className="space-y-4">
                  {/* Razorpay Authentic-looking header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <img src="https://secure.payu.in/images/payulogo.png" alt="Card" className="hidden" />
                      <div className="bg-blue-600 text-white rounded font-mono px-1.5 py-0.5 text-[10px] font-bold tracking-widest leading-none">
                        RAZORPAY
                      </div>
                      <span className="text-xs font-serif italic text-blue-900 font-bold">Secure checkout API</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                      sandbox environment
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-left text-xs">
                    <p className="text-slate-500 uppercase font-mono text-[9px]">MERCHANT REFERENCE</p>
                    <h4 className="font-bold text-slate-800 text-sm">Nexiva AI Studio Inc.</h4>
                    <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                      <span className="text-slate-500">Order Ref:</span>
                      <span className="font-mono font-semibold text-slate-700">{razorpayOrderName}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-500">Purchasing asset:</span>
                      <span className="font-semibold text-slate-700">{selectedPack?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-slate-100 pt-2 mt-2">
                      <span className="text-slate-800">TOTAL DUE SECURELY:</span>
                      <span className="text-blue-600">${selectedPack?.price} USD</span>
                    </div>
                  </div>

                  {/* Payment Card Simulation Form */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Simulated billing card details</span>
                    <input 
                      type="text" 
                      disabled
                      value="4111 •••• •••• 1111"
                      className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-xl font-mono text-slate-500 cursor-not-allowed outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        disabled
                        value="12/28" 
                        className="bg-slate-50 border border-slate-200 text-xs p-3 rounded-xl font-mono text-slate-500 cursor-not-allowed outline-none text-center"
                      />
                      <input 
                        type="text" 
                        disabled
                        value="•••" 
                        className="bg-slate-50 border border-slate-200 text-xs p-3 rounded-xl font-mono text-slate-500 cursor-not-allowed outline-none text-center"
                      />
                    </div>
                  </div>

                  {/* Sandbox triggers */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => setPaymentStep('canceled')}
                      className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 transition-colors cursor-pointer"
                    >
                      Failure Sandbox
                    </button>
                    <button 
                      onClick={handleSimulatePaymentSuccess}
                      disabled={processingPayment}
                      className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {processingPayment ? "Encrypting SSL..." : "Success sandbox"}
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-lg shadow-green-200 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Transaction Authorization Approved</h3>
                    <p className="text-xs text-slate-500 mt-1">Order receipt compiled under token <strong>{razorpayOrderName}</strong></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-xs mx-auto text-xs text-left space-y-1">
                    <div className="flex justify-between"><span className="text-slate-400">Order Name:</span><span className="text-slate-700 font-semibold">{selectedPack?.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Awarded credits:</span><span className="text-green-600 font-bold">+{selectedPack?.credits} credits</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Razorpay Fee paid:</span><span className="text-slate-700 font-bold">${selectedPack?.price}</span></div>
                  </div>
                  <button 
                    onClick={() => setPaymentStep(null)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Return to Nexiva Dashboard
                  </button>
                </div>
              )}

              {paymentStep === 'canceled' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-pulse">
                    <X className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Transaction Declined</h3>
                    <p className="text-xs text-slate-500 mt-1">Payment sandbox returned code error SECURE_GATE_FAILURE.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPaymentStep('checkout')}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                    >
                      Retry Gate
                    </button>
                    <button 
                      onClick={() => setPaymentStep(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                    >
                      Dismiss Checkout
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
