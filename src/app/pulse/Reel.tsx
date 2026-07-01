'use client';

import { Plus, ThumbsDown } from 'lucide-react';

export default function Reel({ track, isActive, onAddClick, onDislike }: any) {
  const albumArt = track.album?.images?.[0]?.url || 'https://via.placeholder.com/400';

  return (
    <div className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
        style={{ backgroundImage: `url(${albumArt})` }}
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

      {/* Main Album Art (kept for aesthetic, though iframe has its own) */}
      <div className="relative z-10 w-64 h-64 shadow-spotify-heavy rounded-lg overflow-hidden mb-32">
        <img src={albumArt} alt={track.name} className="w-full h-full object-cover" />
      </div>

      {/* Bottom Spotify Embed & Actions */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pb-[240px] pt-24 px-4 z-10 flex flex-col gap-4 pointer-events-none">
        


        {/* Pulse Custom Actions */}
        <div className="flex justify-between items-center px-2 pointer-events-auto">
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 bg-spotify-elevated px-5 py-3 rounded-full text-sm font-bold text-white hover:bg-spotify-card-mid transition-colors shadow-spotify-medium"
            >
              <Plus size={18} /> Add to Playlist
            </button>
            <div className="flex gap-3">
                <button 
                  onClick={onDislike}
                  className="w-12 h-12 flex items-center justify-center bg-transparent border border-spotify-border text-spotify-text-muted rounded-full hover:text-white hover:border-white transition-colors"
                >
                  <ThumbsDown size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
