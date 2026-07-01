'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

export default function AddToPlaylistSheet({ track, onClose }: { track: any, onClose: () => void }) {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    const token = session?.accessToken;
    if (!token) return;

    fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setPlaylists(data.items || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [session]);

  const addToPlaylist = async (playlistId: string) => {
    // @ts-ignore
    const token = session?.accessToken;
    if (!token) return;

    try {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [track.uri]
        })
      });
      if (res.ok) {
        alert(`Added ${track.name} to playlist!`); // MVP toast
        onClose();
      } else {
        alert("Failed to add to playlist");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="absolute bottom-0 w-full bg-spotify-surface rounded-t-[24px] shadow-spotify-heavy pb-8 pt-6 px-4 z-50 flex flex-col max-h-[75vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add to playlist</h2>
          <button onClick={onClose} className="p-2 text-spotify-text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        <button className="flex items-center gap-4 p-3 hover:bg-spotify-elevated rounded-lg transition-colors mb-4 border border-spotify-border border-dashed">
            <div className="w-12 h-12 flex items-center justify-center bg-spotify-elevated rounded">
                <Plus size={24} className="text-spotify-text-muted" />
            </div>
            <span className="font-bold text-white">New Playlist</span>
        </button>

        <div className="overflow-y-auto flex-1 flex flex-col gap-2 no-scrollbar">
          {loading ? (
            <div className="text-center text-spotify-text-muted mt-4">Loading playlists...</div>
          ) : (
            playlists.map(p => (
              <button 
                key={p.id}
                onClick={() => addToPlaylist(p.id)}
                className="flex items-center gap-4 p-2 hover:bg-spotify-elevated rounded-lg transition-colors text-left"
              >
                {p?.images?.length > 0 ? (
                  <img src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-spotify-elevated rounded flex items-center justify-center">
                    <span className="text-xs text-spotify-text-muted">No Image</span>
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-white truncate">{p.name}</p>
                  <p className="text-sm text-spotify-text-muted truncate">{p?.owner?.display_name}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
