/* Omni-Studio Upgrade Layer
 * Non-invasive productivity, recovery, diagnostics and PWA enhancements.
 * The existing editor/runtime remains the source of truth.
 */
(() => {
  'use strict';
  const VERSION = 'omni-upgrade-2026.10.01';
  const STORAGE = {
    snapshots: 'omni_snapshots_v1',
    lastSession: 'omni_last_session_v1',
    settings: 'omni_upgrade_settings_v1'
  };

  const state = { deferredInstall: null, commandOpen: false, autosaveTimer: null };

  const qs = (s) => document.querySelector(s);
  const editor = () => window.omniEditor || null;
  const safeToast = (msg, ok = true) => {
    try { if (typeof window.showToast === 'function') window.showToast(msg, ok); } catch (_) {}
  };

  function currentCode() {
    const e = editor();
    return e && typeof e.getValue === 'function' ? e.getValue() : (qs('#code-editor')?.value || '');
  }

  function setCode(code) {
    const e = editor();
    if (e && typeof e.setValue === 'function') { e.setValue(code); e.focus(); return; }
    const ta = qs('#code-editor');
    if (ta) ta.value = code;
  }

  function getSession() {
    return {
      version: 1,
      app: 'Omni-Studio',
      savedAt: new Date().toISOString(),
      filename: qs('#active-filename')?.textContent?.trim() || 'script.py',
      code: currentCode()
    };
  }

  function saveLastSession(reason = 'autosave') {
    try {
      const session = getSession();
      session.reason = reason;
      localStorage.setItem(STORAGE.lastSession, JSON.stringify(session));
    } catch (_) {}
  }

  function loadSnapshots() {
    try { return JSON.parse(localStorage.getItem(STORAGE.snapshots) || '[]'); }
    catch (_) { return []; }
  }

  function saveSnapshot() {
    const session = getSession();
    const list = loadSnapshots();
    list.unshift({ ...session, id: crypto?.randomUUID?.() || String(Date.now()) });
    localStorage.setItem(STORAGE.snapshots, JSON.stringify(list.slice(0, 12)));
    safeToast('Workspace snapshot saved');
  }

  function restoreLatestSnapshot() {
    const list = loadSnapshots();
    if (!list.length) { safeToast('No workspace snapshots yet', false); return; }
    const latest = list[0];
    setCode(latest.code || '');
    const name = qs('#active-filename');
    if (name && latest.filename) name.textContent = latest.filename;
    saveLastSession('restore');
    safeToast('Latest workspace restored');
  }

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify(getSession(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(qs('#active-filename')?.textContent?.trim() || 'omni-workspace').replace(/[^a-z0-9._-]+/gi, '_')}.omni.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    safeToast('Workspace exported');
  }

  function importWorkspace() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,.omni.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || typeof data.code !== 'string') throw new Error('Invalid Omni workspace');
          setCode(data.code);
          if (data.filename && qs('#active-filename')) qs('#active-filename').textContent = data.filename;
          saveLastSession('import');
          safeToast('Workspace imported');
        } catch (err) { console.error(err); safeToast('Invalid workspace file', false); }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function addStatusPill() {
    if (qs('#omni-network-pill')) return;
    const pill = document.createElement('button');
    pill.id = 'omni-network-pill';
    pill.type = 'button';
    pill.className = 'omni-network-pill';
    pill.title = 'Omni-Studio connection and cache status';
    pill.innerHTML = '<span class="omni-dot"></span><span class="omni-network-text">Online</span>';
    const header = qs('#status-text')?.parentElement?.parentElement || qs('#status-text')?.parentElement;
    if (header) header.appendChild(pill); else document.body.appendChild(pill);
    updateNetworkPill();
  }

  function updateNetworkPill() {
    const pill = qs('#omni-network-pill'); if (!pill) return;
    const offline = !navigator.onLine;
    pill.classList.toggle('offline', offline);
    const text = pill.querySelector('.omni-network-text');
    if (text) text.textContent = offline ? 'Offline cache' : 'Online';
  }

  function createCommandPalette() {
    if (qs('#omni-command-palette')) return;
    const wrap = document.createElement('div');
    wrap.id = 'omni-command-palette';
    wrap.className = 'fixed inset-0 z-[250] hidden items-start justify-center bg-black/65 backdrop-blur-sm p-4 sm:p-16';
    wrap.innerHTML = `
      <div class="omni-command-card w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b11]/95 shadow-2xl">
        <div class="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <i class="fa-solid fa-terminal text-indigo-400"></i>
          <input id="omni-command-input" class="min-w-0 flex-1 bg-transparent outline-none text-sm text-white" placeholder="Type a command..." autocomplete="off">
          <kbd>Esc</kbd>
        </div>
        <div id="omni-command-list" class="max-h-[55vh] overflow-auto p-2"></div>
      </div>`;
    document.body.appendChild(wrap);
    const input = qs('#omni-command-input');
    const commands = [
      ['Run Python', 'Ctrl/⌘ + Enter', () => window.runCode?.()],
      ['Run current line', 'Shift + Enter', () => window.runSelectedOrCurrentLine?.()],
      ['Toggle split view', 'Alt + S', () => window.toggleSplitViewMode?.()],
      ['Save workspace snapshot', '', saveSnapshot],
      ['Restore latest snapshot', '', restoreLatestSnapshot],
      ['Export workspace', '', exportWorkspace],
      ['Import workspace', '', importWorkspace],
      ['Focus editor', '', () => editor()?.focus?.()],
      ['Show keyboard shortcuts', 'F1', () => window.openShortcutsModal?.()],
      ['Clear terminal', '', () => window.clearTerminal?.()],
      ['Reload app', '', () => location.reload()]
    ];
    let visibleCommands = commands;
    let activeCommand = 0;
    const render = (filter = '') => {
      const list = qs('#omni-command-list');
      list.innerHTML = '';
      visibleCommands = commands.filter(c => c[0].toLowerCase().includes(filter.toLowerCase()));
      activeCommand = Math.max(0, Math.min(activeCommand, visibleCommands.length - 1));
      visibleCommands.forEach((cmd, index) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'omni-command-item';
        b.dataset.commandIndex = index;
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', String(index === activeCommand));
        if (index === activeCommand) b.classList.add('omni-command-active');
        b.innerHTML = `<span>${cmd[0]}</span><kbd>${cmd[1] || ''}</kbd>`;
        b.onclick = () => { closePalette(); cmd[2](); };
        list.appendChild(b);
      });
    };
    const openPalette = () => { state.commandOpen = true; activeCommand = 0; wrap.classList.remove('hidden'); wrap.classList.add('flex'); render(); input.value=''; setTimeout(() => input.focus(), 0); };
    const closePalette = () => { state.commandOpen = false; wrap.classList.add('hidden'); wrap.classList.remove('flex'); };
    window.omniOpenCommandPalette = openPalette;
    window.omniCloseCommandPalette = closePalette;
    window.omniRegisterCommand = (name, shortcut, action) => {
      if (typeof name !== 'string' || typeof action !== 'function') return false;
      commands.push([name, shortcut || '', action]);
      return true;
    };
    input.addEventListener('input', () => { activeCommand = 0; render(input.value); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closePalette(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        activeCommand = Math.max(0, Math.min(visibleCommands.length - 1, activeCommand + (e.key === 'ArrowDown' ? 1 : -1)));
        render(input.value);
        qs(`#omni-command-list button[data-command-index="${activeCommand}"]`)?.scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') qs(`#omni-command-list button[data-command-index="${activeCommand}"]`)?.click();
    });
    wrap.addEventListener('pointerdown', e => { if (e.target === wrap) closePalette(); });
  }

  function installPWA() {
    if (state.deferredInstall) {
      state.deferredInstall.prompt();
      state.deferredInstall.userChoice.finally(() => { state.deferredInstall = null; });
      return;
    }
    safeToast('Use the browser menu to install Omni-Studio');
  }

  function bindKeyboard() {
    window.addEventListener('keydown', e => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); window.omniOpenCommandPalette?.(); }
      if (mod && e.key.toLowerCase() === 's' && !e.shiftKey) { e.preventDefault(); saveLastSession('shortcut'); }
      if (mod && e.shiftKey && e.key.toLowerCase() === 's') { e.preventDefault(); exportWorkspace(); }
      if (state.commandOpen && e.key === 'Escape') window.omniCloseCommandPalette?.();
    });
  }

  function bindRecovery() {
    const schedule = () => {
      clearTimeout(state.autosaveTimer);
      state.autosaveTimer = setTimeout(() => saveLastSession('debounced'), 650);
    };
    const attach = () => {
      const e = editor(); if (!e || e.__omniUpgradeBound) return;
      e.__omniUpgradeBound = true;
      e.on('change', schedule);
      window.addEventListener('pagehide', () => saveLastSession('pagehide'), { once: false });
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveLastSession('background'); });
    };
    setTimeout(attach, 0);
    setTimeout(attach, 1200);
  }

  function diagnostics() {
    const checks = [
      ['Service Worker', 'serviceWorker' in navigator],
      ['Local Storage', (() => { try { localStorage.setItem('__omni_test','1'); localStorage.removeItem('__omni_test'); return true; } catch (_) { return false; } })()],
      ['IndexedDB', 'indexedDB' in window],
      ['WebAssembly', typeof WebAssembly !== 'undefined'],
      ['Online', navigator.onLine],
      ['Tailwind loader', !!window.__omniTailwindReady],
      ['CodeMirror', !!window.omniEditor],
      ['Pyodide loader', typeof window.loadPyodide === 'function']
    ];
    console.table(checks.map(([name, ok]) => ({ Check: name, Status: ok ? 'OK' : 'Unavailable' })));
    safeToast('Diagnostics written to console');
  }

  function exposeApi() {
    window.omniStudio = Object.assign(window.omniStudio || {}, {
      version: VERSION,
      saveSnapshot, restoreLatestSnapshot, exportWorkspace, importWorkspace,
      openCommandPalette: () => window.omniOpenCommandPalette?.(),
      diagnostics
    });
  }

  function init() {
    createCommandPalette(); addStatusPill(); bindKeyboard(); bindRecovery(); exposeApi();
    window.addEventListener('online', updateNetworkPill);
    window.addEventListener('offline', updateNetworkPill);
    window.addEventListener('error', e => console.error('[Omni-Studio runtime]', e.error || e.message));
    window.addEventListener('unhandledrejection', e => console.error('[Omni-Studio promise]', e.reason));
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); state.deferredInstall = e; });
    if (location.hash === '#syllabus') setTimeout(() => window.openSyllabus?.(), 500);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => safeToast('Omni-Studio updated'));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
