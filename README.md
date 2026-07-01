# 🎵 Pulse: The AI-Powered Music Discovery Feed

Welcome to **Pulse**, a modern, TikTok-style music discovery application powered by artificial intelligence and the Spotify API. This project was built through a multi-phase journey (Phase 0 to Phase 7) to create a highly personalized, swipeable music feed that perfectly matches your current mood.

---

## 🚀 How to Try Pulse (Live Demo)

You can try the live application right now by visiting our Vercel deployment:
👉 **[https://pulse-app-blond-tau.vercel.app](https://pulse-app-blond-tau.vercel.app)**

### 🔐 Important Login Instructions

> [!WARNING]
> **Spotify API Constraint:** Because this app is currently in Spotify's "Development Mode," **you cannot log in with your own personal Spotify account**. You must use the designated test account provided below.

When you visit the website, click **Connect Spotify**, and use these exact credentials:

- **Email:** `tejaseditzz3108@gmail.com`
- **Password:** `Nextleap2026`

> [!CAUTION]
> **Do not copy and paste the credentials!** 
> The official Spotify login page often captures invisible trailing spaces when you copy and paste, which will cause it to show an "Invalid Credentials" error. Please **type the email and password manually** to ensure a successful login.

---

## 🎧 How to Use the App

Once you log in, using Pulse is incredibly simple:

1. **Pick Your Vibe:** You will be greeted by a prompt screen. Either click one of the quick "Vibe Chips" (like *Rainy Sunday* or *2am drive*) or type your exact mood into the search bar.
2. **Hit Generate:** The AI will analyze your vibe and pull a custom list of Spotify tracks that perfectly match the mood.
3. **Scroll the Feed:** You will be taken to a vertical, swipeable feed (just like TikTok or Instagram Reels). Scroll down to discover new songs!
4. **Dislike / Swipe Left:** If you don't like a song or an artist, you can hit the **Thumbs Down** button (or swipe left). 
   - *Smart Memory:* The app remembers the artists you dislike and will automatically filter them out of your future feeds so you only get the music you love!

> [!NOTE]
> **Spotify API Constraint (Adding to Playlists):** You might notice that the "Add to Playlist" feature is currently disabled. This is a strict limitation imposed by Spotify to protect user accounts from unauthorized modifications while the app is in Development Mode. 

---

## 🏗️ How We Built This (Phase 0 to Phase 7)

We built Pulse step-by-step from the ground up. Here is a beginner-friendly breakdown of our development journey:

### Phase 0: The Setup
We started by creating a blank Next.js web application and connecting it to the Spotify Developer Dashboard. We set up our environment variables and made sure our local server could talk to Spotify.

### Phase 1: Authentication
We implemented **NextAuth.js** to allow users to securely log in using their Spotify accounts. This is what handles the green "Connect Spotify" button and securely holds your session.

### Phase 2: The User Interface (UI)
We designed the beautiful, dark-themed interface using **Tailwind CSS**. We built the landing page where you type your mood, and we created the TikTok-style vertical scrolling feed for the songs.

### Phase 3: The AI Brain (Groq & LLaMA 3)
We connected the app to the lightning-fast **Groq AI**. When you type "I want to study on a rainy day," the AI translates that human emotion into exact Spotify search terms and acoustic features (like low tempo, high acousticness).

### Phase 4: Connecting the Music
We linked the AI's output directly to the **Spotify Search API**. The app takes the AI's recommended genres and keywords and fetches a curated list of 20 songs directly from Spotify's massive database.

### Phase 5: The Audio Player
We built a custom audio player into the feed. As you scroll, the app automatically pulls the album artwork, track name, and artist name, and plays a 30-second audio preview of the song.

### Phase 6: Polishing the Experience
We refined the animations, fixed scrolling bugs, and made sure the interface felt incredibly smooth and premium, completely matching Spotify's native design aesthetics.

### Phase 7: Smart Memory (The Dislike Button)
We implemented a local storage "Memory" system. When you dislike an artist, the app remembers it. The next time you generate a Pulse, the backend actively filters out those artists before showing you the feed, ensuring a highly personalized experience!

*(In this phase, we also bypassed a complex Vercel IP block by moving the Spotify network requests directly to the user's browser!)*

---

Enjoy the music! 🎶
