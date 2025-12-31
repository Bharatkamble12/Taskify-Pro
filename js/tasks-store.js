// js/tasks-store.js
// Shared tasks storage helper for pages to read/write the same `tasks` array in localStorage.
(function (global) {
  const KEY = 'tasks';
  const listeners = new Set();

  function getTasks() {
    try {
      let tasks = JSON.parse(localStorage.getItem(KEY)) || [];
      // Migration: add completedAt to existing completed tasks
      let needsSave = false;
      tasks = tasks.map(task => {
        if (task.status === 'completed' && !task.completedAt) {
          needsSave = true;
          return { ...task, completedAt: task.createdAt };
        }
        return task;
      });
      if (needsSave) {
        localStorage.setItem(KEY, JSON.stringify(tasks));
      }
      return tasks;
    } catch (e) {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(KEY, JSON.stringify(tasks || []));
    // notify same-window listeners
    listeners.forEach(fn => {
      try { fn(getTasks()); } catch (e) { /* ignore */ }
    });
  }

  function addTask(task) {
    if (!task) return;
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    return task;
  }

  function updateTaskStatus(id, status) {
    if (!id) return;
    const tasks = getTasks();
    let changed = false;
    const updated = tasks.map(t => {
      if (t.id === id) {
        changed = true;
        const updatedTask = Object.assign({}, t, { status });
        if (status === 'completed') {
          updatedTask.completedAt = new Date().toISOString();
        }
        return updatedTask;
      }
      return t;
    });
    if (changed) saveTasks(updated);
    return changed;
  }

  function deleteTask(id) {
    if (!id) return false;
    const tasks = getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) return false;
    saveTasks(filtered);
    return true;
  }

  function subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    listeners.add(fn);
    // return unsubscribe
    return () => listeners.delete(fn);
  }

  // Listen for storage events from other tabs/windows and notify listeners
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      listeners.forEach(fn => {
        try { fn(getTasks()); } catch (err) { /* ignore */ }
      });
    }
  });

  global.TasksStore = { getTasks, saveTasks, addTask, updateTaskStatus, deleteTask, subscribe };
})(window);
