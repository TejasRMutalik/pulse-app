'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIBE_CHIPS = [
  "Workout", "2am drive", "Sad-but-hopeful", "Focus", 
  "Rainy Sunday", "Gym intense", "Study", "Pre-party", 
  "Wind-down", "Discover"
];

import { getSpotifyTracksClient } from '@/utils/spotifySearch';

export default function PulseLanding({ setTracks, setIntentSummary, setVibeData, loading, setLoading, accessToken }: any) {
  const [prompt, setPrompt] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = ["Reading the vibe...", "Finding tracks...", "Tuning the order..."];

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
        setLoadingStep(prev => Math.min(prev + 1, 2));
    }, 1500);

    try {
        let memory = null;
        try {
            const memStr = localStorage.getItem('pulse_memory');
            if (memStr) memory = JSON.parse(memStr);
        } catch (e) {}

        const vibeRes = await fetch('/api/parse-vibe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt, 
                adventure_level: 20,
                pulse_memory: memory 
            })
        });
        const vibeData = await vibeRes.json();
        
        if (vibeData.error) throw new Error(vibeData.error);
        
        setIntentSummary(vibeData.intent_summary);
        setVibeData(vibeData);

        if (!accessToken) throw new Error("No Spotify access token available.");

        const validTracks = await getSpotifyTracksClient(vibeData, 0, memory, accessToken);
        
        setTracks(validTracks || []);
    } catch (err: any) {
        alert(err.message || "Failed to generate Pulse. Please try again.");
    } finally {
        clearInterval(interval);
        setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-0 w-full bg-spotify-surface rounded-t-[24px] shadow-spotify-heavy pb-6 pt-8 px-4 flex flex-col gap-6 max-h-[85vh] overflow-y-auto z-10"
    >
        <div className="relative flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">What's the vibe right now?</h2>
        </div>

        {/* Quick Vibe Chips - Horizontal Scroll */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4">
            {VIBE_CHIPS.map(chip => (
                <button
                    key={chip}
                    onClick={() => setPrompt(chip)}
                    className="whitespace-nowrap px-4 py-2 rounded-full bg-spotify-elevated border border-spotify-border hover:bg-spotify-card-mid text-sm font-semibold transition-colors"
                >
                    {chip}
                </button>
            ))}
        </div>

        {/* Text Input */}
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-spotify-text-muted" size={20} />
            <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="or describe it in your own words..."
                className="w-full bg-spotify-elevated text-white rounded-full py-4 pl-12 pr-4 outline-none border border-spotify-border focus:border-white shadow-spotify-inset transition-colors placeholder:text-spotify-text-muted"
            />
        </div>

        {/* Generate Button */}
        <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-spotify-green text-black font-bold uppercase tracking-[1.5px] py-4 rounded-full mt-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    {loadingSteps[loadingStep]}
                </span>
            ) : (
                "Generate Pulse"
            )}
        </button>
    </motion.div>
  );
}
