/* Omni Studio Premium Layer
 * A small, dependency-free interaction layer. It deliberately enhances the
 * existing workspace instead of replacing its editor or runtime.
 */
(() => {
  'use strict';
  const FOCUS_KEY = 'omni_focus_mode_v1';
  const q = selector => document.querySelector(selector);
  const toast = (message, ok = true) => { try { window.showToast?.(message, ok); } catch (_) {} };

  function setFocusMode(enabled) {
    document.body.classList.toggle('omni-focus-mode', enabled);
    try { localStorage.setItem(FOCUS_KEY, enabled ? '1' : '0'); } catch (_) {}
    q('#omni-focus-toggle')?.setAttribute('aria-pressed', String(enabled));
    q('#omni-focus-toggle')?.setAttribute('title', enabled ? 'Exit focus mode (Alt+Z)' : 'Focus mode (Alt+Z)');
    window.omniEditor?.refresh?.();
  }

  function toggleFocusMode() {
    setFocusMode(!document.body.classList.contains('omni-focus-mode'));
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) { toast('Full screen is not available in this browser', false); }
  }

  function createFocusControls() {
    const headerActions = q('header > div:last-child');
    if (!headerActions || q('#omni-focus-toggle')) return;
    const button = document.createElement('button');
    button.id = 'omni-focus-toggle';
    button.type = 'button';
    button.className = 'omni-focus-toggle';
    button.setAttribute('aria-label', 'Toggle focus mode');
    button.title = 'Focus mode (Alt+Z)';
    button.innerHTML = '<i class="fa-solid fa-expand"></i>';
    button.addEventListener('click', toggleFocusMode);
    headerActions.insertBefore(button, headerActions.firstChild);

    const exit = document.createElement('button');
    exit.type = 'button';
    exit.className = 'omni-focus-exit';
    exit.innerHTML = '<i class="fa-solid fa-compress"></i><span>Exit focus</span>';
    exit.addEventListener('click', toggleFocusMode);
    document.body.appendChild(exit);
  }

  function registerPremiumCommands() {
    const add = window.omniRegisterCommand;
    if (typeof add !== 'function') return;
    add('Toggle focus mode', 'Alt + Z', toggleFocusMode);
    add('Toggle full screen', 'F11', toggleFullscreen);
    add('Format Python code', 'Shift + Alt + F', () => window.formatPythonCode?.());
    add('Previous plot', '←', () => window.navigatePlot?.(-1));
    add('Next plot', '→', () => window.navigatePlot?.(1));
    add('Fit active plot', '', () => window.fitPlotToViewport?.());
    add('Open live studio homepage', '', () => window.open('https://shadow-wave.github.io/Omni-pro/', '_blank', 'noopener'));
    add('Copy share link', '', async () => {
      try { await navigator.clipboard.writeText(location.href); toast('Share link copied'); }
      catch (_) { toast('Unable to copy the share link', false); }
    });
  }

  function watchForUpdates() {
    if (!('serviceWorker' in navigator)) return;
    const announce = registration => {
      if (!registration.waiting || q('#omni-update-banner')) return;
      const banner = document.createElement('aside');
      banner.id = 'omni-update-banner';
      banner.className = 'omni-update-banner';
      banner.setAttribute('role', 'status');
      banner.innerHTML = '<strong>Omni Studio update ready</strong><br>Refresh when you are ready to use the latest version.<br><button type="button">Refresh now</button>';
      banner.querySelector('button').addEventListener('click', () => {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        location.reload();
      });
      document.body.appendChild(banner);
    };
    navigator.serviceWorker.getRegistration().then(registration => {
      if (!registration) return;
      announce(registration);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => { if (worker.state === 'installed') announce(registration); });
      });
    }).catch(() => {});
  }

  function bindKeyboard() {
    window.addEventListener('keydown', event => {
      if (event.altKey && event.key.toLowerCase() === 'z') { event.preventDefault(); toggleFocusMode(); }
      if (event.key === 'Escape' && document.body.classList.contains('omni-focus-mode') && !q('#omni-command-palette:not(.hidden)')) toggleFocusMode();
      const isTyping = event.target.closest?.('input, textarea, [contenteditable="true"], .CodeMirror');
      const plotOpen = q('#tab-plots.active');
      if (!isTyping && plotOpen && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        window.navigatePlot?.(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
  }

  function init() {
    createFocusControls();
    try { if (localStorage.getItem(FOCUS_KEY) === '1') setFocusMode(true); } catch (_) {}
    bindKeyboard();
    registerPremiumCommands();
    watchForUpdates();
    window.omniStudio = Object.assign(window.omniStudio || {}, { toggleFocusMode, toggleFullscreen });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
