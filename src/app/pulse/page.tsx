'use client';

import { useState } from 'react';
import PulseLanding from './PulseLanding';
import ReelFeed from './ReelFeed';
import { useSession } from 'next-auth/react';
import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function PulsePage() {
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState<any[]>([]);
  const [intentSummary, setIntentSummary] = useState('');
  const [vibeData, setVibeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreTracks = async () => {
    if (isLoadingMore || !vibeData) return;
    setIsLoadingMore(true);
    try {
        let memory = null;
        try {
            const memStr = localStorage.getItem('pulse_memory');
            if (memStr) memory = JSON.parse(memStr);
        } catch (e) {}

        const tracksRes = await fetch('/api/get-tracks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...vibeData,
                offset: tracks.length,
                pulse_memory: memory
            })
        });
        const tracksData = await tracksRes.json();
        if (!tracksData.error && tracksData.tracks?.length > 0) {
            setTracks(prev => [...prev, ...tracksData.tracks]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoadingMore(false);
    }
  };

  if (status === 'loading') {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-6">
        <h1 className="text-2xl font-bold text-white">Pulse Needs Spotify</h1>
        <p className="text-spotify-text-muted">Connect your Spotify account to discover music based on your exact vibe.</p>
        <button 
          onClick={() => signIn('spotify')}
          className="bg-spotify-green text-black font-bold uppercase tracking-[1.5px] px-8 py-4 rounded-full"
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-spotify-base">
        {tracks.length > 0 ? (
            <ReelFeed 
              tracks={tracks} 
              intentSummary={intentSummary} 
              loadMoreTracks={loadMoreTracks} 
            />
        ) : (
            <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#2a2a2a] to-spotify-base relative">
                <PulseLanding 
                  setTracks={setTracks} 
                  setIntentSummary={setIntentSummary}
                  setVibeData={setVibeData}
                  loading={loading}
                  setLoading={setLoading}
                />
            </div>
        )}
    </div>
  );
}
