# Contributing to Omni Studio

Thank you for helping make Python learning feel effortless.

## Design principles

1. **Fast on ordinary devices.** Avoid eager downloads, unnecessary re-renders, and heavy dependencies.
2. **Calm, not crowded.** Every new control needs a clear learning benefit; prefer the command palette for secondary actions.
3. **Offline-aware.** A feature must fail clearly and gracefully on a slow or unavailable connection.
4. **Accessible by default.** Preserve keyboard access, focus visibility, contrast, and reduced-motion support.
5. **Safe in the browser.** Never add secrets; treat package installation and user code as untrusted input.

## Before opening a pull request

- Test an initial online launch and a cached offline reload.
- Test desktop and narrow/mobile layouts.
- Verify <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd>, the command palette, focus mode, import/export, and Python execution.
- Bump the service-worker cache version if an app-shell asset changes.
- Keep changes small, focused, and documented.

## Development

Serve the project over HTTP:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. Do not test service-worker behavior from a `file://` URL.

## Pull-request style

Use a short descriptive title, explain the user-visible result, and attach screenshots for UI changes. Note any package, caching, accessibility, or offline impact.
