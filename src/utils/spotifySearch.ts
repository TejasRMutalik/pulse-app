export async function getSpotifyTracksClient(vibeData: any, offset: number, memory: any, accessToken: string) {
    const queryParts = [];
    if (vibeData.seed_keywords_for_search?.length > 0) queryParts.push(vibeData.seed_keywords_for_search.join(" "));
    if (vibeData.seed_genres?.length > 0) queryParts.push(vibeData.seed_genres.slice(0, 2).join(" "));
    if (queryParts.length === 0) queryParts.push("chill vibes");
    
    const params = new URLSearchParams({
        q: queryParts.join(" "),
        type: "track",
        offset: offset.toString()
    });

    const spotifyHeaders = {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json"
    };

    let searchRes = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, { headers: spotifyHeaders });
    if (!searchRes.ok) {
        const txt = await searchRes.text();
        throw new Error(`Spotify API Error: ${txt}`);
    }
    let searchData = await searchRes.json();
    
    let validTracks = searchData.tracks?.items || [];
    
    const applyFilter = (tracksList: any[]) => {
        if (!memory || !memory.skips) return tracksList;
        const skipLower = memory.skips.map((s: string) => (typeof s === 'string' ? s.toLowerCase() : ""));
        return tracksList.filter((t: any) => {
            const artistName = t.artists?.[0]?.name?.toLowerCase() || "";
            return !skipLower.includes(artistName);
        });
    };
    
    validTracks = applyFilter(validTracks);
    
    if (validTracks.length < 5) {
        const fallbackParams = new URLSearchParams({ q: "lofi hip hop chill", type: "track", offset: offset.toString() });
        const fallbackRes = await fetch(`https://api.spotify.com/v1/search?${fallbackParams.toString()}`, { headers: spotifyHeaders });
        if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const fallbackValid = fallbackData.tracks?.items || [];
            const existingIds = new Set(validTracks.map((t: any) => t.id));
            let newTracks = fallbackValid.filter((t: any) => !existingIds.has(t.id));
            newTracks = applyFilter(newTracks);
            validTracks = [...validTracks, ...newTracks];
        }
    }
    
    validTracks = validTracks.sort(() => 0.5 - Math.random());
    return validTracks.slice(0, 20);
}
