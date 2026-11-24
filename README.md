# madebyfwd.com

Portfolio of apps by **fwdworks** (fwdworks.io). Plain static site: no build step.

- `index.html` holds the whole page. Each app is one `<a class="app">` block; copy one to add an app.
- `styles.css` holds the look (wmojito-overview style: lime marker, hand-drawn underline, Caveat Brush asides).
- `assets/logos/` holds the app logos.

Preview: `python3 -m http.server` then open http://localhost:8000.
Deploy: any static host (Cloudflare Pages, Netlify, GitHub Pages). Point it at this folder.

## Style helpers
- `<span class="marker">text</span>` lime highlighter
- `<span class="mark">word<svg aria-hidden="true"><use href="#underline"/></svg></span>` hand-drawn underline
- `<p class="hand">…</p>` handwritten aside
- `<span class="pill live|beta|idea"><span class="dot"></span>Label</span>` status pill
