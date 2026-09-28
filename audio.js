/**
 * Background music for Zen Word: a single relaxing instrumental loop that
 * plays while a level is open, with a slow, gentle left-right drift in the
 * stereo field via the Web Audio API (not positional/HRTF audio - just a
 * wider, "breathing" stereo image instead of a flat, static center, closer
 * to how ambient relaxation apps use the term "spatial").
 *
 * Autoplay is blocked by browsers until a real user gesture, so playback is
 * requested lazily and retried on the next pointer/key interaction if an
 * earlier attempt was blocked - normal for any browser game with audio.
 */
(function () {
  'use strict';

  const MUTE_KEY = 'zenword_music_muted_v1';
  const FADE_SECONDS = 1.4;
  const TARGET_VOLUME = 0.55;
  const PAN_DEPTH = 0.35;
  const PAN_PERIOD_SECONDS = 45;

  let muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { /* storage unavailable */ }

  const audioEl = new Audio('audio/ambient.mp3');
  audioEl.loop = true;
  audioEl.preload = 'none';

  let ctx = null;
  let gainNode = null;
  let graphReady = false;
  let wantsPlaying = false;

  function buildGraph() {
    if (graphReady) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return; // no Web Audio support: audioEl still plays back plainly
    ctx = new Ctx();
    const sourceNode = ctx.createMediaElementSource(audioEl);
    gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    const panNode = ctx.createStereoPanner();

    const panLfo = ctx.createOscillator();
    panLfo.type = 'sine';
    panLfo.frequency.value = 1 / PAN_PERIOD_SECONDS;
    const panLfoGain = ctx.createGain();
    panLfoGain.gain.value = PAN_DEPTH;
    panLfo.connect(panLfoGain);
    panLfoGain.connect(panNode.pan);
    panLfo.start();

    sourceNode.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(ctx.destination);
    graphReady = true;
  }

  function fadeTo(value) {
    if (!graphReady) return;
    const now = ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(value, now + FADE_SECONDS);
  }

  function tryPlay() {
    if (muted || !wantsPlaying) return;
    buildGraph();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (!audioEl.paused) { fadeTo(TARGET_VOLUME); return; }
    audioEl.play().then(() => fadeTo(TARGET_VOLUME)).catch(() => { /* blocked until a user gesture; retried below */ });
  }

  function play() {
    wantsPlaying = true;
    tryPlay();
  }

  function pause() {
    wantsPlaying = false;
    if (!graphReady) { audioEl.pause(); return; }
    fadeTo(0);
    setTimeout(() => { if (!wantsPlaying) audioEl.pause(); }, FADE_SECONDS * 1000 + 100);
  }

  function setMuted(next) {
    muted = next;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ }
    if (muted) fadeTo(0);
    else if (wantsPlaying) tryPlay();
  }

  ['pointerdown', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, () => { if (wantsPlaying) tryPlay(); }, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (ctx && ctx.state === 'running') ctx.suspend();
    } else if (wantsPlaying && !muted) {
      tryPlay();
    }
  });

  window.ZenAudio = {
    play,
    pause,
    isMuted: () => muted,
    setMuted,
    toggleMuted: () => setMuted(!muted),
  };
})();
