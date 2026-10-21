export async function getSpotifyTracks(vibeData: any, offset: number, memory: any) {
    const res = await fetch('/api/get-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            seed_genres: vibeData.seed_genres,
            seed_keywords_for_search: vibeData.seed_keywords_for_search,
            offset,
            pulse_memory: memory,
        }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.tracks || [];
}
