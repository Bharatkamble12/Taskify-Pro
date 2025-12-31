
document.addEventListener('DOMContentLoaded', () => {
  // Sync current user info in the sidebar and handle logout
  const avatarEl = document.querySelector('.user-avatar');
  const nameEl = document.querySelector('.user-name');
  const emailEl = document.querySelector('.user-email');
  const logoutBtn = document.querySelector('.logout-btn');

  function applyCurrentUser() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        // If not logged in, redirect to login
        window.location.href = "../login.html";
        return;
      }
      if (avatarEl) avatarEl.textContent = (currentUser.fullName || 'U').charAt(0).toUpperCase();
      if (nameEl) nameEl.textContent = currentUser.fullName || '';
      if (emailEl) emailEl.textContent = currentUser.email || '';
    } catch (e) {
      // ignore
    }
  }

  applyCurrentUser();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (!confirm('Logout?')) return;
      localStorage.removeItem('currentUser');
      window.location.href = "../login.html";
    });
  }

  // Listen for currentUser updates from other tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') applyCurrentUser();
  });

  const elTotal = document.getElementById('statTotal');
  const elCompleted = document.getElementById('statCompleted');
  const elPending = document.getElementById('statPending');
  const elRate = document.getElementById('statRate');
  const elOverdue = document.getElementById('statOverdue');
  const elOverdueRate = document.getElementById('statOverdueRate');

  const donutCanvas = document.getElementById('statusDonut');
  const lineCanvas = document.getElementById('productivityLine');
  const barCanvas = document.getElementById('overdueBar');
  const priorityCanvas = document.getElementById('priorityBar');
  const heatmapEl = document.getElementById('weeklyHeatmap');
  const activityListEl = document.getElementById('activityList');
 

  let donutChart = null;
  let lineChart = null;
  let barChart = null;
  let priorityChart = null;



  function buildHeatmap(tasks) {
    if (!heatmapEl) return;

    // Get current week (Monday to Sunday)
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1); // Monday of current week

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const completions = [0, 0, 0, 0, 0, 0, 0];

    // Count completed tasks for each day this week
    tasks.forEach(task => {
      if (task.status === 'completed' && task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const dayIndex = completedDate.getDay() - 1; // 0 for Mon, 6 for Sun
        if (dayIndex >= 0 && dayIndex < 7) {
          completions[dayIndex]++;
        }
      }
    });

    // Build heatmap HTML
    heatmapEl.innerHTML = days.map((day, index) => {
      const count = completions[index];
      const intensity = Math.min(count, 5); // Max intensity at 5+
      return `
        <div class="heatmap-day intensity-${intensity}">
          <div class="day-label">${day}</div>
          <div class="count">${count}</div>
        </div>
      `;
    }).join('');
  }



  function buildActivityTimeline(tasks) {
    if (!activityListEl) return;

    // Sort tasks by most recent activity (completedAt, updatedAt, or createdAt)
    const sortedTasks = tasks.slice().sort((a, b) => {
      const aTime = new Date(a.completedAt ?? a.updatedAt ?? a.createdAt);
      const bTime = new Date(b.completedAt ?? b.updatedAt ?? b.createdAt);
      return bTime - aTime;
    });

    // Take top 10 recent activities
    const recentTasks = sortedTasks.slice(0, 10);

    // Build activity items
    const activityItems = recentTasks.map(task => {
      let icon = '➕';
      let action = 'Created';
      let time = task.createdAt;

      if (task.status === 'completed' && task.completedAt) {
        icon = '✔';
        action = 'Completed';
        time = task.completedAt;
      } else if (task.status === 'in-progress') {
        icon = '⏳';
        action = 'Started';
        time = task.createdAt; // Assuming started when created, or could add startedAt
      }

      const date = new Date(time);
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let timeLabel = '';
      if (diffDays === 0) {
        timeLabel = 'Today';
      } else if (diffDays === 1) {
        timeLabel = 'Yesterday';
      } else {
        timeLabel = `${diffDays} days ago`;
      }

      return `
        <div class="activity-item">
          <div class="activity-icon">${icon}</div>
          <div class="activity-content">
            <div class="activity-text">${action} "${task.title}"</div>
            <div class="activity-time">${timeLabel}</div>
          </div>
        </div>
      `;
    }).join('');

    activityListEl.innerHTML = activityItems;
  }

  function buildCharts(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'todo').length;

    // Calculate overdue tasks: dueDate < today and status !== 'completed'
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(t => {
      if (t.status === 'completed' || !t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;

    // Calculate priority counts
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    // Calculate completion rate
    const currentRate = Math.round((completed / Math.max(1, total)) * 100);
    const rateDisplay = `${currentRate}%`;

    if (elTotal) elTotal.textContent = total;
    if (elCompleted) elCompleted.textContent = completed;
    if (elPending) elPending.textContent = pending;
    if (elRate) elRate.textContent = rateDisplay;
    if (elOverdue) elOverdue.textContent = overdue;
    if (elOverdueRate) elOverdueRate.textContent = Math.round((overdue / Math.max(1, total)) * 100) + '%';

    // Donut data
    const donutData = [pending, inProgress, completed];

    // Productivity: tasks completed per day over last 7 days (based on createdAt)
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      days.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      counts.push(0);
    }

    tasks.forEach(t => {
      if (t.status !== 'completed') return;
      const completedDate = t.completedAt ? t.completedAt.slice(0,10) : null;
      if (!completedDate) return;

      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));

        if (d.toISOString().slice(0,10) === completedDate) {
          counts[i]++;
          break;
        }
      }
    });

    // create/update donut
    if (donutCanvas && window.Chart) {
      if (donutChart) {
        donutChart.data.datasets[0].data = donutData;
        donutChart.update();
      } else {
        donutChart = new Chart(donutCanvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['To Do','In Progress','Completed'],
            datasets:[{ data: donutData, backgroundColor:['#f59e0b','#3b82f6','#10b981'], hoverOffset:8, borderWidth:0 }]
          },
          options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
        });
      }
    }

    // create/update line
    if (lineCanvas && window.Chart) {
      if (lineChart) {
        lineChart.data.labels = days;
        lineChart.data.datasets[0].data = counts;
        lineChart.update();
      } else {
        lineChart = new Chart(lineCanvas.getContext('2d'), {
          type:'line',
          data:{ labels: days, datasets:[{ label:'Tasks Completed', data: counts, borderColor:'#667eea', backgroundColor:'rgba(102,126,234,0.12)', fill:true, tension:0.3, pointRadius:3 }] },
          options:{ responsive:true, maintainAspectRatio:false, scales:{ x:{ grid:{ display:false } }, y:{ beginAtZero:true } }, plugins:{ legend:{ display:false } } }
        });
      }
    }

    // create/update bar chart for On-time vs Overdue
    if (barCanvas && window.Chart) {
      const onTime = total - overdue;
      const barData = [onTime, overdue];

      if (barChart) {
        barChart.data.datasets[0].data = barData;
        barChart.update();
      } else {
        barChart = new Chart(barCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: ['On-time', 'Overdue'],
            datasets: [{
              data: barData,
              backgroundColor: ['#10b981', '#ef4444'],
              borderWidth: 0,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: { stepSize: 1 }
              },
              x: {
                grid: { display: false }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }

    // create/update horizontal bar chart for Priorities
    if (priorityCanvas && window.Chart) {
      const priorityData = [highPriority, mediumPriority, lowPriority];

      if (priorityChart) {
        priorityChart.data.datasets[0].data = priorityData;
        priorityChart.update();
      } else {
        priorityChart = new Chart(priorityCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
              data: priorityData,
              backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
              borderWidth: 0,
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y', // horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                beginAtZero: true,
                grid: { display: false },
                ticks: { stepSize: 1 }
              },
              y: {
                grid: { display: false }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }

    // Build heatmap
    buildHeatmap(tasks);
  }

  // initial build using TasksStore if available
  const allTasks = (window.TasksStore && window.TasksStore.getTasks()) || [];
  buildCharts(allTasks);
  buildHeatmap(allTasks);
  buildActivityTimeline(allTasks);

  // subscribe to store changes to update charts live
  if (window.TasksStore && window.TasksStore.subscribe) {
    window.TasksStore.subscribe((newTasks) => {
      buildCharts(newTasks || []);
      buildHeatmap(newTasks || []);
      buildActivityTimeline(newTasks || []);
    });
  }
});

// ===== LOGOUT LOGIC =====
// Duplicate logout logic removed — logout is handled inside DOMContentLoaded above.
