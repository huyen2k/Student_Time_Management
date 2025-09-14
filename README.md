[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)


## 🔗 Deployed Web URL

✍️ [Paste your deployed link here]


## 🎥 Demo Video

✍️ [Paste your video link here]

---

## 💻 Project Introduction

### a. Overview
The **Study Timer & Task Manager** app allows users to log in with **Firebase Authentication**, manage tasks stored in **Firebase Realtime Database**, track study time with **Pomodoro / Custom Timer**, and view deadlines in a **Calendar view**. The app also provides detailed statistics about study sessions.

---

### b. Key Features & Function Manual
- **Full CRUD on Tasks**  
  - Create: add new tasks with title, description, and deadline.  
  - Read: view tasks (active/completed) from Firebase Database.  
  - Update: edit task details (title, deadline, status).  
  - Delete: remove tasks.  

- **Persistent Storage**  
  - Tasks and sessions are stored in **Firebase Realtime Database**.  
  - Real-time synchronization across devices.  

- **Multiple Views (≥3)**  
  - Task List View: list of tasks with status.  
  - Calendar View: visualize deadlines and schedules.  
  - Timer View: Pomodoro or Custom Timer.  
  - Statistics View: total study time, sessions completed, average session length.  

- **Time/Date Handling**  
  - Deadlines stored as timestamps.  
  - Sessions include `startTime`, `endTime`, and `duration`.  
  - Statistics aggregated per day and shown in calendar/statistics.  

- **Authentication**  
  - Firebase Authentication (Email/Password).  
  - User-specific data linked by UID.  

- **Support for 20+ Items**  
  - UI supports long task lists with scrolling and no layout breaking.  

---

### c. Unique Features
- Real-time synchronization of tasks/sessions with **Firebase Realtime Database**.  
- **Calendar view** to easily visualize deadlines.  
- Automatic per-minute tick for active tasks.  
- Detailed daily statistics.  

---

### d. Technology Stack and Implementation Methods
- **Frontend**: React + TypeScript.  
- **State Management**: React Context API (`TaskContext`).  
- **Styling**: Modern CSS.  
- **Backend/Storage**: Firebase Realtime Database.  
- **Authentication**: Firebase Auth (Email/Password).  
- **Calendar**: show deadlines and schedules.  
- **Timer**: implemented with `setInterval` in `useEffect`, handles seconds & minutes.  

---

### e. Service Architecture & Database structure
- **Architecture**:  
  - Components: `TimerView`, `TaskManager`, `CalendarView`, `StatsView`.  
  - Provider: `TaskProvider` manages state and Firebase DB API calls.  
  - Auth Flow: Firebase Auth login → load user tasks → CRUD → sync with Realtime DB.  

- **Database (Firebase Realtime Database structure)**:  
  ```json
  {
    "users": {
      "uid123": {
        "tasks": {
          "task1": {
            "id": "task1",
            "title": "Read chapter 1",
            "deadline": "2025-09-20T12:00:00Z",
            "completed": false
          },
          "task2": {
            "id": "task2",
            "title": "Math exercises",
            "deadline": "2025-09-22T18:00:00Z",
            "completed": true
          }
        },
        "sessions": {
          "session1": {
            "id": "s1",
            "taskId": "task1",
            "startTime": "2025-09-15T08:00:00Z",
            "endTime": "2025-09-15T08:30:00Z",
            "duration": 30
          }
        }
      }
    }
  }
  ```

---

## 🧠 Reflection

### a. If you had more time, what would you expand?
- Add push notifications for upcoming deadlines.  
- Weekly/monthly charts for study progress.  
- Task grouping by subject or priority.  

### b. If you integrate AI APIs more for your app, what would you do?
- Suggest personalized study schedules based on performance.  
- Automatically break large tasks into smaller sessions.  
- Provide feedback on study efficiency and recommend improvements.  

