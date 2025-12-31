// Removed: placeholder task.js — kept intentionally blank to avoid unused code.
// tasks.js
// Used ONLY by tasks.html

// ===== DOM =====
// ===== DOM =====
const todoList = document.getElementById("todo-column");
const progressList = document.getElementById("in-progress-column");
const doneList = document.getElementById("completed-column");

const searchInput = document.getElementById("search-input");
const statusSelect = document.getElementById("status-filter");
const prioritySelect = document.getElementById("priority-filter");

const logoutBtn = document.getElementById("logoutBtn");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const todoCount = document.getElementById("todo-count");
const progressCount = document.getElementById("in-progress-count");
const completedCount = document.getElementById("completed-count");


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // Auth check
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "../login.html";
    return;
  }

  // Sidebar user info
  userAvatar.textContent = currentUser.fullName.charAt(0).toUpperCase();
  userName.textContent = currentUser.fullName;
  userEmail.textContent = currentUser.email;

  // Events
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (searchInput) searchInput.addEventListener("input", renderTasks);
  if (statusSelect) statusSelect.addEventListener("change", renderTasks);
  if (prioritySelect) prioritySelect.addEventListener("change", renderTasks);

  // Subscribe to TasksStore updates so UI re-renders automatically
  if (window.TasksStore && typeof window.TasksStore.subscribe === 'function') {
    window.TasksStore.subscribe(renderTasks);
  }

  // Initial render
  renderTasks();
});

// ===== LOGOUT =====
function handleLogout() {
  if (!confirm("Logout?")) return;
  localStorage.removeItem("currentUser");
  window.location.href = "../login.html";
}

// Add task button removed; add task logic lives in Dashboard modal.

// ===== DATA =====
function getTasks() {
  return (window.TasksStore && window.TasksStore.getTasks()) || [];
}

function saveTasks(tasks) {
  if (window.TasksStore && typeof window.TasksStore.saveTasks === 'function') {
    window.TasksStore.saveTasks(tasks);
  } else {
    localStorage.setItem('tasks', JSON.stringify(tasks || []));
  }
}
//===== RENDER =====
function renderTasks() {
  const allTasks = getTasks();
  const filteredTasks = applyFilters(allTasks);

  // Optional: sort by due date ascending (earliest first). Tasks without due date go last.
  filteredTasks.sort((a, b) => {
    const pa = a && a.dueDate ? Date.parse(a.dueDate) : null;
    const pb = b && b.dueDate ? Date.parse(b.dueDate) : null;
    if (!pa && !pb) return 0;
    if (!pa) return 1;
    if (!pb) return -1;
    return pa - pb;
  });

  todoList.innerHTML = "";
  progressList.innerHTML = "";
  doneList.innerHTML = "";

  let todo = 0, progress = 0, completed = 0;

  allTasks.forEach(task => {
    if (task.status === "todo") todo++;
    if (task.status === "in-progress") progress++;
    if (task.status === "completed") completed++;
  });

  document.getElementById("todo-count").textContent = todo;
  document.getElementById("in-progress-count").textContent = progress;
  document.getElementById("completed-count").textContent = completed;

  filteredTasks.forEach(task => {
    const card = createTaskCard(task);

    if (task.status === "todo") todoList.appendChild(card);
    if (task.status === "in-progress") progressList.appendChild(card);
    if (task.status === "completed") doneList.appendChild(card);
  });
}


// ===== FILTERS =====
function applyFilters(tasks) {
  const search = searchInput.value.toLowerCase();
  const status = statusSelect.value.toLowerCase();
  const priority = prioritySelect.value.toLowerCase();

  return tasks.filter(task => {
    const matchText =
      task.title.toLowerCase().includes(search) ||
      (task.description || "").toLowerCase().includes(search);

    const matchStatus =
      status === "all" || task.status === status;

    const matchPriority =
      priority === "all" || task.priority === priority;

    return matchText && matchStatus && matchPriority;
  });
}

// ===== UI =====
function createTaskCard(task) {
  const div = document.createElement("div");
  div.className = "task-card";

  // show due date and mark overdue if applicable
  let dueText = "";
  let isOverdue = false;
  if (task.dueDate) {
    const d = new Date(task.dueDate);
    if (!isNaN(d)) {
      dueText = d.toLocaleDateString();
      const today = new Date();
      today.setHours(0,0,0,0);
      const dueDay = new Date(d);
      dueDay.setHours(0,0,0,0);
      if (task.status !== 'completed' && dueDay < today) {
        isOverdue = true;
        div.classList.add('overdue');
      }
    }
  }

  div.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-meta">
      ${task.priority.toUpperCase()} • ${task.status.replace("-", " ")}
    </div>
    <div class="task-due">${dueText ? 'Due: ' + dueText : ''}</div>
    <div class="task-actions"></div>
  `;

  const actions = div.querySelector('.task-actions');

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'btn btn-danger btn-sm';
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => {
    if (!confirm('Delete this task?')) return;
    if (window.TasksStore && typeof window.TasksStore.deleteTask === 'function') {
      window.TasksStore.deleteTask(task.id);
    } else {
      const tasks = getTasks().filter(t => t.id !== task.id);
      saveTasks(tasks);
    }
  });
  actions.appendChild(delBtn);

  // Start button (only show for todo)
  if (task.status === 'todo') {
    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-primary btn-sm';
    startBtn.textContent = 'Start';
    startBtn.addEventListener('click', () => {
      if (window.TasksStore && typeof window.TasksStore.updateTaskStatus === 'function') {
        window.TasksStore.updateTaskStatus(task.id, 'in-progress');
      } else {
        const tasks = getTasks().map(t => t.id === task.id ? Object.assign({}, t, { status: 'in-progress' }) : t);
        saveTasks(tasks);
      }
    });
    actions.appendChild(startBtn);
  }

  // Complete button (show if not completed)
  if (task.status !== 'completed') {
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success btn-sm';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => {
      if (window.TasksStore && typeof window.TasksStore.updateTaskStatus === 'function') {
        window.TasksStore.updateTaskStatus(task.id, 'completed');
      } else {
        const tasks = getTasks().map(t => {
          if (t.id === task.id) {
            return Object.assign({}, t, { status: 'completed', completedAt: new Date().toISOString() });
          }
          return t;
        });
        saveTasks(tasks);
      }
    });
    actions.appendChild(completeBtn);
  }

  return div;
}
