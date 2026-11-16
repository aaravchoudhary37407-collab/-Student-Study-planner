# 🎓 Student Study Planner Website

A complete, modern, and beginner-friendly web application built with **HTML5, CSS3, and Vanilla JavaScript (ES6)**. Designed specifically for college and university students to plan study timetables, manage tasks, track academic progress, and stay focused.

---

## 🌟 Complete Feature List

### 1. 🏠 Comprehensive Dashboard & Home Page
- **Navigation Bar**: Quick navigation across *Dashboard, Tasks, Timetable, Subjects, Focus Timer, and Notes*.
- **Student Profile**: Customizable student name and avatar (click to edit).
- **Hero Banner**: Time-of-day greeting (*"Good morning / afternoon / evening"*), live ticking clock, today's date, and rotating motivational study quotes.
- **Progress Tracking**: Real-time metric cards for **Total Tasks**, **Completed Tasks**, **Pending Tasks**, and **Study Sessions**, plus an animated gradient progress bar with percentage indicator.

### 2. 📖 Subject Management
- Preloaded with core subjects: **Python, Mathematics, English, and Computer Science**.
- Add custom subjects with color themes (*Blue, Green, Purple, Orange, Rose*).
- Dynamic subject dropdowns that automatically update across all task and timetable forms.
- Interactive subject chips on the dashboard that filter tasks with one click.
- Option to delete subjects.

### 3. 🗓️ Daily Study Timetable (Schedule)
- Schedule study sessions by selecting subject, date, start time, end time, and topic notes.
- Chronological ordering of sessions with 12-hour AM/PM formatting.
- **🖨️ Print Timetable**: Clean, distraction-free print stylesheet to print your daily schedule or save as PDF.
- Delete study sessions with confirmation.

### 4. 📝 Study Task Manager
- Create study tasks with Title, Subject, Task Type (*Assignment, Reading, Coding Practice, Exam Prep, Revision*), Priority (*🔴 High, 🟡 Medium, 🟢 Low*), and Due Date.
- **Instant Search**: Live search input to filter tasks by title or subject keywords in real time.
- **Filter Tabs**: Filter tasks easily by **All**, **Pending**, or **Completed**.
- **Task Completion Checkbox**:
  - **Pending Tasks**: Warm amber accent border, "⏳ Pending" pill.
  - **Completed Tasks**: Emerald green accent border, strikethrough text, "✅ Completed" badge, and celebratory toast.
- Delete unwanted tasks.

### 5. ⏱️ Built-in Pomodoro Focus Timer
- Integrated study focus timer with **25m Pomodoro**, **5m Short Break**, and **15m Long Break** modes.
- Play, Pause, and Reset controls.
- Web Audio API notification chime when the focus session ends.
- Tracks completed study sessions for the day.

### 6. 📌 Quick Study Scratchpad & Notes
- Built-in notepad to jot down formulas, quick reminders, or professor questions.
- Auto-saves continuously to your browser's storage.

### 7. 💾 Local Storage Persistence & Reset Options
- All subjects, timetable schedules, tasks, notes, and profile settings are saved in your browser's `localStorage`.
- **🔄 Restore Sample Demo Data**: One-click restore button in the footer to reset to clean demo data for college presentations.
- **⚠️ Reset All Data**: Option to wipe data and start completely fresh.

---

## 📁 Project Structure

```
study planner/
│
├── index.html       # Semantic HTML5 markup, dashboard layouts, modals, and templates
├── style.css        # Modern CSS3 styling, variables, grid/flexbox, animations, print media
├── script.js        # Vanilla JS handling state, timers, forms, storage, and DOM updates
└── README.md        # Complete documentation and presentation guide
```

---

## 🚀 How to Open and Run the Website

### Method 1: Direct in Browser (No setup needed)
1. Open the folder: `c:\Users\sujee\OneDrive\Desktop\study planner`.
2. Double-click **`index.html`** to open it in **Google Chrome**, **Microsoft Edge**, **Brave**, or **Mozilla Firefox**.

### Method 2: Live Server in VS Code
1. Open the `study planner` folder in **Visual Studio Code**.
2. Right-click on `index.html` and click **"Open with Live Server"**.

---

## 💡 Technologies Used
- **HTML5**: Semantic tags (`<header>`, `<main>`, `<section>`, `<nav>`, `<form>`, `<dialog>/modal`, `<footer>`).
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Transitions, Media Queries (Mobile + Print).
- **JavaScript (ES6+)**: Pure Vanilla JavaScript with zero external libraries or frameworks. Easy for beginners to read, modify, and explain in college project reviews.
