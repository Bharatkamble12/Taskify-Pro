# Taskify Pro — Project Overview

Taskify Pro is a client-side task and productivity management web application built with vanilla HTML, CSS, and JavaScript. It provides a desktop-optimized experience with features for managing tasks in a Kanban-style board, analytics, user authentication (frontend), settings, and data import/export via JSON backups.

Key features
- Landing page with hero, features, preview and CTAs
- Frontend authentication: signup, login, session stored in `localStorage`
- Dashboard: summaries, recent tasks, add-task modal
- My Tasks: Kanban board with To Do, In Progress, Completed columns
- Shared `TasksStore` for consistent task data across pages
- Analytics: charts (donut, line, bar), heatmap, activity timeline
- Settings: profile, theme (placeholder), notifications, import/export, clear data
- Desktop-only enforcement for app pages via `desktop-only.js`

Project layout (relevant files)
- index.html — Landing page
- login.html — Login / Signup UI
- pages/dashboard.html — Dashboard
- pages/tasks.html — My Tasks (Kanban)
- pages/analytics.html — Analytics
- pages/settings.html — Settings
- js/tasks-store.js — Centralized tasks storage
- js/auth.js — Login / Signup logic
- js/dashboard.js — Dashboard logic
- js/task.js — Tasks page logic
- js/analytics.js — Analytics logic
- js/settings.js — Settings, import/export, data management
- js/desktop-only.js — Mobile blocking overlay

Design principles
- Single-page-like flow using separate static pages and shared `TasksStore` for sync
- Keep UI logic separated per page
- LocalStorage-based persistence for quick prototyping (no backend)

Limitations
- No backend: authentication, data, and security are client-side only
- Theme manager is referenced but not implemented
- Drag-and-drop moving between columns is not implemented
- Some empty-state UI may be minimal

License & attribution
- This repository contains original frontend code; adapt and reuse as needed.