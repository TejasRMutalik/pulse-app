import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seed_genres, seed_keywords_for_search, offset = 0, pulse_memory } = await req.json();

    let queryParts = [];
    
    if (seed_keywords_for_search && seed_keywords_for_search.length > 0) {
        queryParts.push(seed_keywords_for_search.join(" "));
    }
    
    if (seed_genres && seed_genres.length > 0) {
        // We just use genres as plain search keywords. The strict genre: filter is flaky in Spotify API.
        queryParts.push(seed_genres.slice(0, 2).join(" "));
    }
    
    if (queryParts.length === 0) queryParts.push("chill vibes");

    const query = queryParts.join(" ");

    const params = new URLSearchParams({
        q: query,
        type: "track",
        offset: offset.toString()
    });

    const spotifyHeaders = {
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    };

    let searchRes = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
        headers: spotifyHeaders
    });

    // Vercel IPs sometimes trigger 502 Bad Gateway on Spotify. Retry once.
    if (searchRes.status === 502) {
        console.log("Spotify returned 502. Retrying in 1 second...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        searchRes = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
            headers: spotifyHeaders
        });
    }

    if (!searchRes.ok) {
        const err = await searchRes.text();
        console.error("Spotify search HTTP STATUS:", searchRes.status);
        console.error("Spotify search error text:", err);
        return NextResponse.json({ error: `Spotify API Error (${searchRes.status}): ${err}` }, { status: searchRes.status });
    }

    const searchData = await searchRes.json();
    
    // Spotify has deprecated preview_url for much of its catalog.
    // We will just take the tracks as-is.
    let validTracks = searchData.tracks?.items || [];

    // Filter helper
    const applyFilter = (tracksList: any[]) => {
        if (!pulse_memory || !pulse_memory.skips) return tracksList;
        const skipLower = pulse_memory.skips.map((s: string) => (typeof s === 'string' ? s.toLowerCase() : ""));
        return tracksList.filter((t: any) => {
            const artistName = t.artists?.[0]?.name?.toLowerCase() || "";
            return !skipLower.includes(artistName);
        });
    };

    validTracks = applyFilter(validTracks);

    // If we didn't find enough, do a highly generic fallback search
    if (validTracks.length < 5) {
        console.log("Not enough tracks found, doing broad fallback search...");
        const fallbackParams = new URLSearchParams({
            q: "lofi hip hop chill", // Universal fallback that always has previews
            type: "track",
            offset: offset.toString()
        });
        const fallbackRes = await fetch(`https://api.spotify.com/v1/search?${fallbackParams.toString()}`, {
            headers: spotifyHeaders
        });
        if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const fallbackValid = fallbackData.tracks?.items || [];
            console.log(`Fallback raw tracks: ${fallbackValid.length}`);
            
            const existingIds = new Set(validTracks.map((t: any) => t.id));
            let newTracks = fallbackValid.filter((t: any) => !existingIds.has(t.id));
            console.log(`Fallback after existing filter: ${newTracks.length}`);
            newTracks = applyFilter(newTracks);
            console.log(`Fallback after memory filter: ${newTracks.length}`);
            validTracks = [...validTracks, ...newTracks];
        } else {
            console.log(`Fallback search HTTP error: ${fallbackRes.status}`);
            console.log(await fallbackRes.text());
        }
    }

    // Randomize slightly for feed feel
    validTracks = validTracks.sort(() => 0.5 - Math.random());

    console.log(`Returning ${validTracks.slice(0, 20).length} valid tracks`);
    return NextResponse.json({ tracks: validTracks.slice(0, 20) });

  } catch (error) {
    console.error("Get tracks error:", error);
    return NextResponse.json({ error: 'Failed to get tracks' }, { status: 500 });
  }
}
