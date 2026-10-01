<div align="center">

# ⚡ Omni Studio

### A beautiful, offline-first Python learning studio — in your browser and on Android.

[![Live Studio](https://img.shields.io/badge/Launch-Live%20Studio-6d5dfc?style=for-the-badge&logo=googlechrome&logoColor=white)](https://shadow-wave.github.io/Omni-pro/)
[![Android APK](https://img.shields.io/badge/Download-Android%20APK-34a853?style=for-the-badge&logo=android&logoColor=white)](https://github.com/shadow-wave/Omni-pro/releases/download/v1.0.0/Omni-Studio.apk)
[![Release](https://img.shields.io/github/v/release/shadow-wave/Omni-pro?display_name=tag&style=for-the-badge&color=ff6b35)](https://github.com/shadow-wave/Omni-pro/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/License-MIT-0ea5e9?style=for-the-badge)](LICENSE)

**[Launch the web app](https://shadow-wave.github.io/Omni-pro/)** · **[Download Android APK](https://github.com/shadow-wave/Omni-pro/releases/download/v1.0.0/Omni-Studio.apk)** · **[Read deployment guide](DEPLOYMENT.md)** · **[Report a security issue](SECURITY.md)**

</div>

---

## Learn Python without the setup tax

Omni Studio is a focused Python learning environment for students, explorers, and computational projects. Open it, write Python, run it — no local Python installation, terminal configuration, or separate package setup required.

It runs Python through **Pyodide/WebAssembly** inside the browser, pairing a premium dark workspace with an interactive editor, terminal, plots, files, code feedback, recovery tools, and an installable app experience.

> [!TIP]
> For the fastest experience, use the [web studio](https://shadow-wave.github.io/Omni-pro/) once while online. After the initial cache is ready, Omni Studio can reopen offline with previously fetched runtime assets.

## Choose your workspace

| Web Studio | Android App |
| :--- | :--- |
| [Open Omni Studio →](https://shadow-wave.github.io/Omni-pro/) | [Download `Omni-Studio.apk` →](https://github.com/shadow-wave/Omni-pro/releases/download/v1.0.0/Omni-Studio.apk) |
| No install. Works on modern desktop and mobile browsers. | Official Android build, version **v1.0.0**. |
| Install from your browser menu for a PWA-like experience. | Download only from the [official release](https://github.com/shadow-wave/Omni-pro/releases/tag/v1.0.0). |

## Why Omni Studio feels different

| ⚡ Fast by default | 🧠 Built for learning | 📦 Packages on demand |
| :--- | :--- | :--- |
| The base Python runtime starts first. Heavy scientific tools do not delay every launch. | Run a file or current line, view syntax feedback, inspect variables, use the terminal, and explore virtual files in one calm workspace. | Write `import numpy`, `import pandas as pd`, or `import matplotlib.pyplot as plt`. Omni Studio loads what is needed when it is needed. |

| 📊 From code to insight | 🛟 Never lose your work | 📡 Online or cached offline |
| :--- | :--- | :--- |
| Matplotlib output appears in the built-in Plot Studio. Save or inspect generated work without switching applications. | Automatic session recovery, workspace snapshots, and JSON import/export help you keep moving after an accidental refresh. | Local-first styling, CDN fallbacks, and a service-worker cache make the experience resilient on unreliable connections. |

## Your first minute

1. **Launch** the [web studio](https://shadow-wave.github.io/Omni-pro/) or install the [Android APK](https://github.com/shadow-wave/Omni-pro/releases/download/v1.0.0/Omni-Studio.apk).
2. Paste a small program, then press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to run it.
3. Import a library when you need it. The first import may take a moment; later use is cached where the browser permits.
4. Open the command palette with <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> for snapshots, import/export, shortcuts, and more.

```python
import pandas as pd
import matplotlib.pyplot as plt

scores = pd.DataFrame({"Student": ["Asha", "Noah", "Maya"], "Score": [92, 87, 96]})
print(scores)

scores.plot(x="Student", y="Score", kind="bar", legend=False, color="#6366f1")
plt.title("Python is ready")
plt.show()
```

## Feature tour

- **Smart Python runtime** — browser-based Python with WebAssembly, stdout terminal output, error feedback, and asynchronous `input()` support.
- **Clean code workspace** — CodeMirror editor with line numbers, active-line styling, bracket completion, syntax status, and keyboard shortcuts.
- **Scientific learning tools** — on-demand NumPy, Pandas, Matplotlib, SciPy and compatible PyPI packages through `micropip`.
- **Plot Studio** — view generated charts inside the app, with image/SVG output actions.
- **Virtual files** — import files into the Python filesystem, inspect them, and download generated results.
- **Recovery built in** — debounced autosave, crash/session recovery, snapshots, workspace JSON import/export.
- **Offline-first PWA** — installable manifest, service worker, local-first Tailwind loading, safe cache updates, and online/offline status.
- **Designed with care** — responsive layout, keyboard-first navigation, visible focus states, reduced-motion support, and fluent micro-interactions.

## Performance philosophy

Omni Studio deliberately avoids loading every data-science package during startup. The runtime loads **only the package your current program imports**, keeps concurrent requests de-duplicated, and lets the browser reuse cached downloads. That means a basic Python exercise starts faster while advanced notebooks still have the libraries they need.

Not every PyPI package can run in a browser: packages requiring unsupported native binaries may fail in WebAssembly. Omni Studio shows a clear terminal message in that case.

## Offline, privacy, and safety

- The Python runtime executes in the browser’s WebAssembly sandbox; it does not install or run Python on the host machine.
- Once the app shell and relevant assets have been cached by a successful online visit, they can be reused offline.
- A first-ever offline launch cannot fetch Pyodide or a new package. Connect once to prepare those assets.
- Do not store passwords, API keys, or private data in client-side code or browser storage.
- Installing arbitrary packages retrieves third-party code. Classroom and public deployments should use an allow-list policy.

Read the full [security policy](SECURITY.md) before a public deployment.

## Run from source

Clone or download this repository, then serve it over HTTP — opening `index.html` directly prevents service-worker features from working correctly.

```bash
python -m http.server 8080
```

Open `http://localhost:8080` in a modern browser. GitHub Pages deployment is already supported; see [DEPLOYMENT.md](DEPLOYMENT.md) for the release checklist and local/CDN fallback details.

## Keyboard shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> | Run current program |
| <kbd>Shift</kbd> + <kbd>Enter</kbd> | Run selected text or current line |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> | Open command palette |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd> | Save recovery session |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> | Export workspace |
| <kbd>F1</kbd> | Show shortcuts |

## Project guide

| File | Purpose |
| :--- | :--- |
| `index.html` | Main learning environment and browser runtime integration |
| `omni-upgrade.js` | Command palette, recovery, diagnostics, PWA UX, and workspace tools |
| `critical.css` | Fast, dependency-free startup styling and accessibility polish |
| `sw.js` | Versioned offline-first service worker and runtime cache |
| `manifest.json` | Installable PWA metadata |

## Contributing and licence

Ideas, bug reports, and improvements are welcome. Keep changes fast on lower-powered devices, accessible by keyboard, and safe for a browser-hosted learning environment.

This repository’s original code is available under the [MIT License](LICENSE). Pyodide, CodeMirror, Tailwind, and other third-party dependencies retain their own licences.

<div align="center">

**If Omni Studio helps you learn, please consider starring the repository.**

Made for curious Python learners. ✨

</div>
