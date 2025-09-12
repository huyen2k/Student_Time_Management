import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname.split('/')[2] || 'dashboard';
    const handleNavigate = (view: string) => {
        navigate(`/app/${view}`);
    };
    return (
        <div className="main-app">
            <Header />
            <div className="main-nav">
                <button
                    className={`nav-btn ${currentPath === "dashboard" ? "active" : ""}`}
                    onClick={() => handleNavigate("dashboard")}
                >
                    <FontAwesomeIcon icon={faHouse} /> Dashboard
                </button>
                <button
                    className={`nav-btn ${currentPath === "tasks" ? "active" : ""}`}
                    onClick={() => handleNavigate("tasks")}
                >
                    <FontAwesomeIcon icon={faList} /> Tasks
                </button>
                <button
                    className={`nav-btn ${currentPath === "calendar" ? "active" : ""}`}
                    onClick={() => handleNavigate("calendar")}
                >
                    <FontAwesomeIcon icon={faCalendar} /> Calendar
                </button>
                <button
                    className={`nav-btn ${currentPath === "timer" ? "active" : ""}`}
                    onClick={() => handleNavigate("timer")}
                >
                    <FontAwesomeIcon icon={faClock} /> Timer
                </button>
                <button
                    className={`nav-btn ${currentPath === "analytics" ? "active" : ""}`}
                    onClick={() => handleNavigate("analytics")}
                >
                    <FontAwesomeIcon icon={faChartSimple} /> Analytics
                </button>
            </div>

            <div className="view-container">
                {currentPath === "dashboard" && <DashboardView />}
                {currentPath === "tasks" && <TasksView />}
                {currentPath === "calendar" && <CalendarView />}
                {currentPath === "timer" && <TimerView />}
                {currentPath === "analytics" && <AnalyticsView />}
            </div>
        </div>
    )
}
