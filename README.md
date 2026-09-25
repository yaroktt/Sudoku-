# Zen Word

A relaxing word-connect puzzle game for the browser, in the spirit of Zen Word / Wordscapes: drag letters on a wheel to spell words and fill in a crossword-style grid.

## Play

Open `index.html` in a browser (or serve the folder with any static file server, e.g. `python3 -m http.server`).

## Features

- 20 hand-built levels across 4 themed chapters (Lakeside, Balcony, Sunset Cove, Mountain Village)
- Crossword grids generated automatically from each level's word list, with words interlocking wherever letters match
- Drag-to-spell letter wheel with touch and mouse support (also supports tap-by-tap selection)
- Auto-reveal: a word is completed automatically once every one of its letters has been uncovered by crossing words or hints
- Shuffle, hints (earn one per level clear), star ratings, and progress saved to `localStorage`
- No build step, no external dependencies — plain HTML/CSS/JS

## Files

- `index.html` — markup for the menu, game screen, and modals
- `style.css` — all styling and per-chapter scenery themes
- `levels.js` — level data (letters + target words) grouped into chapters
- `crossword.js` — generates a crossword grid layout from a list of words
- `game.js` — game state, rendering, input handling, and progress persistence
