"use client"

import { useLocation, useNavigate } from "react-router-dom"
import Header from "./Layout/Header"
import DashboardView from "./Tasks/DashboardView"
import TasksView from "./Tasks/TasksView"
import CalendarView from "./Tasks/CalendarView"
import TimerView from "./Tasks/TimerView"
import AnalyticsView from "./Tasks/AnalyticsView"
import "../Styles/modern.css"

export default function TaskManager() {
    const location = useLocation()
    const navigate = useNavigate()

    const currentPath = location.pathname.split("/")[2] || "dashboard"
    const handleNavigate = (view: string) => {
        navigate(`/app/${view}`)
    }

    const navigationItems = [
        { id: "dashboard", label: "Dashboard", icon: "home" },
        { id: "tasks", label: "Tasks", icon: "list" },
        { id: "calendar", label: "Calendar", icon: "calendar" },
        { id: "timer", label: "Timer", icon: "clock" },
        { id: "analytics", label: "Analytics", icon: "chart" },
    ]

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "home":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                )
            case "list":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                )
            case "calendar":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                )
            case "clock":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                )
            case "chart":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="20" x2="12" y2="10" />
                        <line x1="18" y1="20" x2="18" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
            <Header />

            <nav className="nav-container">
                <div className="nav-content">
                    <div className="nav-items">
                        {navigationItems.map((item) => {
                            const isActive = currentPath === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className={`nav-item ${isActive ? "active" : ""}`}
                                >
                                    {getIcon(item.icon)}
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                {currentPath === "dashboard" && <DashboardView />}
                {currentPath === "tasks" && <TasksView />}
                {currentPath === "calendar" && <CalendarView />}
                {currentPath === "timer" && <TimerView />}
                {currentPath === "analytics" && <AnalyticsView />}
            </main>
        </div>
    )
}
