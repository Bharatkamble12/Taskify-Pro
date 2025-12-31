// settings.js
// Used ONLY by settings.html

// ===== DOM ELEMENTS =====
// Sidebar
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

// Profile Settings
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const saveProfileBtn = document.getElementById("saveProfileBtn");

// Notification Settings
const taskRemindersCheckbox = document.getElementById("taskReminders");
const dueDateAlertsCheckbox = document.getElementById("dueDateAlerts");
const emailNotificationsCheckbox = document.getElementById("emailNotifications");

// Data Management
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");
const importFileInput = document.getElementById("importFile");
const clearAllDataBtn = document.getElementById("clearAllDataBtn");

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // Auth check
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "../login.html";
    return;
  }

  // Initialize sidebar user info
  updateSidebarUserInfo(currentUser);

  // Load settings
  loadSettings();

  // Initialize theme
  if (window.ThemeManager) {
    window.ThemeManager.initTheme();
  }

  // Event listeners
  logoutBtn.addEventListener("click", handleLogout);
  saveProfileBtn.addEventListener("click", handleSaveProfile);
  taskRemindersCheckbox.addEventListener("change", saveSettings);
  dueDateAlertsCheckbox.addEventListener("change", saveSettings);
  emailNotificationsCheckbox.addEventListener("change", saveSettings);
  exportDataBtn.addEventListener("click", handleExportData);
  importDataBtn.addEventListener("click", () => importFileInput.click());
  importFileInput.addEventListener("change", handleImportData);
  clearAllDataBtn.addEventListener("click", handleClearAllData);
});

// ===== SIDEBAR USER INFO =====
function updateSidebarUserInfo(user) {
  userAvatar.textContent = user.fullName.charAt(0).toUpperCase();
  userName.textContent = user.fullName;
  userEmail.textContent = user.email;

  // Populate profile form
  fullNameInput.value = user.fullName;
  emailInput.value = user.email;
}

// ===== LOGOUT =====
function handleLogout() {
  if (!confirm("Are you sure you want to logout?")) return;
  localStorage.removeItem("currentUser");
  window.location.href = "../login.html";
}

// ===== SETTINGS MANAGEMENT =====
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("settings")) || getDefaultSettings();

  // Notifications
  taskRemindersCheckbox.checked = settings.reminders;
  dueDateAlertsCheckbox.checked = settings.dueAlerts;
  emailNotificationsCheckbox.checked = settings.emailNotifications;
}

function saveSettings() {
  const settings = {
    reminders: taskRemindersCheckbox.checked,
    dueAlerts: dueDateAlertsCheckbox.checked,
    emailNotifications: emailNotificationsCheckbox.checked
  };

  localStorage.setItem("settings", JSON.stringify(settings));
  showNotification("Settings saved successfully!");
}

function getDefaultSettings() {
  return {
    reminders: true,
    dueAlerts: true,
    emailNotifications: false
  };
}

// ===== PROFILE MANAGEMENT =====
function handleSaveProfile() {
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();

  if (!fullName || !email) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Update current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  currentUser.fullName = fullName;
  currentUser.email = email;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update sidebar
  updateSidebarUserInfo(currentUser);

  showNotification("Profile updated successfully!");
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}



// ===== DATA MANAGEMENT =====
function handleExportData() {
  try {
    const data = {
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
      tasks: JSON.parse(localStorage.getItem("tasks")) || [],
      settings: JSON.parse(localStorage.getItem("settings")) || getDefaultSettings(),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `taskify-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Data exported successfully!");
  } catch (error) {
    console.error("Export error:", error);
    showNotification("Failed to export data", "error");
  }
}

function handleImportData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      // Validate data structure
      if (!importedData.currentUser || !Array.isArray(importedData.tasks)) {
        throw new Error("Invalid backup file format");
      }

      // Confirm import
      if (!confirm("This will replace your current data. Are you sure you want to continue?")) {
        return;
      }

      // Import data
      localStorage.setItem("currentUser", JSON.stringify(importedData.currentUser));
      localStorage.setItem("tasks", JSON.stringify(importedData.tasks));
      if (importedData.settings) {
        localStorage.setItem("settings", JSON.stringify(importedData.settings));
      }

      // Update UI
      updateSidebarUserInfo(importedData.currentUser);
      loadSettings();

      // Notify TasksStore if available
      if (window.TasksStore) {
        window.TasksStore.saveTasks(importedData.tasks);
      }

      showNotification("Data imported successfully! Please refresh the page.");
    } catch (error) {
      console.error("Import error:", error);
      showNotification("Failed to import data. Please check the file format.", "error");
    }
  };

  reader.readAsText(file);
}

function handleClearAllData() {
  if (!confirm("This will permanently delete all your tasks and settings. This action cannot be undone. Are you sure?")) {
    return;
  }

  if (!confirm("Are you absolutely sure? This will log you out and clear everything.")) {
    return;
  }

  // Clear all data
  localStorage.clear();

  showNotification("All data cleared. Redirecting to login...");
  setTimeout(() => {
    window.location.href = "../login.html";
  }, 2000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = "success") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Style notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "#ffffff",
    fontWeight: "500",
    zIndex: "1000",
    animation: "slideIn 0.3s ease"
  });

  if (type === "success") {
    notification.style.background = "linear-gradient(135deg, #4caf50, #45a049)";
  } else {
    notification.style.background = "linear-gradient(135deg, #f44336, #d32f2f)";
  }

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

// Add notification animations to CSS if not present
if (!document.querySelector("#notification-styles")) {
  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
