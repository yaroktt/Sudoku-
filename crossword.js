/**
 * Crossword-style layout generator.
 * Given a list of words (all drawable from one shared letter pool), places
 * them on a grid so they intersect wherever they share a letter, the same
 * way word-connect games arrange their puzzle boards.
 */
(function (global) {
  function generateLayout(words) {
    const sorted = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b));
    const cells = new Map(); // "x,y" -> letter
    const placements = []; // {word, x, y, dir}
    const unplaced = [];

    function canPlace(word, x, y, dir) {
      for (let i = 0; i < word.length; i++) {
        const cx = dir === 'H' ? x + i : x;
        const cy = dir === 'H' ? y : y + i;
        const key = `${cx},${cy}`;
        const existing = cells.get(key);
        if (existing !== undefined) {
          if (existing !== word[i]) return false;
        } else {
          const n1 = dir === 'H' ? `${cx},${cy - 1}` : `${cx - 1},${cy}`;
          const n2 = dir === 'H' ? `${cx},${cy + 1}` : `${cx + 1},${cy}`;
          if (cells.has(n1) || cells.has(n2)) return false;
        }
      }
      const beforeKey = dir === 'H' ? `${x - 1},${y}` : `${x},${y - 1}`;
      const afterKey = dir === 'H' ? `${x + word.length},${y}` : `${x},${y + word.length}`;
      if (cells.has(beforeKey) || cells.has(afterKey)) return false;
      return true;
    }

    function place(word, x, y, dir) {
      for (let i = 0; i < word.length; i++) {
        const cx = dir === 'H' ? x + i : x;
        const cy = dir === 'H' ? y : y + i;
        cells.set(`${cx},${cy}`, word[i]);
      }
      placements.push({ word, x, y, dir });
    }

    if (sorted.length === 0) {
      return { width: 0, height: 0, cells, placements, cellWords: new Map(), wordCells: {}, unplaced };
    }

    place(sorted[0], 0, 0, 'H');

    for (let w = 1; w < sorted.length; w++) {
      const word = sorted[w];
      const candidates = [];
      for (const [key, letter] of cells) {
        const [ex, ey] = key.split(',').map(Number);
        for (let i = 0; i < word.length; i++) {
          if (word[i] === letter) {
            candidates.push({ x: ex - i, y: ey, dir: 'H' });
            candidates.push({ x: ex, y: ey - i, dir: 'V' });
          }
        }
      }
      let best = null;
      let bestScore = -1;
      for (const c of candidates) {
        if (canPlace(word, c.x, c.y, c.dir)) {
          let score = 0;
          for (let i = 0; i < word.length; i++) {
            const cx = c.dir === 'H' ? c.x + i : c.x;
            const cy = c.dir === 'H' ? c.y : c.y + i;
            if (cells.has(`${cx},${cy}`)) score++;
          }
          if (score > bestScore) {
            bestScore = score;
            best = c;
          }
        }
      }
      if (best) {
        place(word, best.x, best.y, best.dir);
      } else {
        unplaced.push(word);
      }
    }

    const cellWords = new Map();
    for (const p of placements) {
      for (let i = 0; i < p.word.length; i++) {
        const cx = p.dir === 'H' ? p.x + i : p.x;
        const cy = p.dir === 'H' ? p.y : p.y + i;
        const key = `${cx},${cy}`;
        if (!cellWords.has(key)) cellWords.set(key, []);
        cellWords.get(key).push(p.word);
      }
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of placements) {
      const endX = p.dir === 'H' ? p.x + p.word.length - 1 : p.x;
      const endY = p.dir === 'H' ? p.y : p.y + p.word.length - 1;
      minX = Math.min(minX, p.x, endX);
      maxX = Math.max(maxX, p.x, endX);
      minY = Math.min(minY, p.y, endY);
      maxY = Math.max(maxY, p.y, endY);
    }
    if (!isFinite(minX)) { minX = 0; maxX = 0; minY = 0; maxY = 0; }
    const shiftX = -minX, shiftY = -minY;

    const placementsN = placements.map((p) => ({ ...p, x: p.x + shiftX, y: p.y + shiftY }));
    const cellsN = new Map();
    for (const [key, letter] of cells) {
      const [x, y] = key.split(',').map(Number);
      cellsN.set(`${x + shiftX},${y + shiftY}`, letter);
    }
    const cellWordsN = new Map();
    for (const [key, list] of cellWords) {
      const [x, y] = key.split(',').map(Number);
      cellWordsN.set(`${x + shiftX},${y + shiftY}`, list);
    }
    const wordCells = {};
    for (const p of placementsN) {
      const arr = [];
      for (let i = 0; i < p.word.length; i++) {
        const cx = p.dir === 'H' ? p.x + i : p.x;
        const cy = p.dir === 'H' ? p.y : p.y + i;
        arr.push(`${cx},${cy}`);
      }
      wordCells[p.word] = arr;
    }

    return {
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      cells: cellsN,
      placements: placementsN,
      cellWords: cellWordsN,
      wordCells,
      unplaced,
    };
  }

  const api = { generateLayout };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.Crossword = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
