# ⚡ Omni-Studio Pro

> **Mobile-First Client-Side Python & Computational Lab with Spyder IDE Ergonomics**

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg)](https://shadow-wave.github.io/Omni-pro/)
[![Engine](https://img.shields.io/badge/Engine-Pyodide%20WASM-indigo.svg)](https://pyodide.org/)
[![Stack](https://img.shields.io/badge/Stack-Pandas%20%7C%20NumPy%20%7C%20Matplotlib-emerald.svg)](https://shadow-wave.github.io/Omni-pro/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A standalone, browser-based Python computational environment running real Python entirely on the client side via WebAssembly (Pyodide). Engineered with the look, feel, and ergonomics of **Spyder IDE** used in university physics & computational laboratories.

🚀 **Live Deployment:** [https://shadow-wave.github.io/Omni-pro/](https://shadow-wave.github.io/Omni-pro/)

---

## ✨ Key Spyder Features

- 🔍 **Real-Time Error Highlighting**: Dynamic AST syntax validation checks code as you type, rendering red wavy underlines and gutter warnings for missing colons, unbalanced brackets, or indentation errors.
- 💡 **Intelligent Autocomplete (IntelliSense)**:
  - Immediate dropdown suggestions for `np.` (NumPy), `pd.` (Pandas), `plt.` (Matplotlib), and `df.` (DataFrames).
  - Automatically indexes user-defined variables and functions for instant autocompletion.
- 📊 **Interactive Variable Explorer**: Inspect all active in-memory variables, data types, shapes, and values in a dedicated panel. Includes an interactive Data Viewer for Pandas DataFrames.
- ⚡ **F9 Line Execution**: Run single selected lines or cursor statements directly without executing the whole script.
- 📈 **High-DPI White Plot Engine**: Publication-grade Matplotlib plots rendered onto an isolated high-contrast canvas with one-tap PNG export.
- 💾 **Virtual CSV & Datasets Manager**: Built-in visual grid editor and file uploader to create, edit, mount, and export `.csv` datasets to the virtual memory filesystem (`pd.read_csv`).
- 📴 **100% Offline PWA**: Built with Service Worker cache-first architecture. Once loaded, it functions completely offline without an active internet connection.

---

## 📚 University Lab Syllabus Experiments

Pre-loaded with official Python & Data Science curriculum experiments, complete with verified record outputs:

| No. | Experiment Title | Core Concept / Method | Output Type |
|:---:|:---|:---|:---:|
| **01** | Arithmetic Operations | Floats, `input()`, Basic Operators (`+`, `-`, `*`, `/`) | Console Output |
| **02** | Sorting List of Numbers | Dynamic Input, `list.append()`, `numbers.sort()` | Console Output |
| **03** | Even or Odd Checker | Modulo Arithmetic (`% 2 == 0`), Conditional Branching | Console Output |
| **04** | Factorial Calculation | Iterative Loop Logic, Product Accumulation | Console Output |
| **05** | Prime Number Verification | Square Root Optimization (`int(n**0.5) + 1`), Break Logic | Console Output |
| **06** | Pandas Duplicate Detection | `df.duplicated()` Boolean Series Extraction | DataFrame Console |
| **07** | Pandas Regional Pivot Table | `pd.pivot_table(df, values='Sale', index='Region', aggfunc='sum')` | Aggregated Pivot |
| **08** | GroupBy School Categorization | `df.groupby('school')`, Multi-attribute splitting | Grouped Subsets |
| **09** | Comparative Bar Chart | `plt.bar()`, Axis Labels, `plt.grid(axis='y')` | Matplotlib Plot |
| **10** | Activity Distribution Pie Chart | `plt.pie(autopct='%1.1f%%', explode=..., shadow=True)`, Legend | Matplotlib Plot |

---

## 🛠️ Architecture
