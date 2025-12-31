# Run Instructions — Taskify Pro

These instructions assume a local filesystem environment. No build step is required — the app is static and runs in the browser.

Quick start (open locally)
1. Open `index.html` in your browser to view the landing page.
2. To use the app pages, open the HTML files under the `pages/` folder (e.g., `pages/dashboard.html`).

Authentication flow
- Use `login.html` to sign up a new account (stored in `localStorage`) and then login.
- After login, `currentUser` is saved to `localStorage` and pages redirect to `pages/dashboard.html`.

Notes for cross-page behavior
- `js/tasks-store.js` is a small library that reads and writes tasks to `localStorage` under the `tasks` key. It exposes: `getTasks()`, `saveTasks()`, `addTask()`, `updateTaskStatus()`, `deleteTask()`, `subscribe()`.
- Analytics and dashboard pages subscribe to `TasksStore` to update charts and summaries in real time.

Optional: serve via a simple HTTP server (recommended for Chart.js and file APIs)
- Using Python 3:

```bash
python -m http.server 8000
```

- Using Node (http-server):

```bash
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

Troubleshooting
- If pages redirect to `login.html`, ensure `localStorage.currentUser` exists.
- If charts or file import/export fail, serve the files over HTTP instead of `file://`.

Security
- This is a frontend prototype. Do not store sensitive data or use it in production without a backend and secure authentication.

Requirements & installation
- See `DOCS/REQUIREMENTS.md` for platform requirements and installation steps (Node.js, optional Python and http-server, commands to run `server.js`).

Quick server commands
- Run the included Node static server:

```powershell
node server.js
```

- Or serve with Python 3 (optional):

```powershell
python -m http.server 8000
```

Or run `http-server` if you installed it globally:

```powershell
http-server -p 8000
```