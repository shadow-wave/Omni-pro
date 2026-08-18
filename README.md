<div align="center">

  # ⚡ Omni-Studio Pro
  ### Offline Computational Physics & Data Science Web Lab

  [![PWA Ready](https://img.shields.io/badge/PWA-Installable-6366f1?style=for-the-badge&logo=pwa&logoColor=white)](https://shadow-wave.github.io/Omni-pro/)
  [![WebAssembly](https://img.shields.io/badge/Engine-Pyodide_WASM-3b82f6?style=for-the-badge&logo=webassembly&logoColor=white)](https://pyodide.org/)
  [![Pandas & NumPy](https://img.shields.io/badge/Stack-Pandas_%7C_NumPy_%7C_Matplotlib-10b981?style=for-the-badge&logo=python&logoColor=white)](https://pandas.pydata.org/)
  [![Live Demo](https://img.shields.io/badge/Demo-Live_GitHub_Pages-a855f7?style=for-the-badge&logo=github&logoColor=white)](https://shadow-wave.github.io/Omni-pro/)

  <p align="center">
    <b>A mobile-first, standalone browser IDE running real Python entirely on the client side via WebAssembly.</b>
    <br />
    <i>Zero Server Dependency • Single-Download Offline Caching • Spyder-Style White Plot Engine</i>
  </p>

  <a href="https://shadow-wave.github.io/Omni-pro/">
    <img src="https://img.shields.io/badge/🚀_LAUNCH_OMNI--STUDIO-4f46e5?style=for-the-badge&labelColor=030305" height="42"/>
  </a>

</div>

---

## 🌟 Key Features

* **⚡ Pure Client-Side Execution:** Powered by Pyodide (v0.23.4) WebAssembly kernel. Compiles and executes Python code directly in the browser with near-native speed.
* **📦 Complete Offline PWA:** Implements a Service Worker cache-first layer (`sw.js`) that downloads WASM binaries and packages once. Works seamlessly without an active internet connection.
* **📊 Spyder IDE High-Contrast Visualizer:** Renders crisp, publication-grade Matplotlib & Pandas figures on a dedicated high-DPI pure white background canvas card.
* **📱 Mobile-First Ergonomics:** Built with fixed viewport height (`100dvh`), iOS/Android safe-area notch compensation, and an interactive virtual touch accessory bar for rapid Python syntax entry.
* **💾 Virtual File System (Emscripten FS):** Mount, read, and process real `.csv`, `.txt`, and data files locally directly via `pandas.read_csv()`.
* **⌨️ Non-Blocking Stream Input:** Replaces intrusive browser dialogs with an async glassmorphism input modal directly tied into the Python event loop.

---

## 🔬 Physics & Data Science Syllabus Modules

Omni-Studio comes pre-loaded with curated computational physics experiments and Pandas data wrangling presets:

| No. | Module Title | Description / Technique |
| :---: | :--- | :--- |
| **01** | **DataFrame Creation & Summary** | Pandas dictionary ingestion, indexing, and `.describe()` statistical profiling |
| **02** | **CSV Data Wrangling** | Virtual memory CSV extraction and calculated feature derivation |
| **03** | **Boolean Querying & Masking** | Multi-condition conditional filtering and matrix slicing |
| **04** | **GroupBy & Statistical Aggregation** | Categorical splitting and multi-parameter group evaluations |
| **05** | **RC Circuit Voltage Discharge** | Time-series exponential decay curve modeling (`df.plot()`) |
| **06** | **Comparative Bar Charts** | Grouped and stacked multi-column comparative analytics |
| **07** | **Hooke's Law Verification** | Scatter distribution mapping with NumPy least-squares regression line fit |
| **08** | **Batch Distribution Histograms** | Multi-subplot comparative frequency distribution analysis |
| **PHY** | **Damped Harmonic Oscillator** | Analytical modeling of underdamped oscillations ($y = e^{-\gamma t}\sin(\omega t)$) |
| **PHY** | **Projectile Motion ODE** | Numerical trajectory integration incorporating quadratic air drag (Euler method) |

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
    A[Browser / Mobile PWA] --> B[Service Worker Cache - sw.js]
    B --> C[Pyodide WebAssembly Kernel]
    C --> D[NumPy / Pandas Engine]
    C --> E[Matplotlib Agg Backend]
    C --> F[Emscripten Virtual FS]
    E --> G[High-DPI Base64 Image Stream]
    G --> H[Spyder White Canvas Viewport]
