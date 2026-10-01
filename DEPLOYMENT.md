# Deployment guide

## GitHub Pages

1. Create a repository and copy every file in this folder to its publishing root.
2. In GitHub **Settings → Pages**, choose the branch and `/ (root)` folder.
3. Enable HTTPS and open the published site once online.
4. Hard-refresh once after deploying a new release so the browser receives the updated service worker.

## Local development

Use a local HTTP server; browsers intentionally disable service-worker features for plain file URLs.

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Versioning cache releases

When changing an app-shell file, update the two version constants at the top of `sw.js`. This lets existing installations discard the previous cache cleanly.

## CDN and local fallbacks

The interface tries `./tailwind.js`, then configured CDN mirrors. If your existing repository already includes `tailwind.js`, retain it for local-first startup. CodeMirror and Pyodide are cached after a successful online load. For a no-network-first-install deployment, download and legally vendor their official distributable files, then point the URLs in `index.html` at your local `assets/` copies.
