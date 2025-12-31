1. CORE FOUNDATION
Project Structure

⬜ Clean folder structure (pages / css / js / assets) — O

⬜ Reusable sidebar across pages — O

⬜ Shared task storage (tasks-store) — O

⬜ Consistent naming (classes, ids, files) — O

🔐 2. AUTHENTICATION (Frontend Logic)
Login / Signup

⬜ Login form UI — O

⬜ Signup form UI — O

⬜ Password show/hide — O

⬜ Remember user in localStorage — O

⬜ Redirect to dashboard after login — O

⬜ Block access if not logged in — O

⬜ Logout clears session — O

⬜ Logout works on all pages — O

🏠 3. LANDING PAGE (Public)

⬜ Hero section — O

⬜ Feature highlights — O

⬜ App preview screenshot — O

⬜ CTA (Get Started) — O

⬜ Login navigation — O

⬜ Footer — O

⬜ Mobile-friendly landing page — O

⬜ Branding (logo, favicon) — O

📊 4. DASHBOARD PAGE
UI

⬜ Greeting / context — O

⬜ Summary cards — O

⬜ Today’s tasks — O

⬜ Overdue tasks — X

⬜ “Add Task” entry point — O

⬜ Navigation to My Tasks — O

Logic

⬜ Fetch tasks from storage — O

⬜ Correct task counts — O

⬜ Sync with My Tasks — O

⬜ Real-time update after adding task — O

📋 5. MY TASKS PAGE (CORE FEATURE)
UI

⬜ Kanban layout (To Do / In Progress / Completed) — O

⬜ Task cards — O

⬜ Priority indicator — O

⬜ Due date display — O

⬜ Empty state messages — X

⬜ Filters (search / status / priority) — O

Logic

⬜ Add new task — O

⬜ Store task correctly — O

⬜ Task status updates — O

⬜ Move task between columns — X

⬜ Filter logic works — O

⬜ Counts update correctly — O

⬜ Tasks persist on reload — O

⏱️ 6. TASK FLOW & BEHAVIOR

⬜ Default status = To Do — O

⬜ Status change to In Progress — O

⬜ Status change to Completed — O

⬜ Completed timestamp (optional) — O

⬜ Overdue detection — O

⬜ Visual overdue indicator — O

⬜ Task creation timestamp — O

📈 7. ANALYTICS PAGE
Stats

⬜ Total tasks — O

⬜ Completed tasks — O

⬜ Pending tasks — O

⬜ Completion rate — O

⬜ Overdue count — O

⬜ Overdue percentage — O

Charts

⬜ Status distribution chart — O

⬜ Productivity over time chart — O

⬜ Priority distribution — O

⬜ On-time vs overdue — O

⬜ Weekly heatmap (if added) — O

Logic

⬜ Analytics reads real task data — O

⬜ No fake numbers — O

⬜ Updates when tasks change — O

⬜ Handles empty task state — O

🧾 8. RECENT ACTIVITY TIMELINE

⬜ Task created activity — O

⬜ Task completed activity — O

⬜ Correct timestamps — O

⬜ “Today / Yesterday / X days ago” — O

⬜ Sorted by latest first — O

⬜ Handles no activity state — O

⚙️ 9. SETTINGS PAGE
UI

⬜ Theme selector — X

⬜ Notification toggles — O

⬜ Data export button — O

⬜ Data import button — O

⬜ Reset option (optional) — O

Logic

⬜ Save settings to storage — O

⬜ Apply theme correctly — X

⬜ Export all data (user + tasks + settings) — O

⬜ Import restores data correctly — O

⬜ Validation for imported file — O

📦 10. DATA MANAGEMENT

⬜ Single source of truth for tasks — O

⬜ No duplicate task storage — O

⬜ Import/export JSON works — O

⬜ Data persists across pages — O

⬜ Safe parsing (no crash on bad data) — O

📱 11. RESPONSIVENESS STRATEGY (AS DECIDED)

⬜ Landing page works on mobile — O

⬜ App pages blocked on mobile — O

⬜ Desktop-only message shown — O

⬜ Message is professional — O

⬜ Desktop-site hint included — O

⬜ Behavior consistent across pages — O

🧭 12. NAVIGATION & UX

⬜ Sidebar active states correct — O

⬜ Navigation links work — O

⬜ Page titles correct — O

⬜ No broken links — O

⬜ Logout available everywhere — O

🛡️ 13. ERROR HANDLING

⬜ Empty task states handled — O

⬜ No console errors — X

⬜ Graceful fallback if no data — O

⬜ User-friendly alerts/messages — O

🧪 14. TESTING CHECKLIST

⬜ Fresh browser (no data) — X

⬜ Login → Dashboard flow — O

⬜ Add task → appears everywhere — O

⬜ Reload → data persists — O

⬜ Analytics numbers correct — O

⬜ Import/export round-trip works — O

⬜ Mobile restriction works — O

⬜ Desktop experience smooth — O

📄 15. PROJECT READINESS

⬜ README written — O

⬜ Feature list documented — O

⬜ Known limitations mentioned — X

⬜ Screenshots added — X

⬜ Clear project goal defined — O