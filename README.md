<div align="center">

# ⚡ Omni-Studio Pro
### Offline Computational Physics & Data Science Web Lab

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-3b82f6?style=for-the-badge&logo=pwa&logoColor=white)](https://shadow-wave.github.io/Omni-pro/)
[![Engine](https://img.shields.io/badge/Engine-Pyodide_WASM-6366f1?style=for-the-badge&logo=webassembly&logoColor=white)](https://pyodide.org/)
[![Stack](https://img.shields.io/badge/Stack-Pandas_•_NumPy_•_Matplotlib-10b981?style=for-the-badge&logo=python&logoColor=white)](https://shadow-wave.github.io/Omni-pro/)

<p align="center">
  A mobile-first, standalone browser IDE running real Python entirely on the client side via WebAssembly.<br>
  <b>Zero Server Dependency • Single-Download Offline Caching • Spyder IDE Ergonomics</b>
</p>

[🚀 **Launch Omni-Studio Pro**](https://shadow-wave.github.io/Omni-pro/)

---

</div>

## 🌟 Key Features

* ⚡ **Pure Client-Side Execution**: Powered by Pyodide (v0.23.4) WebAssembly kernel. Compiles and executes Python, NumPy, and Pandas code directly in the browser at near-native speed.
* 📦 **Complete Offline PWA**: Cache-first Service Worker (`sw.js`) stores the IDE shell, Pyodide core, and Python scientific packages locally after first launch.
* 🔍 **Real-Time Error Highlighting**: Live AST parsing detects syntax mistakes (unmatched brackets, missing colons) on keystroke and underlines them with Spyder-style wavy red indicators.
* 💡 **Intelligent Autocomplete (IntelliSense)**: Instant method popups for `np.`, `pd.`, `plt.`, and `df.` alongside automatic user-defined variable indexing.
* 📊 **Interactive Variable Explorer**: Inspect workspace variables, data types, dimensions, and values in real time with a dedicated Pandas DataFrame table viewer.
* ⚡ **Spyder F9 Line Execution**: Execute individual selected lines or single statement blocks without running the entire script.
* 📈 **Spyder-Style Plot Studio**: High-contrast rendering for Matplotlib figures with interactive viewports and one-tap PNG exports.
* 🗂️ **Virtual CSV Datasets Manager**: In-memory filesystem editor to create, edit, mount, and inspect `.csv` data directly through `pd.read_csv()`.

---

## 📚 University Lab Syllabus Modules

Omni-Studio comes pre-loaded with curated computational physics, general programming, and data science experiments complete with verified outputs:

| No. | Module Title | Technique / Core Method | Output Type |
|:---:|:---|:---|:---:|
| **01** | Arithmetic Operations | Float parsing, terminal input, fundamental math operators | Console Output |
| **02** | Sorting List of Numbers | Dynamic list generation, `list.append()`, `numbers.sort()` | Console Output |
| **03** | Even or Odd Checker | Modulo condition (`% 2 == 0`), branching control flow | Console Output |
| **04** | Factorial Calculation | Iterative product loop, boundary condition checking | Console Output |
| **05** | Prime Number Verification | Factor check with square-root optimization (`int(n**0.5) + 1`) | Console Output |
| **06** | Pandas Duplicate Detection | `df.duplicated()` boolean indexing and filtering | Console Output |
| **07** | Pandas Pivot Table | Multi-attribute aggregation with `pd.pivot_table()` | Console Output |
| **08** | DataFrame GroupBy Splitting | Categorical splitting using `student_data.groupby('school')` | Console Output |
| **09** | Comparative Bar Chart | Categorical visualization via `plt.bar()`, axis styling | Matplotlib Plot |
| **10** | Time Allocation Pie Chart | Proportional analysis via `plt.pie()`, explode, shadows | Matplotlib Plot |

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
