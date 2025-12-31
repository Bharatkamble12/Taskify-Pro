# Architecture — Taskify Pro

Overview
- Client-side static app using plain HTML/CSS/JS. No server required for basic functionality.
- Data persistence via `localStorage` using a consistent key shape for `currentUser`, `tasks`, and `settings`.
- Pages communicate through a shared global helper `TasksStore` which reads/writes `tasks` and exposes a `subscribe()` mechanism for UI sync.

Data model (tasks)
- id: string | number
- title: string
- description: string (optional)
- priority: 'low' | 'medium' | 'high'
- dueDate: ISO date string (optional)
- status: 'todo' | 'in-progress' | 'completed'
- createdAt: ISO date string
- completedAt: ISO date string (optional)

Core components
- TasksStore (`js/tasks-store.js`): single source of truth for task data across pages. Handles migrations (adds `completedAt` if missing), notifies subscribers, and persists to `localStorage`.
- Auth (`js/auth.js` + `login.html`): lightweight user management stored in `localStorage.users` and `localStorage.currentUser`.
- Dashboard (`js/dashboard.js` + `pages/dashboard.html`): aggregates stats and shows recent tasks. Uses TasksStore subscribe for live updates.
- Tasks page (`js/task.js` + `pages/tasks.html`): Kanban UI rendering, filters, and per-task actions (start, complete, delete).
- Analytics (`js/analytics.js` + `pages/analytics.html`): builds charts (Chart.js expected) and heatmap; reads `completedAt` for activity.
- Settings (`js/settings.js` + `pages/settings.html`): profile, notifications, import/export (JSON), clear data.
- Desktop-only (`js/desktop-only.js`): blocks app pages when window width <= 768px.

Eventing & sync
- `TasksStore.subscribe(fn)` registers in-window listeners and `TasksStore` also reacts to `storage` events so changes in other tabs/windows propagate.

Import/Export
- `settings.js` implements `handleExportData()` that packages `currentUser`, `tasks`, and `settings` into a JSON file for download.
- `handleImportData()` validates file shape and replaces local data after confirmation.

Limitations and extension points
- Theme manager is referenced but missing; a `ThemeManager` implementation can be added to toggle CSS classes and persist choice.
- Drag-and-drop between columns can be added using the HTML5 Drag and Drop API or a small library.
- Replace `localStorage` with a backend API for multi-device sync and secure auth.

Diagram (text)
- Browser
  - pages/*.html
  - js/*.js
    - TasksStore (localStorage) <--> pages (subscribe/save)
    - Auth (localStorage users & currentUser)

Notes for contributors
- Keep `TasksStore` as the single source of truth.
- Use ISO strings for dates to ensure cross-browser behavior.
- Validate imported JSON before applying.