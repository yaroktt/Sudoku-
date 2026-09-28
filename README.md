# Wordhaven

A relaxing word-connect puzzle game for the browser, in the spirit of Zen Word / Wordscapes: drag letters on a wheel to spell words and fill in a crossword-style grid.

## Play

Open `index.html` in a browser (or serve the folder with any static file server, e.g. `python3 -m http.server`).

It's also a installable app (PWA): once it's hosted somewhere over HTTPS,
opening it and choosing "Add to Home Screen" (iOS/Android) or the browser's
install prompt (Chrome/Edge desktop) installs it as a standalone app icon,
with no browser chrome, that keeps working offline after the first visit.

## Features

- 50 hand-built levels across 10 themed chapters (Lakeside, Balcony, Sunset Cove, Mountain Village, Harbor Lights, Autumn Grove, Desert Bloom, Snowy Peak, Rainforest Canopy, Starlit Bay), with difficulty ramping up gradually
- Crossword grids generated automatically from each level's word list, with words interlocking wherever letters match
- Drag-to-spell letter wheel with touch and mouse support (also supports tap-by-tap selection)
- Auto-reveal: a word is completed automatically once every one of its letters has been uncovered by crossing words or hints
- Shuffle, hints (earn one per level clear), star ratings, and progress saved to `localStorage`
- Relaxing instrumental music while a level is open, with a slow stereo drift (Web Audio panning) for a wider, more spacious feel than flat mono/stereo — mutable from the in-game header, and the preference is remembered
- No build step, no external dependencies — plain HTML/CSS/JS

## Files

- `index.html` — markup for the menu, game screen, and modals
- `style.css` — all styling and per-chapter scenery themes
- `levels.js` — level data (letters + target words) grouped into chapters
- `crossword.js` — generates a crossword grid layout from a list of words
- `game.js` — game state, rendering, input handling, and progress persistence
- `images/` — chapter background photos (see below)
- `audio.js` — background music playback and its subtle stereo panning effect
- `audio/` — background music track (see below)
- `ads.js` — placeholder interstitial ad slot shown every couple of levels, ready to swap in a real ad network SDK
- `manifest.webmanifest` — PWA metadata (name, icons, standalone display)
- `sw.js` — service worker that caches the game for offline play
- `icons/` — app icons for the home screen / install prompt, including a 1024×1024 `icon-1024-appstore.png` sized for App Store/Play Store submission

## Background photos

Each chapter's background is a real landscape photo tinted with that chapter's
accent color. All are free-to-use photos from [Pexels](https://www.pexels.com)
(Pexels License — free for commercial and personal use, no attribution
required):

- `images/lake.jpg` (Lakeside, teal) — [Beautiful Landscape of Mountains Reflecting in a Still Lake](https://www.pexels.com/photo/beautiful-landscape-of-mountains-reflecting-in-a-still-lake-7204540/)
- `images/balcony.jpg` (Balcony, moss green) — [Lush Green Garden Pathway with Topiary Trees](https://www.pexels.com/photo/lush-green-garden-pathway-with-topiary-trees-34581778/)
- `images/sunset.jpg` (Sunset Cove, amber) — [Stunning Golden Sunset Over Calm Ocean Waters](https://www.pexels.com/photo/stunning-golden-sunset-over-calm-ocean-waters-28511273/)
- `images/mountain.jpg` (Mountain Village, indigo) — [Scenic Mountain Village Landscape at Dusk](https://www.pexels.com/photo/scenic-mountain-village-landscape-at-dusk-33501087/)
- `images/harbor.jpg` (Harbor Lights, rose) — [Scenic Harbor at Sunset with Seabirds and Boats](https://www.pexels.com/photo/scenic-harbor-at-sunset-with-seabirds-and-boats-30129361/)
- `images/autumn.jpg` (Autumn Grove, amber-brown) — [Scenic Autumn Pathway Through Vibrant Forest](https://www.pexels.com/photo/scenic-autumn-pathway-through-vibrant-forest-36922149/)
- `images/desert.jpg` (Desert Bloom, terracotta) — [Stunning Desert Sunset Over Sand Dunes](https://www.pexels.com/photo/stunning-desert-sunset-over-sand-dunes-30635456/)
- `images/snowpeak.jpg` (Snowy Peak, ice blue) — [Snow Capped Mountains Under Blue Sky](https://www.pexels.com/photo/snow-capped-mountains-under-blue-sky-12214866/)
- `images/rainforest.jpg` (Rainforest Canopy, emerald) — [Lush Green Rainforest](https://www.pexels.com/photo/lush-green-rainforest-23515065/)
- `images/starlit.jpg` (Starlit Bay, indigo night) — [A Starry Night Sky over the Ocean](https://www.pexels.com/photo/a-starry-night-sky-over-the-ocean-8738454/)

## Background music

- `audio/ambient.mp3` — [The Long Dark](https://www.scottbuckley.com.au/library/the-long-dark/) by Scott Buckley, released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: "'The Long Dark' by Scott Buckley - released under CC-BY 4.0. www.scottbuckley.com.au"
