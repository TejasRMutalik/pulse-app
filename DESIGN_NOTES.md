# DESIGN_NOTES.md

## Tokens Installed
The `getdesign` command successfully provided the Spotify design language in `DESIGN.md`. We have:
- **Colors**: Comprehensive palette including Near Black (`#121212`), Dark Surface (`#181818`), Spotify Green (`#1ed760`), and semantic/text colors.
- **Typography**: Specific sizing (10px–24px), font weights (400, 600, 700), and rules like uppercase with 1.4px-2px letter spacing for buttons.
- **Component Geometry**: Heavy use of pill shapes (500px-9999px border radius) and circular play controls (50%).
- **Shadows & Borders**: Specific shadow opacities (0.3 - 0.5) and inset border-shadow combinations.

## Gaps Identified
While the visual specifications are detailed, the following practical implementations are missing and need to be built:
1. **Tailwind Config**: The tokens are documented but not yet mapped into our `tailwind.config.ts`. We need to manually configure the colors, font families, box shadows, and border radii.
2. **Font Files**: The document mentions `SpotifyMixUI` and `SpotifyMixUITitle`. Since these are proprietary and weren't actually downloaded, we need to decide on a web-safe fallback or use a similar Google Font (like `Inter` or `Outfit`) to mimic the look.
3. **Component Primitives**: No actual React/Next.js components were generated. We will need to scaffold our own generic UI components (like `<Button>`, `<Input>`) using these styling rules, or install `shadcn/ui` and heavily restyle it.

## Next Steps
- Port the tokens from `DESIGN.md` into `tailwind.config.ts` and `globals.css`.
- Determine the best font to use.
