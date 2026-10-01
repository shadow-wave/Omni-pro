# Omni Studio

An offline-first, browser-based Python learning environment. It pairs a focused CodeMirror editor with Pyodide, a terminal, plots, file tools, syntax feedback, a variable explorer, workspace recovery, and installable-PWA support.

## What is improved

- **Fast start:** NumPy, Pandas, Matplotlib and other optional packages are no longer loaded at boot. They load only when the learner imports them.
- **Automatic imports:** standard Pyodide packages load on demand; other compatible packages are installed through `micropip` when online. Installed browser assets are reused by the browser/service-worker cache.
- **Offline-first:** the app shell and previously used CDN assets are cached. It stays usable offline after one successful online visit.
- **Resilient interface:** local Tailwind is tried first, followed by two CDN fallbacks; the critical startup UI never depends on Tailwind.
- **Learning workflow:** run file/current line, AST syntax feedback, plots, virtual files, command palette (`Ctrl/Cmd+K`), snapshots, import/export and crash/session recovery.
- **Accessible, responsive UI:** keyboard-first controls, visible focus, reduced-motion support, mobile layout, and light fluent interactions.

## Run locally

Service workers and Pyodide must be served over HTTP (not by opening `index.html` directly). From this folder, run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`. For GitHub Pages, publish this folder at the repository root (or configure Pages for this folder).

## Offline behavior

1. Open the site once while online and wait for it to reach **Ready**.
2. Reload once so the service worker can control the page.
3. The app shell and assets already fetched from CDNs will be available offline.

A fresh, fully offline install cannot download Pyodide, CodeMirror, or packages. To make that scenario possible, vendor those upstream assets into an `assets/` folder and update the corresponding URLs in `index.html`; do not copy third-party files without reviewing their licences.

## Package installation

Writing `import numpy`, `import pandas as pd`, or `import matplotlib.pyplot as plt` loads the relevant Pyodide package only when necessary. Other imports attempt a `micropip` installation where Pyodide supports the package. Some PyPI distributions include native extensions and cannot run in WebAssembly; Omni Studio reports that clearly instead of silently failing.

Package installs fetch third-party code. For classroom or production deployments, restrict or allow-list package names before exposing the app to untrusted users.

## Deployment checklist

- Keep HTTPS enabled (GitHub Pages provides this).
- Do not commit secrets: this is a client-side application.
- Bump `CACHE_VERSION` in `sw.js` whenever release assets change.
- Test an initial online launch, an offline reload, a slow network, and a mobile browser.
- Review `SECURITY.md` before public deployment.

## Project files

`index.html` contains the application; `omni-upgrade.js` adds recovery and productivity features; `critical.css` styles the initial shell; `sw.js` provides caching; and `manifest.json` supplies PWA metadata.

## Licence

MIT for this repository’s original code. Third-party libraries retain their own licences.
