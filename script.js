/* ==============================================================
   STUDENT STUDY PLANNER - SCRIPT (script.js)
   Clean, beginner-friendly Vanilla JavaScript.
   Handles state, data persistence, navigation, timers, and UI updates.
   ============================================================== */

// ==============================================================
// 1. MOTIVATIONAL QUOTES LIST
// ==============================================================
const motivationalQuotes = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" }
];

// ==============================================================
// 2. DEFAULT DEMO DATA
// ==============================================================
const defaultStudentName = "Alex Morgan";

const defaultSubjects = [
  { id: "sub-1", name: "Python", color: "blue" },
  { id: "sub-2", name: "Mathematics", color: "green" },
  { id: "sub-3", name: "English", color: "purple" },
  { id: "sub-4", name: "Computer Science", color: "orange" }
];

const defaultSchedules = [
  {
    id: "sch-1",
    subject: "Python",
    date: getFormattedDate(0),
    startTime: "09:00",
    endTime: "10:30",
    topic: "Object-Oriented Programming & Classes"
  },
  {
    id: "sch-2",
    subject: "Mathematics",
    date: getFormattedDate(0),
    startTime: "11:00",
    endTime: "12:30",
    topic: "Calculus: Limits & Derivatives Problem Set"
  },
  {
    id: "sch-3",
    subject: "Computer Science",
    date: getFormattedDate(1),
    startTime: "14:00",
    endTime: "16:00",
    topic: "Data Structures: Linked Lists & Trees"
  }
];

const defaultTasks = [
  {
    id: "task-1",
    title: "Complete Python Lab Assignment 2",
    subject: "Python",
    category: "Assignment",
    priority: "High",
    dueDate: getFormattedDate(2),
    completed: false
  },
  {
    id: "task-2",
    title: "Read Computer Science Chapter 4 (Sorting Algorithms)",
    subject: "Computer Science",
    category: "Reading",
    priority: "Medium",
    dueDate: getFormattedDate(1),
    completed: true
  },
  {
    id: "task-3",
    title: "Practice 10 Calculus Integration Problems",
    subject: "Mathematics",
    category: "Exam Prep",
    priority: "High",
    dueDate: getFormattedDate(3),
    completed: false
  },
  {
    id: "task-4",
    title: "Write English Essay Draft on Digital Ethics",
    subject: "English",
    category: "Assignment",
    priority: "Low",
    dueDate: getFormattedDate(4),
    completed: false
  }
];

const defaultNotes = `📌 Quick Exam Reminders:
- Python Final Lab due this Friday at 5:00 PM.
- Math Quiz on Integration Formulas next Tuesday.
- Important Rule: Always close database connections in CS!`;

// ==============================================================
// 3. APPLICATION STATE
// ==============================================================
let studentName = defaultStudentName;
let subjects = [];
let schedules = [];
let tasks = [];
let notes = "";
let currentFilter = "all"; // 'all', 'pending', 'completed'
let searchQuery = "";

// Pomodoro Timer State
let timerDuration = 1500; // 25 minutes default in seconds
let timerRemaining = 1500;
let timerInterval = null;
let isTimerRunning = false;
let currentTimerMode = "pomodoro";
let pomodoroSessionsCompleted = 0;

// ==============================================================
// 4. STORAGE FUNCTIONS
// ==============================================================

// Load data from LocalStorage
function loadAppState() {
  const savedName = localStorage.getItem("planner_student_name");
  const savedSubjects = localStorage.getItem("planner_subjects");
  const savedSchedules = localStorage.getItem("planner_schedules");
  const savedTasks = localStorage.getItem("planner_tasks");
  const savedNotes = localStorage.getItem("planner_notes");
  const savedPomo = localStorage.getItem("planner_pomo_count");

  studentName = savedName || defaultStudentName;
  subjects = savedSubjects ? JSON.parse(savedSubjects) : defaultSubjects;
  schedules = savedSchedules ? JSON.parse(savedSchedules) : defaultSchedules;
  tasks = savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  notes = savedNotes !== null ? savedNotes : defaultNotes;
  pomodoroSessionsCompleted = savedPomo ? parseInt(savedPomo, 10) : 0;
}

// Save data to LocalStorage
function saveAppState() {
  localStorage.setItem("planner_student_name", studentName);
  localStorage.setItem("planner_subjects", JSON.stringify(subjects));
  localStorage.setItem("planner_schedules", JSON.stringify(schedules));
  localStorage.setItem("planner_tasks", JSON.stringify(tasks));
  localStorage.setItem("planner_notes", notes);
  localStorage.setItem("planner_pomo_count", pomodoroSessionsCompleted);
}

// Restore default demo data
function restoreDemoData() {
  if (confirm("Restore sample demo data? Any unsaved edits will be replaced with defaults.")) {
    studentName = defaultStudentName;
    subjects = [...defaultSubjects];
    schedules = [...defaultSchedules];
    tasks = [...defaultTasks];
    notes = defaultNotes;
    pomodoroSessionsCompleted = 0;
    saveAppState();
    initApp();
    showToast("Sample data restored successfully!");
  }
}

// Clear all data
function clearAllData() {
  if (confirm("Are you sure you want to clear all tasks, schedules, and subjects?")) {
    subjects = [];
    schedules = [];
    tasks = [];
    notes = "";
    saveAppState();
    initApp();
    showToast("All data cleared.");
  }
}

// ==============================================================
// 5. DATE & TIME HELPERS
// ==============================================================

// Get YYYY-MM-DD date string with optional offset
function getFormattedDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

// Format "YYYY-MM-DD" to "Mon DD, YYYY"
function formatPrettyDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = parts[0];
  const month = monthNames[parseInt(parts[1], 10) - 1];
  const day = parseInt(parts[2], 10);
  return `${month} ${day}, ${year}`;
}

// Convert 24h "14:30" to 12h "2:30 PM"
function format12hTime(timeStr) {
  if (!timeStr) return "";
  const [hourStr, minStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minStr} ${ampm}`;
}

// Live Clock & Time Greeting
function startLiveClock() {
  function updateTime() {
    const now = new Date();
    
    // Time
    const clockEl = document.getElementById("live-clock");
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    // Date
    const dateEl = document.getElementById("current-date");
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }

    // Greeting
    const greetingEl = document.getElementById("greeting-text");
    if (greetingEl) {
      const hour = now.getHours();
      let greeting = "Welcome back";
      if (hour < 12) greeting = "Good morning";
      else if (hour < 18) greeting = "Good afternoon";
      else greeting = "Good evening";
      greetingEl.textContent = `${greeting}, ${studentName}! 👋`;
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

// Display random motivational quote
function displayQuote() {
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");
  if (textEl && authorEl) {
    textEl.textContent = `"${quote.text}"`;
    authorEl.textContent = `— ${quote.author}`;
  }
}

// ==============================================================
// 6. NAVIGATION & VIEW SWITCHING
// ==============================================================

function switchView(viewId, filter = null) {
  // Update navigation menu tabs
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-view") === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Switch views
  const views = document.querySelectorAll(".app-view");
  views.forEach(v => {
    if (v.id === viewId) {
      v.classList.add("active-view");
    } else {
      v.classList.remove("active-view");
    }
  });

  // Optional: Set filter when navigating directly to tasks view
  if (viewId === "tasks-view" && filter) {
    setTaskFilter(filter);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==============================================================
// 7. STATS & PROGRESS TRACKING
// ==============================================================

function updateStatsAndProgress() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const totalSchedules = schedules.length;

  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Stats numbers
  document.getElementById("stat-total-tasks").textContent = totalTasks;
  document.getElementById("stat-completed-tasks").textContent = completedTasks;
  document.getElementById("stat-pending-tasks").textContent = pendingTasks;
  document.getElementById("stat-total-schedules").textContent = totalSchedules;

  // Filter tab counts
  document.getElementById("count-all-tasks").textContent = totalTasks;
  document.getElementById("count-pending-tasks").textContent = pendingTasks;
  document.getElementById("count-completed-tasks").textContent = completedTasks;

  // Badges & Counters
  document.getElementById("subject-count-badge").textContent = `${subjects.length} Subjects`;
  document.getElementById("schedule-count-badge").textContent = `${schedules.length} Sessions`;

  // Progress Bar & Percentage
  const progressPercentEl = document.getElementById("progress-percentage");
  const progressFillEl = document.getElementById("progress-bar-fill");
  const progressSubEl = document.getElementById("progress-sub-text");

  if (progressPercentEl && progressFillEl) {
    progressPercentEl.textContent = `${percentage}%`;
    progressFillEl.style.width = `${percentage}%`;
    progressSubEl.textContent = `${completedTasks} of ${totalTasks} tasks completed`;

    if (percentage === 100 && totalTasks > 0) {
      progressPercentEl.textContent = "🎉 100% Done!";
    }
  }
}

// ==============================================================
// 8. SUBJECTS MANAGEMENT
// ==============================================================

// Populate all subject select dropdowns
function renderSubjectDropdowns() {
  const selects = [
    document.getElementById("task-subject-select"),
    document.getElementById("schedule-subject-select"),
    document.getElementById("modal-task-subject"),
    document.getElementById("modal-schedule-subject")
  ];

  selects.forEach(select => {
    if (!select) return;

    if (subjects.length === 0) {
      select.innerHTML = `<option value="">No subjects (Add one first)</option>`;
      return;
    }

    select.innerHTML = subjects
      .map(sub => `<option value="${escapeHtml(sub.name)}">${escapeHtml(sub.name)}</option>`)
      .join("");
  });
}

// Render Subjects View Grid & Dashboard Chips
function renderSubjects() {
  const container = document.getElementById("subjects-container");
  const chipsContainer = document.getElementById("dashboard-subjects-chips");

  if (!container) return;

  if (subjects.length === 0) {
    const emptyHtml = `<div class="empty-state"><span class="empty-icon">📖</span><p>No subjects added yet. Add your first subject!</p></div>`;
    container.innerHTML = emptyHtml;
    if (chipsContainer) chipsContainer.innerHTML = `<span style="font-size:0.85rem;color:var(--text-muted)">No subjects enrolled.</span>`;
    return;
  }

  // Render Full Subject Cards
  container.innerHTML = subjects
    .map(sub => {
      const taskCount = tasks.filter(t => t.subject === sub.name).length;
      return `
        <div class="subject-card theme-${sub.color}">
          <div class="subject-info">
            <h4>${escapeHtml(sub.name)}</h4>
            <span class="subject-task-count">${taskCount} ${taskCount === 1 ? "task" : "tasks"}</span>
          </div>
          <button class="btn-delete" title="Delete Subject" onclick="deleteSubject('${sub.id}')">🗑️</button>
        </div>
      `;
    })
    .join("");

  // Render Dashboard Subject Chips
  if (chipsContainer) {
    chipsContainer.innerHTML = subjects
      .map(sub => `
        <div class="subject-chip" onclick="filterBySubject('${escapeHtml(sub.name)}')">
          <span class="chip-dot" style="background: var(--subject-${sub.color || "blue"})"></span>
          <span>${escapeHtml(sub.name)}</span>
        </div>
      `)
      .join("");
  }
}

// Add Subject
function handleAddSubject(name, color) {
  name = name.trim();
  if (!name) {
    alert("Please enter a subject name.");
    return false;
  }

  const exists = subjects.some(s => s.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert(`Subject "${name}" already exists.`);
    return false;
  }

  const newSubject = {
    id: "sub-" + Date.now(),
    name: name,
    color: color || "blue"
  };

  subjects.push(newSubject);
  saveAppState();

  renderSubjects();
  renderSubjectDropdowns();
  updateStatsAndProgress();
  showToast(`Subject "${name}" added!`);
  return true;
}

// Delete Subject
function deleteSubject(id) {
  const target = subjects.find(s => s.id === id);
  if (!target) return;

  if (confirm(`Delete subject "${target.name}"? Tasks associated with it will remain.`)) {
    subjects = subjects.filter(s => s.id !== id);
    saveAppState();

    renderSubjects();
    renderSubjectDropdowns();
    updateStatsAndProgress();
    showToast(`Subject removed.`);
  }
}

// Filter tasks view by clicking a subject chip
function filterBySubject(subjName) {
  switchView("tasks-view");
  const searchInput = document.getElementById("task-search-input");
  if (searchInput) {
    searchInput.value = subjName;
    handleTaskSearch();
  }
}

// ==============================================================
// 9. DAILY TIMETABLE (SCHEDULE)
// ==============================================================

function renderSchedules() {
  const container = document.getElementById("schedule-container");
  const dashContainer = document.getElementById("dashboard-schedule-list");

  if (!container) return;

  if (schedules.length === 0) {
    const emptyHtml = `
      <div class="empty-state">
        <span class="empty-icon">🗓️</span>
        <p>No study sessions scheduled yet. Plan your day!</p>
      </div>
    `;
    container.innerHTML = emptyHtml;
    if (dashContainer) dashContainer.innerHTML = emptyHtml;
    return;
  }

  // Sort chronologically by date and start time
  const sorted = [...schedules].sort((a, b) => {
    if (a.date === b.date) return a.startTime.localeCompare(b.startTime);
    return a.date.localeCompare(b.date);
  });

  const fullHtml = sorted
    .map(sch => `
      <div class="schedule-item">
        <div class="schedule-content">
          <div class="schedule-topic">${escapeHtml(sch.topic)}</div>
          <div class="schedule-meta">
            <span class="subject-badge">${escapeHtml(sch.subject)}</span>
            <span>📅 ${formatPrettyDate(sch.date)}</span>
            <span class="time-tag">⏰ ${format12hTime(sch.startTime)} - ${format12hTime(sch.endTime)}</span>
          </div>
        </div>
        <button class="btn-delete" title="Delete Session" onclick="deleteSchedule('${sch.id}')">🗑️</button>
      </div>
    `)
    .join("");

  container.innerHTML = fullHtml;

  // Mini schedule preview for Dashboard (top 3 upcoming)
  if (dashContainer) {
    dashContainer.innerHTML = sorted
      .slice(0, 3)
      .map(sch => `
        <div class="schedule-item">
          <div class="schedule-content">
            <div class="schedule-topic">${escapeHtml(sch.topic)}</div>
            <div class="schedule-meta">
              <span class="subject-badge">${escapeHtml(sch.subject)}</span>
              <span>📅 ${formatPrettyDate(sch.date)}</span>
              <span class="time-tag">⏰ ${format12hTime(sch.startTime)}</span>
            </div>
          </div>
        </div>
      `)
      .join("");
  }
}

function handleAddSchedule(subject, date, startTime, endTime, topic) {
  if (!subject) {
    alert("Please select or add a subject first.");
    return false;
  }

  if (!date || !startTime || !endTime || !topic.trim()) {
    alert("Please complete all timetable fields.");
    return false;
  }

  const newSchedule = {
    id: "sch-" + Date.now(),
    subject,
    date,
    startTime,
    endTime,
    topic: topic.trim()
  };

  schedules.push(newSchedule);
  saveAppState();

  renderSchedules();
  updateStatsAndProgress();
  showToast("Study session scheduled!");
  return true;
}

function deleteSchedule(id) {
  schedules = schedules.filter(sch => sch.id !== id);
  saveAppState();

  renderSchedules();
  updateStatsAndProgress();
  showToast("Study session removed.");
}

// ==============================================================
// 10. STUDY TASKS (ADD, COMPLETE, FILTER, DELETE)
// ==============================================================

function renderTasks() {
  const container = document.getElementById("tasks-container");
  const dashContainer = document.getElementById("dashboard-tasks-list");

  if (!container) return;

  // Apply filters
  let filtered = tasks;

  if (currentFilter === "pending") {
    filtered = filtered.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = filtered.filter(t => t.completed);
  }

  // Apply search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      t => t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    const emptyHtml = `
      <div class="empty-state">
        <span class="empty-icon">📝</span>
        <p>No ${currentFilter === "all" ? "" : currentFilter} tasks found.</p>
      </div>
    `;
    container.innerHTML = emptyHtml;
  } else {
    container.innerHTML = filtered
      .map(task => `
        <div class="task-item ${task.completed ? "completed" : ""}">
          <div class="task-left">
            <input 
              type="checkbox" 
              class="task-checkbox" 
              ${task.completed ? "checked" : ""} 
              onchange="toggleTask('${task.id}')"
              title="Toggle task completion"
            >
            <div class="task-body">
              <span class="task-title">${escapeHtml(task.title)}</span>
              <div class="task-tags">
                <span class="subject-badge">${escapeHtml(task.subject)}</span>
                <span class="category-tag">📌 ${escapeHtml(task.category)}</span>
                <span class="priority-pill priority-${(task.priority || "medium").toLowerCase()}">${task.priority || "Medium"}</span>
                <span class="due-date-tag">📅 Due: ${formatPrettyDate(task.dueDate)}</span>
                <span class="status-pill ${task.completed ? "completed" : "pending"}">
                  ${task.completed ? "✅ Completed" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>
          <button class="btn-delete" title="Delete Task" onclick="deleteTask('${task.id}')">🗑️</button>
        </div>
      `)
      .join("");
  }

  // Dashboard Mini Task List (Shows top 4)
  if (dashContainer) {
    if (tasks.length === 0) {
      dashContainer.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📝</span>
          <p>No study tasks yet. Click "Add Task" to get started!</p>
        </div>
      `;
    } else {
      dashContainer.innerHTML = tasks
        .slice(0, 4)
        .map(task => `
          <div class="task-item ${task.completed ? "completed" : ""}">
            <div class="task-left">
              <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? "checked" : ""} 
                onchange="toggleTask('${task.id}')"
              >
              <div class="task-body">
                <span class="task-title">${escapeHtml(task.title)}</span>
                <div class="task-tags">
                  <span class="subject-badge">${escapeHtml(task.subject)}</span>
                  <span class="due-date-tag">Due: ${formatPrettyDate(task.dueDate)}</span>
                  <span class="status-pill ${task.completed ? "completed" : "pending"}">
                    ${task.completed ? "Done" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        `)
        .join("");
    }
  }
}

function handleAddTask(title, subject, category, priority, dueDate) {
  title = title.trim();
  if (!title) {
    alert("Please enter a task title.");
    return false;
  }
  if (!subject) {
    alert("Please select a subject.");
    return false;
  }
  if (!dueDate) {
    alert("Please specify a due date.");
    return false;
  }

  const newTask = {
    id: "task-" + Date.now(),
    title,
    subject,
    category: category || "Assignment",
    priority: priority || "Medium",
    dueDate,
    completed: false
  };

  tasks.unshift(newTask);
  saveAppState();

  renderTasks();
  renderSubjects(); // Update task counts
  updateStatsAndProgress();
  showToast("Task added successfully!");
  return true;
}

// Toggle Task Completion
function toggleTask(id) {
  let isDone = false;
  tasks = tasks.map(task => {
    if (task.id === id) {
      isDone = !task.completed;
      return { ...task, completed: isDone };
    }
    return task;
  });

  saveAppState();
  renderTasks();
  updateStatsAndProgress();
  showToast(isDone ? "Task marked as completed! 🎉" : "Task marked as pending.");
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAppState();

  renderTasks();
  renderSubjects();
  updateStatsAndProgress();
  showToast("Task deleted.");
}

// Filter button handler
function setTaskFilter(filterName) {
  currentFilter = filterName;
  document.querySelectorAll(".filter-tab").forEach(tab => {
    if (tab.getAttribute("data-filter") === filterName) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
  renderTasks();
}

// Search handler
function handleTaskSearch() {
  const input = document.getElementById("task-search-input");
  if (input) {
    searchQuery = input.value;
    renderTasks();
  }
}

// ==============================================================
// 11. POMODORO FOCUS TIMER
// ==============================================================

function formatTimerClock(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTimerDisplays() {
  const formatted = formatTimerClock(timerRemaining);
  const miniDisplay = document.getElementById("mini-timer-time");
  const fullDisplay = document.getElementById("full-timer-time");

  if (miniDisplay) miniDisplay.textContent = formatted;
  if (fullDisplay) fullDisplay.textContent = formatted;
}

function togglePomodoroTimer() {
  if (isTimerRunning) {
    pausePomodoroTimer();
  } else {
    startPomodoroTimer();
  }
}

function startPomodoroTimer() {
  if (isTimerRunning) return;
  isTimerRunning = true;

  const miniBtn = document.getElementById("mini-timer-start-btn");
  const fullBtn = document.getElementById("full-timer-toggle-btn");
  if (miniBtn) miniBtn.textContent = "Pause";
  if (fullBtn) fullBtn.textContent = "⏸ Pause Timer";

  const statusEl = document.getElementById("full-timer-status");
  if (statusEl) statusEl.textContent = "Focus session in progress... Keep going! 🚀";

  timerInterval = setInterval(() => {
    if (timerRemaining > 0) {
      timerRemaining--;
      updateTimerDisplays();
    } else {
      clearInterval(timerInterval);
      isTimerRunning = false;
      playBeepNotification();
      handleTimerCompletion();
    }
  }, 1000);
}

function pausePomodoroTimer() {
  isTimerRunning = false;
  clearInterval(timerInterval);

  const miniBtn = document.getElementById("mini-timer-start-btn");
  const fullBtn = document.getElementById("full-timer-toggle-btn");
  if (miniBtn) miniBtn.textContent = "Resume";
  if (fullBtn) fullBtn.textContent = "▶ Resume Timer";

  const statusEl = document.getElementById("full-timer-status");
  if (statusEl) statusEl.textContent = "Timer paused.";
}

function resetPomodoroTimer() {
  pausePomodoroTimer();
  timerRemaining = timerDuration;
  updateTimerDisplays();

  const miniBtn = document.getElementById("mini-timer-start-btn");
  const fullBtn = document.getElementById("full-timer-toggle-btn");
  if (miniBtn) miniBtn.textContent = "Start Focus";
  if (fullBtn) fullBtn.textContent = "▶ Start Study Session";

  const statusEl = document.getElementById("full-timer-status");
  if (statusEl) statusEl.textContent = "Ready to Focus!";
}

function setTimerMode(mode, seconds, buttonElement) {
  currentTimerMode = mode;
  timerDuration = seconds;
  resetPomodoroTimer();

  document.querySelectorAll(".timer-mode-btn").forEach(btn => btn.classList.remove("active"));
  if (buttonElement) buttonElement.classList.add("active");
}

function handleTimerCompletion() {
  if (currentTimerMode === "pomodoro") {
    pomodoroSessionsCompleted++;
    saveAppState();
    document.getElementById("pomodoro-completed-count").textContent = pomodoroSessionsCompleted;
    alert("🎉 Great job! You completed a 25-minute study focus session. Take a 5-minute break!");
  } else {
    alert("Break time is over! Ready to get back to studying?");
  }
  resetPomodoroTimer();
}

// Built-in Web Audio API chime so no external sound files needed
function playBeepNotification() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.log("Audio notification skipped");
  }
}

// ==============================================================
// 12. SCRATCHPAD & STUDY NOTES
// ==============================================================

function initScratchpad() {
  const dashNote = document.getElementById("dashboard-scratchpad");
  const fullNote = document.getElementById("full-scratchpad-input");
  const dashStatus = document.getElementById("scratchpad-status");
  const fullStatus = document.getElementById("full-notes-status");

  if (dashNote) dashNote.value = notes;
  if (fullNote) fullNote.value = notes;

  function syncNotes(value) {
    notes = value;
    saveAppState();
    if (dashNote) dashNote.value = value;
    if (fullNote) fullNote.value = value;

    if (dashStatus) dashStatus.textContent = "Saved";
    if (fullStatus) fullStatus.textContent = "Saved";
  }

  if (dashNote) {
    dashNote.addEventListener("input", e => syncNotes(e.target.value));
  }
  if (fullNote) {
    fullNote.addEventListener("input", e => syncNotes(e.target.value));
  }
}

function clearScratchpad() {
  if (confirm("Clear your study notes?")) {
    notes = "";
    saveAppState();
    initScratchpad();
    showToast("Notes cleared.");
  }
}

// ==============================================================
// 13. MODAL CONTROLS & PROFILE
// ==============================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

// Close modal when clicking outside of it
window.addEventListener("click", e => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
  }
});

// ESC key closes any open modal
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active").forEach(m => m.classList.remove("active"));
  }
});

// Update student profile name
function initProfile() {
  const nameEl = document.getElementById("student-name-display");
  const avatarEl = document.getElementById("student-avatar");
  const badgeEl = document.getElementById("student-profile-badge");
  const modalInput = document.getElementById("modal-student-name");

  if (nameEl) nameEl.textContent = studentName;
  if (avatarEl) avatarEl.textContent = studentName.charAt(0).toUpperCase();
  if (modalInput) modalInput.value = studentName;

  if (badgeEl) {
    badgeEl.addEventListener("click", () => {
      openModal("profile-modal");
    });
  }
}

// ==============================================================
// 14. TOAST NOTIFICATION
// ==============================================================
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Helper to escape HTML characters
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==============================================================
// 15. INITIALIZATION ON DOM READY
// ==============================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load data
  loadAppState();

  // 2. Setup Real-time Clock, Greetings & Quotes
  startLiveClock();
  displayQuote();

  // 3. Setup Navigation Links
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-view");
      switchView(targetView);
    });
  });

  // 4. Set Default Dates for Form Inputs
  const todayStr = getFormattedDate(0);
  const dateInputs = [
    document.getElementById("task-date-input"),
    document.getElementById("schedule-date-input"),
    document.getElementById("modal-task-date"),
    document.getElementById("modal-schedule-date")
  ];
  dateInputs.forEach(inp => {
    if (inp && !inp.value) inp.value = todayStr;
  });

  // 5. Setup Forms
  // Page Task Form
  const addTaskForm = document.getElementById("add-task-form");
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", e => {
      e.preventDefault();
      const success = handleAddTask(
        document.getElementById("task-title-input").value,
        document.getElementById("task-subject-select").value,
        document.getElementById("task-category-select").value,
        document.getElementById("task-priority-select").value,
        document.getElementById("task-date-input").value
      );
      if (success) document.getElementById("task-title-input").value = "";
    });
  }

  // Modal Task Form
  const modalTaskForm = document.getElementById("modal-task-form");
  if (modalTaskForm) {
    modalTaskForm.addEventListener("submit", e => {
      e.preventDefault();
      const success = handleAddTask(
        document.getElementById("modal-task-title").value,
        document.getElementById("modal-task-subject").value,
        document.getElementById("modal-task-category").value,
        document.getElementById("modal-task-priority").value,
        document.getElementById("modal-task-date").value
      );
      if (success) {
        document.getElementById("modal-task-title").value = "";
        closeModal("task-modal");
      }
    });
  }

  // Page Schedule Form
  const addScheduleForm = document.getElementById("add-schedule-form");
  if (addScheduleForm) {
    addScheduleForm.addEventListener("submit", e => {
      e.preventDefault();
      const success = handleAddSchedule(
        document.getElementById("schedule-subject-select").value,
        document.getElementById("schedule-date-input").value,
        document.getElementById("schedule-start-time").value,
        document.getElementById("schedule-end-time").value,
        document.getElementById("schedule-topic-input").value
      );
      if (success) {
        document.getElementById("schedule-topic-input").value = "";
        document.getElementById("schedule-start-time").value = "";
        document.getElementById("schedule-end-time").value = "";
      }
    });
  }

  // Modal Schedule Form
  const modalScheduleForm = document.getElementById("modal-schedule-form");
  if (modalScheduleForm) {
    modalScheduleForm.addEventListener("submit", e => {
      e.preventDefault();
      const success = handleAddSchedule(
        document.getElementById("modal-schedule-subject").value,
        document.getElementById("modal-schedule-date").value,
        document.getElementById("modal-schedule-start").value,
        document.getElementById("modal-schedule-end").value,
        document.getElementById("modal-schedule-topic").value
      );
      if (success) {
        document.getElementById("modal-schedule-topic").value = "";
        closeModal("schedule-modal");
      }
    });
  }

  // Page Subject Form
  const addSubjectForm = document.getElementById("add-subject-form");
  if (addSubjectForm) {
    addSubjectForm.addEventListener("submit", e => {
      e.preventDefault();
      const nameInput = document.getElementById("subject-name-input");
      const colorInput = document.getElementById("subject-color-input");
      const success = handleAddSubject(nameInput.value, colorInput.value);
      if (success) nameInput.value = "";
    });
  }

  // Modal Subject Form
  const modalSubjectForm = document.getElementById("modal-subject-form");
  if (modalSubjectForm) {
    modalSubjectForm.addEventListener("submit", e => {
      e.preventDefault();
      const nameInput = document.getElementById("modal-subject-name");
      const colorInput = document.getElementById("modal-subject-color");
      const success = handleAddSubject(nameInput.value, colorInput.value);
      if (success) {
        nameInput.value = "";
        closeModal("subject-modal");
      }
    });
  }

  // Modal Profile Form
  const modalProfileForm = document.getElementById("modal-profile-form");
  if (modalProfileForm) {
    modalProfileForm.addEventListener("submit", e => {
      e.preventDefault();
      const newName = document.getElementById("modal-student-name").value.trim();
      if (newName) {
        studentName = newName;
        saveAppState();
        initProfile();
        closeModal("profile-modal");
        showToast(`Profile name updated to ${studentName}`);
      }
    });
  }

  // 6. Initialize UI Components
  initProfile();
  initScratchpad();
  renderSubjectDropdowns();
  renderSubjects();
  renderSchedules();
  renderTasks();
  updateStatsAndProgress();
  updateTimerDisplays();

  const pomoCountEl = document.getElementById("pomodoro-completed-count");
  if (pomoCountEl) pomoCountEl.textContent = pomodoroSessionsCompleted;
});
