import { useState } from "react"
import "../../Styles/CalendarView.css"
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    format,
} from "date-fns"
import { useTasks } from "../Common/TaskContext"
import type { Task } from "../../Data/Types"

export default function CalendarView() {
    const { tasks } = useTasks()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const firstDayOfWeek = monthStart.getDay()
    const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
        const date = new Date(monthStart)
        date.setDate(date.getDate() - (firstDayOfWeek - i))
        return date
    })

    const totalCells = 42
    const trailingDays = Array.from(
        { length: totalCells - paddingDays.length - calendarDays.length },
        (_, i) => {
            const date = new Date(monthEnd)
            date.setDate(date.getDate() + i + 1)
            return date
        }
    )

    const allCalendarDays = [...paddingDays, ...calendarDays, ...trailingDays]

    const getTasksForDate = (date: Date) =>
        tasks.filter((task: Task) =>
            isSameDay(new Date(task.dueDate), date)
        )

    const navigateMonth = (dir: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            newDate.setMonth(newDate.getMonth() + (dir === "next" ? 1 : -1))
            return newDate
        })
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : []

    return (
        <div className="calendar-container">
            {/* Header */}
            <div className="calendar-header">
                <h1>Calendar</h1>
                <div className="calendar-controls">
                    <button onClick={() => navigateMonth("prev")}>◀</button>
                    <span>{format(currentDate, "MMMM yyyy")}</span>
                    <button onClick={() => navigateMonth("next")}>▶</button>
                    <button onClick={goToToday}>Today</button>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="day-header">
                        {day}
                    </div>
                ))}

                {allCalendarDays.map((date, idx) => {
                    const dayTasks = getTasksForDate(date)
                    const isCurrent = isSameMonth(date, currentDate)
                    const isSel = selectedDate && isSameDay(date, selectedDate)
                    const today = isToday(date)

                    return (
                        <div
                            key={idx}
                            className={`calendar-day 
    ${isCurrent ? "" : "not-current"} 
    ${isSel ? "selected" : ""} 
    ${today && isSel ? "today" : ""}`}
                            onClick={() => {
                                setSelectedDate(date)
                                if (!isCurrent) {
                                    setCurrentDate(date)
                                }
                            }}
                        >
                            <div className="date-num">{format(date, "d")}</div>
                            <div className="tasks-preview">
                                {dayTasks.slice(0, 2).map((t) => (
                                    <div
                                        key={t.id}
                                        className={`task-dot ${t.priority}`}
                                        title={t.title}
                                    ></div>
                                ))}
                                {dayTasks.length > 2 && (
                                    <span className="more">+{dayTasks.length - 2}</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Selected date tasks */}
            <div className="selected-tasks">
                <h2>
                    {selectedDate
                        ? format(selectedDate, "MMM d, yyyy")
                        : "Select a date"}
                </h2>
                {selectedDate ? (
                    selectedTasks.length > 0 ? (
                        <ul>
                            {selectedTasks.map((t) => (
                                <li key={t.id} className={`task-item ${t.status}`}>
                                    <div>
                                        <strong>{t.title}</strong> <span>({t.subject})</span>
                                    </div>
                                    <span className="status">{t.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tasks for this date</p>
                    )
                ) : (
                    <p>Click on a date to view tasks</p>
                )}
            </div>
        </div>
    )
}
