import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { prompt, adventure_level = 50, pulse_memory } = await req.json();

    let memoryInstruction = "";
    if (pulse_memory && (pulse_memory.likes?.length > 0 || pulse_memory.skips?.length > 0)) {
        memoryInstruction = `\n\nSWIPE MEMORY (CRITICAL):\nThe user has shown a preference FOR these artists: [${(pulse_memory.likes || []).join(", ")}]. The user has shown a preference AGAINST these artists: [${(pulse_memory.skips || []).join(", ")}]. Strictly avoid generating keywords/genres associated with the dislikes, and heavily favor keywords/genres associated with the likes.`;
    }

    const systemInstruction = `You map a user's vibe description to Spotify audio feature targets.
Return ONLY valid JSON matching the schema. Do not return prose.${memoryInstruction}

Audio feature ranges (0.0 to 1.0 unless noted):
- target_energy: 0.0 (calm) to 1.0 (intense)
- target_valence: 0.0 (sad/dark) to 1.0 (happy/euphoric)
- target_tempo: 50-200 BPM
- target_acousticness: 0.0 (electronic) to 1.0 (acoustic)
- target_instrumentalness: 0.0 (vocals) to 1.0 (instrumental)
- mode: 0 (minor) or 1 (major)

Adventure level is ${adventure_level} (0-100), which maps to popularity_ceiling:
- 0-30 (Familiar): popularity_ceiling = 80
- 31-70 (Balanced): popularity_ceiling = 55
- 71-100 (Surprise me): popularity_ceiling = 35

Set discovery_bias to "deep_cuts_and_unknown" if adventure_level > 70, otherwise "familiar".
Limit seed_genres to exactly 2 genres. Only use genres that are typical Spotify genre seeds (e.g., pop, rock, electronic, indie, ambient, etc.).
Limit seed_keywords_for_search to max 3 items.

The output MUST be a JSON object with this exact structure:
{
  "intent_summary": "Short 3-word summary",
  "audio_targets": {
    "target_energy": 0.5,
    "target_valence": 0.5,
    "target_tempo": 120,
    "target_acousticness": 0.5,
    "target_instrumentalness": 0.0,
    "mode": 1
  },
  "seed_genres": ["pop", "electronic"],
  "seed_keywords_for_search": ["upbeat", "dance"],
  "popularity_ceiling": 55,
  "discovery_bias": "familiar"
}`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemInstruction
            },
            {
                role: "user",
                content: prompt || "suggest something randomly cool"
            }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0]?.message?.content;
    if (!responseText) throw new Error("No response text from Groq");

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error("Vibe parsing error:", error);
    if (error?.status === 429) {
        return NextResponse.json({ error: "Gemini API rate limit reached. Please wait a minute and try again." }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to parse vibe' }, { status: 500 });
  }
}
