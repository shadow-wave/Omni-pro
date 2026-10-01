# Omni-Studio Full Upgrade

This package upgrades the existing Omni-Studio without replacing its core editor/runtime architecture.

## Included
- `index.html` - existing app plus resilient Tailwind boot coordination and upgrade hooks.
- `omni-upgrade.js` - command palette, workspace snapshots, import/export, crash/session recovery, network indicator, diagnostics and PWA install handling.
- `critical.css` - startup shell styling independent of Tailwind to prevent an unstyled splash flash.
- `sw.js` - versioned offline-first service worker with safe precache and CDN runtime caching.
- `manifest.json` - PWA metadata and shortcuts.
- `UPGRADE-PLAN.md` - roadmap and validation checklist.

## Important
Keep the repository's existing `tailwind.js` file. It is the local Tailwind runtime used by the existing application and remains the first Tailwind source.

## GitHub Pages
Replace the corresponding files in the repository root. Keep `tailwind.js` and any existing application assets that are not listed in this package.

After deployment, do one hard refresh. If the previous service worker is still active, reload once more so `omni-studio-v6` takes control.
