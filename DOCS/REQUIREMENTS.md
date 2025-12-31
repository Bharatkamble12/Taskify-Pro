# Requirements & Installation — Taskify Pro

This file lists the minimal tools and optional utilities to run and develop Taskify Pro.

System requirements
- Modern desktop browser (Chrome, Edge, Firefox, Safari) — required.
- Node.js (v14+) — recommended for running the included `server.js` static server.
- Python 3 (optional) — alternative quick HTTP server via `python -m http.server`.
- A code editor (recommended: Visual Studio Code).

Project dependencies
- The app is mostly static and uses Chart.js for charts via CDN (already included in `pages/analytics.html`). No npm packages are required to run the app.

Recommended installation steps
1. Install Node.js (if you want to run `server.js`):

   - Download from https://nodejs.org/ and follow platform instructions.
   - Verify with:

```powershell
node -v
npm -v
```

2. (Optional) Install `http-server` globally for quick serving:

```powershell
npm install -g http-server
# then run
http-server -p 8000
```

3. (Optional) Use Python 3 built-in server:

```powershell
python -m http.server 8000
```

How to run the included Node static server
- From the project root run:

```powershell
node server.js
```

- Visit: http://localhost:8000

Notes
- Chart.js is loaded from CDN in `pages/analytics.html` and requires an HTTP(S) context for correct operation in some browsers; serving over `http://localhost` is recommended vs file://.
- No additional `npm install` step is required unless you add server-side or build tooling.
- If `node server.js` fails, ensure Node is installed and that you run the command from the project root where `server.js` exists.