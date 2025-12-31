# Developer Guide — Taskify Pro

This guide helps contributors understand how to work on and extend Taskify Pro.

Local setup
1. Clone or copy the repository to your machine.
2. Optionally run a local HTTP server (recommended):

```bash
python -m http.server 8000
# or
npx http-server -p 8000
```

3. Open `http://localhost:8000` in your browser.

Code structure
- `index.html` — landing page
- `login.html` — authentication UI
- `pages/` — app pages (dashboard, tasks, analytics, settings, profile)
- `js/` — page-specific JS and helpers
- `css/` — styles
- `assets/` — images, logos, icons

Editing guidelines
- Keep `TasksStore` as the single source of truth; modify it if you need task-related persistence behavior.
- When adding features that affect tasks, update `tasks-store.js` and call `saveTasks()` so subscribers update.
- For cross-page UI changes, prefer adding small modular helpers under `js/` and include them only where needed.

Adding a new task field
1. Update the task creation in `js/dashboard.js` (handleAddTask) to include the new field.
2. Update `TasksStore` if any special handling is required during `getTasks()` migration.
3. Update UI renderers in `js/task.js`, `js/dashboard.js`, and `js/analytics.js`.

Implementing drag-and-drop between columns (suggested)
- Use `dragstart`, `dragover`, `drop` events on `.task-card` and column containers.
- On `drop`, call `TasksStore.updateTaskStatus(id, newStatus)`.

Testing
- Manual testing steps are in `TODO.md` under "TESTING CHECKLIST". Run through login, add tasks, change status, export/import, and verify analytics.

Common tasks
- Clear local storage during development:

```javascript
localStorage.clear();
```

- Create test user via `login.html` signup, then login.

Contributing
- Fork the repo and open a PR with focused changes.
- Keep changes minimal and update docs if behavior changes (especially migration logic).

Future improvements to document
- Backend API + authentication
- Real push notifications and reminders
- Multi-user/team support
- Drag-and-drop task reordering
- Theme manager implementation

Contact
- For questions or design decisions, open an issue in the repo with details and screenshots.