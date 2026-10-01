# Omni-Studio Improvement Plan

## Delivered in this package
1. Tailwind local-first loading with jsDelivr and official CDN fallback.
2. Critical shell CSS so the app never depends on Tailwind to paint the initial splash.
3. Tailwind readiness coordinated with splash dismissal.
4. Versioned service-worker cache with safe precaching and stale-while-revalidate CDN caching.
5. Workspace snapshot history (last 12 snapshots).
6. Session/crash recovery through localStorage.
7. Workspace JSON import/export.
8. Command palette (`Ctrl/⌘+K`).
9. Network/cache status indicator.
10. Runtime diagnostics API: `window.omniStudio.diagnostics()`.
11. PWA install prompt handling.
12. Global error/rejection logging without changing existing execution behavior.
13. Reduced-motion accessibility handling.
14. Lazy scientific runtime: NumPy, Pandas and Matplotlib are loaded only on import.
15. Shared, de-duplicated automatic package loading with Pyodide-first and micropip fallback.
16. Explicit deployment and security documentation.
17. Idle-time warm-up for NumPy, Matplotlib/Pyplot, and Pandas, with slow-network and Data Saver protection.
18. Premium Plot Studio interactions: bounded plot history, responsive pan/zoom, accessible figure gallery, metadata, and safer resource cleanup.

## Next high-value phase
- Build a true static `tailwind.css` at build time, eliminating runtime Tailwind compilation.
- Vendor CodeMirror, Font Awesome and Pyodide assets where licensing/distribution permits.
- Move large persistent workspace data from localStorage to IndexedDB.
- Add named multi-file projects and folder persistence.
- Add test coverage for boot, offline reload, editor recovery, Python execution and plot rendering.

## Validation checklist
- First online load.
- Reload with network disabled after service-worker cache is warm.
- Laptop/desktop Chrome.
- Android Chrome.
- iPad Safari/Chrome.
- Run Python, NumPy, Pandas and Matplotlib examples.
- Test Ctrl/⌘+K, Ctrl/⌘+Enter, Ctrl/⌘+Shift+S and F1.
- Import/export a workspace.
- Restore after a forced reload.
- Confirm existing UI and split-pane behavior are unchanged.
