// dashboard.js
// Used ONLY by dashboard.html

// ===== DOM ELEMENTS =====
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskModal = document.getElementById("addTaskModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelTaskBtn = document.getElementById("cancelTask");
const addTaskForm = document.getElementById("addTaskForm");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const inProgressEl = document.getElementById("inProgressCount");
const pendingTasksEl = document.getElementById("pendingTasks");

const recentTasksList = document.getElementById("recentTasksList");

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
  logoutBtn.addEventListener("click", handleLogout);
  addTaskBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelTaskBtn.addEventListener("click", closeModal);
  addTaskForm.addEventListener("submit", handleAddTask);

  // Load data
  updateDashboard();

  // Subscribe to TasksStore so dashboard updates automatically across pages
  if (window.TasksStore && typeof window.TasksStore.subscribe === 'function') {
    window.TasksStore.subscribe(updateDashboard);
  }
});

// ===== LOGOUT =====
function handleLogout() {
  if (!confirm("Are you sure you want to logout?")) return;
  localStorage.removeItem("currentUser");
  window.location.href = "../login.html";
}

// ===== MODAL =====
function openModal() {
  addTaskModal.classList.add("active");
}

function closeModal() {
  addTaskModal.classList.remove("active");
  addTaskForm.reset();
}

// ===== TASK LOGIC =====
// Use shared TasksStore for consistent storage across pages
function getTasks() {
  return (window.TasksStore && window.TasksStore.getTasks()) || [];
}

function saveTasks(tasks) {
  if (window.TasksStore && window.TasksStore.saveTasks) {
    window.TasksStore.saveTasks(tasks);
  } else {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function handleAddTask(e) {
  e.preventDefault();

  const formData = new FormData(addTaskForm);

  const newTask = {
    id: Date.now().toString(),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority").toLowerCase(),
    dueDate: formData.get("dueDate"),
    status: "todo",
    createdAt: new Date().toISOString()
  };

  if (window.TasksStore && typeof window.TasksStore.addTask === 'function') {
    window.TasksStore.addTask(newTask);
  } else {
    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);
  }

  closeModal();
  updateDashboard();
}

// ===== DASHBOARD UPDATE =====
function updateDashboard(tasksParam) {
  const tasks = Array.isArray(tasksParam) ? tasksParam : getTasks();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const pending = tasks.filter(t => t.status === "todo").length;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  inProgressEl.textContent = inProgress;
  // Pending should include todo + in-progress per spec
  pendingTasksEl.textContent = pending + inProgress;

  renderRecentTasks(tasks);
}

// ===== RECENT TASKS =====
function renderRecentTasks(tasks) {
  recentTasksList.innerHTML = "";

  if (!tasks.length) {
    recentTasksList.innerHTML =
      `<p class="empty-state">No recent tasks</p>`;
    return;
  }

  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  recent.forEach(task => {
    const div = document.createElement("div");
    div.className = "recent-task-card";

    div.innerHTML = `
      <div class="recent-task-title">${task.title}</div>
      <div class="recent-task-meta">
        <span class="badge priority ${task.priority}">
          ${task.priority.toUpperCase()}
        </span>
        <span class="badge status ${task.status}">
          ${task.status.replace("-", " ")}
        </span>
      </div>
    `;

    recentTasksList.appendChild(div);
  });
}
