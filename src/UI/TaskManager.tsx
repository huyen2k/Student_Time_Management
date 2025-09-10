import { useState } from "react"
import Header from "./Layout/Header"
import DashboardView from "./Tasks/DashboardView"
import TasksView from "./Tasks/TasksView"
import CalendarView from "./Tasks/CalendarView"
import TimerView from "./Tasks/TimerView"
import AnalyticsView from "./Tasks/AnalyticsView"
import "../Styles/App.css"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faList } from "@fortawesome/free-solid-svg-icons/faList"
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar"
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons/faChartSimple"

type View = "dashboard" | "tasks" | "calendar" | "timer" | "analytics"

export default function TaskManager() {
    const [activeView, setActiveView] = useState<View>("dashboard")

    return (
        <div className="main-app">
            <Header />
            <div className="main-nav">
                <button
                    className={`nav-btn ${activeView === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveView("dashboard")}
                >
                    <FontAwesomeIcon icon={faHouse} /> Dashboard
                </button>
                <button
                    className={`nav-btn ${activeView === "tasks" ? "active" : ""}`}
                    onClick={() => setActiveView("tasks")}
                >
                    <FontAwesomeIcon icon={faList} /> Tasks
                </button>
                <button
                    className={`nav-btn ${activeView === "calendar" ? "active" : ""}`}
                    onClick={() => setActiveView("calendar")}
                >
                    <FontAwesomeIcon icon={faCalendar} /> Calendar
                </button>
                <button
                    className={`nav-btn ${activeView === "timer" ? "active" : ""}`}
                    onClick={() => setActiveView("timer")}
                >
                    <FontAwesomeIcon icon={faClock} /> Timer
                </button>
                <button
                    className={`nav-btn ${activeView === "analytics" ? "active" : ""}`}
                    onClick={() => setActiveView("analytics")}
                >
                    <FontAwesomeIcon icon={faChartSimple} /> Analytics
                </button>
            </div>

            <div className="view-container">
                {activeView === "dashboard" && <DashboardView />}
                {activeView === "tasks" && <TasksView />}
                {activeView === "calendar" && <CalendarView />}
                {activeView === "timer" && <TimerView />}
                {activeView === "analytics" && <AnalyticsView />}
            </div>
        </div>
    )
}
