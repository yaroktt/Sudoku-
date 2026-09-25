(function () {
  'use strict';

  const { CHAPTERS, LEVELS, chapterForLevel, themeForLevel, getLevel } = window.ZenWordData;
  const { generateLayout } = window.Crossword;

  const STORAGE_KEY = 'zenword_progress_v1';

  const el = {
    menuScreen: document.getElementById('menu-screen'),
    gameScreen: document.getElementById('game-screen'),
    levelPath: document.getElementById('level-path'),
    hintCountMenu: document.getElementById('hint-count'),
    backBtn: document.getElementById('back-btn'),
    restartBtn: document.getElementById('restart-btn'),
    levelName: document.getElementById('level-name'),
    levelProgress: document.getElementById('level-progress'),
    grid: document.getElementById('crossword-grid'),
    scenery: document.getElementById('scenery'),
    currentWord: document.getElementById('current-word'),
    wheel: document.getElementById('wheel'),
    wheelLines: document.getElementById('wheel-lines'),
    shuffleBtn: document.getElementById('shuffle-btn'),
    hintBtn: document.getElementById('hint-btn'),
    hintBadge: document.getElementById('hint-badge'),
    toast: document.getElementById('toast'),
    completeModal: document.getElementById('complete-modal'),
    modalStars: document.getElementById('modal-stars'),
    modalSub: document.getElementById('modal-sub'),
    modalNextBtn: document.getElementById('modal-next-btn'),
    modalMenuBtn: document.getElementById('modal-menu-btn'),
    chapterModal: document.getElementById('chapter-modal'),
    chapterTitle: document.getElementById('chapter-title'),
    chapterSub: document.getElementById('chapter-sub'),
    chapterMenuBtn: document.getElementById('chapter-menu-btn'),
  };

  // ---------- Progress persistence ----------
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt storage */ }
    return { unlocked: 1, stars: {}, hints: 3 };
  }
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* storage unavailable */ }
  }
  let progress = loadProgress();

  // ---------- Session state ----------
  let session = null;

  function letterCounts(str) {
    const m = {};
    for (const ch of str) m[ch] = (m[ch] || 0) + 1;
    return m;
  }

  function buildSession(levelId) {
    const level = getLevel(levelId);
    const wheelCounts = letterCounts(level.letters);
    const validWords = level.words.filter((word) => {
      const wc = letterCounts(word);
      return Object.entries(wc).every(([ch, n]) => (wheelCounts[ch] || 0) >= n);
    });
    const layout = generateLayout(validWords);
    const wordSet = new Set(validWords.filter((w) => !layout.unplaced.includes(w)));

    return {
      level,
      layout,
      words: wordSet,
      solved: new Set(),
      hintReveals: new Set(),
      hintsUsed: 0,
      wheelLetters: level.letters.split(''),
      wheelOrder: shuffledIndices(level.letters.length),
      path: [],
      dragActive: false,
      dragMoved: false,
    };
  }

  function shuffledIndices(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---------- Menu rendering ----------
  function renderMenu() {
    el.hintCountMenu.textContent = progress.hints;
    el.levelPath.innerHTML = '';
    CHAPTERS.forEach((chapter) => {
      const block = document.createElement('div');
      block.className = `chapter-block theme-${chapter.key}`;

      const header = document.createElement('div');
      header.className = 'chapter-header';
      header.innerHTML = `<h2>${chapter.name}</h2><p>${chapter.subtitle}</p>`;
      block.appendChild(header);

      const nodes = document.createElement('div');
      nodes.className = 'chapter-nodes';

      chapter.levels.forEach((id) => {
        const wrap = document.createElement('div');
        wrap.className = 'node-wrap';

        const node = document.createElement('button');
        node.className = 'level-node';
        const isDone = !!progress.stars[id];
        const isUnlocked = id <= progress.unlocked;
        const isCurrent = id === progress.unlocked && !isDone;

        if (!isUnlocked) {
          node.classList.add('locked');
          node.innerHTML = '<span class="lock-icon">🔒</span>';
          node.disabled = true;
        } else {
          if (isDone) node.classList.add('done');
          if (isCurrent) node.classList.add('current');
          node.textContent = id;
          if (isDone) {
            const stars = document.createElement('span');
            stars.className = 'stars';
            stars.textContent = '★'.repeat(progress.stars[id]) + '☆'.repeat(3 - progress.stars[id]);
            node.appendChild(stars);
          }
          node.addEventListener('click', () => startLevel(id));
        }
        wrap.appendChild(node);
        nodes.appendChild(wrap);
      });

      block.appendChild(nodes);
      el.levelPath.appendChild(block);
    });
  }

  // ---------- Game screen ----------
  function startLevel(id) {
    session = buildSession(id);
    const theme = themeForLevel(id);
    el.gameScreen.className = 'screen theme-' + theme;
    el.levelName.textContent = 'Level ' + id;
    updateProgressLabel();
    renderGrid();
    renderWheel();
    updateHintUI();
    showScreen('game');
  }

  function showScreen(which) {
    el.menuScreen.classList.toggle('hidden', which !== 'menu');
    el.gameScreen.classList.toggle('hidden', which !== 'game');
    if (which === 'menu') renderMenu();
  }

  function updateProgressLabel() {
    el.levelProgress.textContent = `${session.solved.size} / ${session.words.size} words`;
  }

  function isRevealed(key) {
    if (session.hintReveals.has(key)) return true;
    const words = session.layout.cellWords.get(key) || [];
    return words.some((w) => session.solved.has(w));
  }

  function renderGrid() {
    const { width, height, cells } = session.layout;
    el.grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    el.grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    const maxCellFromWidth = Math.floor((Math.min(window.innerWidth, 480) - 24) / width);
    const maxCellFromHeight = Math.floor((window.innerHeight * 0.42) / height);
    const cellSize = Math.max(18, Math.min(40, maxCellFromWidth, maxCellFromHeight));
    el.grid.style.width = cellSize * width + (width - 1) * 3 + 'px';
    el.grid.style.height = cellSize * height + (height - 1) * 3 + 'px';

    el.grid.innerHTML = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = `${x},${y}`;
        const div = document.createElement('div');
        if (!cells.has(key)) {
          div.className = 'cw-cell empty';
        } else {
          div.className = 'cw-cell blank';
          div.dataset.key = key;
          div.style.fontSize = Math.round(cellSize * 0.5) + 'px';
        }
        el.grid.appendChild(div);
      }
    }
    refreshGridReveals();
  }

  function refreshGridReveals() {
    const { cells } = session.layout;
    el.grid.querySelectorAll('.cw-cell[data-key]').forEach((cellEl) => {
      const key = cellEl.dataset.key;
      if (isRevealed(key)) {
        if (!cellEl.classList.contains('filled')) {
          cellEl.classList.remove('blank');
          cellEl.classList.add('filled');
          cellEl.textContent = cells.get(key);
        }
      } else {
        cellEl.classList.remove('filled');
        cellEl.classList.add('blank');
        cellEl.textContent = '';
      }
    });
  }

  // ---------- Wheel ----------
  function renderWheel() {
    el.wheel.querySelectorAll('.wheel-letter').forEach((n) => n.remove());
    const n = session.wheelOrder.length;
    const radius = n <= 5 ? 68 : n === 6 ? 76 : 82;
    const center = 100;
    session.wheelOrder.forEach((letterIndex, pos) => {
      const angle = (pos / n) * Math.PI * 2 - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const btn = document.createElement('div');
      btn.className = 'wheel-letter';
      btn.textContent = session.wheelLetters[letterIndex];
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      btn.dataset.index = letterIndex;
      el.wheel.appendChild(btn);
    });
    updateWheelVisuals();
  }

  function tileForIndex(index) {
    return el.wheel.querySelector(`.wheel-letter[data-index="${index}"]`);
  }

  function updateWheelVisuals() {
    el.wheel.querySelectorAll('.wheel-letter').forEach((t) => t.classList.remove('active'));
    session.path.forEach((i) => {
      const t = tileForIndex(i);
      if (t) t.classList.add('active');
    });
    drawWheelLines();
    renderCurrentWord();
  }

  function drawWheelLines() {
    const rect = el.wheel.getBoundingClientRect();
    el.wheelLines.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    let svg = '';
    if (session.path.length > 1) {
      const pts = session.path.map((i) => {
        const t = tileForIndex(i);
        const tr = t.getBoundingClientRect();
        return [tr.left - rect.left + tr.width / 2, tr.top - rect.top + tr.height / 2];
      });
      svg = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="rgba(58,111,143,0.85)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    el.wheelLines.innerHTML = svg;
  }

  function renderCurrentWord() {
    el.currentWord.innerHTML = '';
    session.path.forEach((i) => {
      const span = document.createElement('div');
      span.className = 'cw-letter';
      span.textContent = session.wheelLetters[i];
      el.currentWord.appendChild(span);
    });
  }

  function clearPath() {
    session.path = [];
    session.dragActive = false;
    session.dragMoved = false;
    updateWheelVisuals();
  }

  function addToPath(index) {
    if (session.path.includes(index)) return;
    session.path.push(index);
    updateWheelVisuals();
  }

  // ---------- Pointer interaction ----------
  let pointerDown = false;

  function letterFromPoint(x, y) {
    const target = document.elementFromPoint(x, y);
    if (!target) return null;
    const tile = target.closest('.wheel-letter');
    if (!tile) return null;
    return parseInt(tile.dataset.index, 10);
  }

  el.wheel.addEventListener('pointerdown', (e) => {
    const idx = letterFromPoint(e.clientX, e.clientY);
    if (idx === null) return;
    pointerDown = true;
    session.dragMoved = false;
    if (session.path.length && session.path[session.path.length - 1] === idx && session.path.length > 0 && !session.dragActive) {
      // tapping the last selected tile again submits (click-chain mode)
      submitWord();
      return;
    }
    if (!session.path.includes(idx)) {
      addToPath(idx);
    }
    session.dragActive = true;
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!pointerDown || !session || !session.dragActive) return;
    const idx = letterFromPoint(e.clientX, e.clientY);
    if (idx === null) return;
    if (!session.path.includes(idx)) {
      session.dragMoved = true;
      addToPath(idx);
    } else if (session.path.length > 1 && session.path[session.path.length - 2] === idx) {
      session.dragMoved = true;
      session.path.pop();
      updateWheelVisuals();
    }
  });

  window.addEventListener('pointerup', () => {
    if (!pointerDown) return;
    pointerDown = false;
    if (!session) return;
    if (session.dragMoved && session.path.length >= 1) {
      submitWord();
    } else {
      // simple tap: stay in click-chain mode, waiting for the next tap
      session.dragActive = false;
    }
  });

  // Tapping outside the wheel clears the current selection
  document.addEventListener('pointerdown', (e) => {
    if (!session) return;
    if (e.target.closest('.wheel') || e.target.closest('#hint-btn') || e.target.closest('#shuffle-btn')) return;
    if (session.path.length) clearPath();
  });

  // ---------- Word submission ----------
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.toast.classList.remove('show'), 1100);
  }

  function submitWord() {
    const word = session.path.map((i) => session.wheelLetters[i]).join('');
    const pathSnapshot = session.path;
    clearPath();

    if (word.length < 3) return;

    if (session.solved.has(word)) {
      showToast('Already found');
      return;
    }

    if (session.words.has(word)) {
      session.solved.add(word);
      autoSolveFixedPoint();
      refreshGridReveals();
      updateProgressLabel();
      showToast(word);
      checkWin();
    } else {
      el.currentWord.classList.add('shake');
      setTimeout(() => el.currentWord.classList.remove('shake'), 350);
    }
  }

  function autoSolveFixedPoint() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const word of session.words) {
        if (session.solved.has(word)) continue;
        const cellsForWord = session.layout.wordCells[word] || [];
        if (cellsForWord.length && cellsForWord.every((k) => isRevealed(k))) {
          session.solved.add(word);
          changed = true;
        }
      }
    }
  }

  // ---------- Hints ----------
  function updateHintUI() {
    el.hintBadge.textContent = progress.hints;
    el.hintBtn.disabled = progress.hints <= 0;
  }

  el.hintBtn.addEventListener('click', () => {
    if (progress.hints <= 0) {
      showToast('No hints left');
      return;
    }
    const unsolved = [...session.words].filter((w) => !session.solved.has(w));
    if (!unsolved.length) return;
    unsolved.sort((a, b) => a.length - b.length);
    let target = null, targetCell = null;
    for (const w of unsolved) {
      const cellsForWord = session.layout.wordCells[w];
      const missing = cellsForWord.find((k) => !isRevealed(k));
      if (missing) { target = w; targetCell = missing; break; }
    }
    if (!targetCell) return;
    session.hintReveals.add(targetCell);
    session.hintsUsed++;
    progress.hints--;
    saveProgress();
    autoSolveFixedPoint();
    refreshGridReveals();
    updateProgressLabel();
    updateHintUI();
    checkWin();
  });

  el.shuffleBtn.addEventListener('click', () => {
    session.wheelOrder = shuffledIndices(session.wheelLetters.length);
    clearPath();
    renderWheel();
  });

  // ---------- Win handling ----------
  function checkWin() {
    if (session.solved.size < session.words.size) return;
    const stars = session.hintsUsed === 0 ? 3 : session.hintsUsed === 1 ? 2 : 1;
    const prevStars = progress.stars[session.level.id] || 0;
    if (stars > prevStars) progress.stars[session.level.id] = stars;
    if (session.level.id === progress.unlocked && progress.unlocked < LEVELS.length) {
      progress.unlocked = session.level.id + 1;
    } else if (session.level.id === progress.unlocked && progress.unlocked === LEVELS.length) {
      progress.unlocked = session.level.id;
    }
    progress.hints = Math.min(progress.hints + 1, 9);
    saveProgress();

    setTimeout(() => showLevelComplete(stars), 500);
  }

  function showLevelComplete(stars) {
    el.modalStars.querySelectorAll('.star').forEach((s, i) => {
      s.classList.toggle('lit', i < stars);
    });
    el.modalSub.textContent = `You found all ${session.words.size} words.`;
    const chapter = chapterForLevel(session.level.id);
    const isLastInChapter = chapter.levels[chapter.levels.length - 1] === session.level.id;
    const isLastLevel = session.level.id === LEVELS.length;
    el.modalNextBtn.style.display = isLastLevel ? 'none' : '';
    el.completeModal.classList.remove('hidden');

    el.modalNextBtn.onclick = () => {
      el.completeModal.classList.add('hidden');
      if (isLastInChapter) {
        showChapterComplete(chapter);
      } else {
        startLevel(session.level.id + 1);
      }
    };
    el.modalMenuBtn.onclick = () => {
      el.completeModal.classList.add('hidden');
      showScreen('menu');
    };
  }

  function showChapterComplete(chapter) {
    const nextChapter = CHAPTERS[CHAPTERS.indexOf(chapter) + 1];
    el.chapterTitle.textContent = chapter.name + ' Complete';
    el.chapterSub.textContent = nextChapter
      ? `Onward to ${nextChapter.name}.`
      : "You've cleared every scene. Thanks for playing!";
    el.chapterModal.classList.remove('hidden');
    el.chapterMenuBtn.onclick = () => {
      el.chapterModal.classList.add('hidden');
      if (nextChapter) {
        startLevel(nextChapter.levels[0]);
      } else {
        showScreen('menu');
      }
    };
  }

  // ---------- Navigation ----------
  el.backBtn.addEventListener('click', () => showScreen('menu'));
  el.restartBtn.addEventListener('click', () => startLevel(session.level.id));

  window.addEventListener('resize', () => {
    if (session && !el.gameScreen.classList.contains('hidden')) {
      renderGrid();
    }
  });

  // ---------- Boot ----------
  showScreen('menu');
})();
