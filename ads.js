/**
 * Placeholder interstitial ad slot, shown between levels so a real ad
 * network (AdMob, Unity Ads, etc.) can be wired in later without touching
 * game.js again - just replace the body of showInterstitial() with the SDK's
 * "show interstitial" call and invoke onDone() from its close/dismiss
 * callback instead of the timer below.
 */
(function () {
  'use strict';

  // Show a placeholder ad after every Nth level completed. 2 is a common,
  // not-too-intrusive cadence for free-to-play puzzle games; set to 1 to
  // show one after every level instead.
  const SHOW_EVERY_N_LEVELS = 2;
  const SKIP_DELAY_SECONDS = 3;

  const overlay = document.getElementById('ad-overlay');
  const closeBtn = document.getElementById('ad-close-btn');

  function maybeShowInterstitial(justCompletedLevelId, onDone) {
    if (!overlay || !closeBtn || justCompletedLevelId % SHOW_EVERY_N_LEVELS !== 0) {
      onDone();
      return;
    }
    showInterstitial(onDone);
  }

  function showInterstitial(onDone) {
    overlay.classList.remove('hidden');
    closeBtn.disabled = true;
    let remaining = SKIP_DELAY_SECONDS;
    closeBtn.textContent = `Continue (${remaining})`;
    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timer);
        closeBtn.disabled = false;
        closeBtn.textContent = 'Continue';
      } else {
        closeBtn.textContent = `Continue (${remaining})`;
      }
    }, 1000);

    closeBtn.onclick = () => {
      if (closeBtn.disabled) return;
      clearInterval(timer);
      overlay.classList.add('hidden');
      onDone();
    };
  }

  window.ZenAds = { maybeShowInterstitial };
})();
