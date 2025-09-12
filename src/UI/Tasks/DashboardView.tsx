import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../Common/TaskContext"
import "../../Styles/DashboardView.css"

interface DashboardStats {
    totalTasks: number
    completedTasks: number
    todayTasks: number
    weeklyStudyHours: number
    completionRate: number
}

export default function DashboardView() {
    const navigate = useNavigate()
    const { tasks, beginTask } = useTasks()

    const [stats, setStats] = useState<DashboardStats>({
        totalTasks: 0,
        completedTasks: 0,
        todayTasks: 0,
        weeklyStudyHours: 0,
        completionRate: 0,
    })

    // Calculate stats from tasks
    useEffect(() => {
        const completedTasks = tasks.filter(t => t.status === "completed").length
        const todayTasks = tasks.filter(t => {
            const today = new Date().toDateString()
            return new Date(t.dueDate).toDateString() === today
        }).length

        setStats({
            totalTasks: tasks.length,
            completedTasks,
            todayTasks,
            weeklyStudyHours: tasks.reduce((sum, t) => sum + t.actualTime / 60, 0), // giờ học
            completionRate: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        })
    }, [tasks])

    const urgentTasks = tasks.filter(t => t.priority === "high")

    const formatTimeRemaining = (dueDate: string) => {
        const now = new Date()
        const diff = new Date(dueDate).getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        if (hours < 24) return `${hours}h remaining`
        const days = Math.floor(hours / 24)
        return `${days}d remaining`
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Track your study progress and upcoming tasks</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p className="stat-value">{stats.totalTasks}</p>
                    <span>{stats.completedTasks} completed</span>
                </div>
                <div className="stat-card">
                    <h3>Today's Tasks</h3>
                    <p className="stat-value">{stats.todayTasks}</p>
                    <span>Due today</span>
                </div>
                <div className="stat-card">
                    <h3>Study Hours</h3>
                    <p className="stat-value">{stats.weeklyStudyHours.toFixed(1)}h</p>
                    <span>This week</span>
                </div>
                <div className="stat-card">
                    <h3>Completion Rate</h3>
                    <p className="stat-value">{stats.completionRate}%</p>
                    <span>+5% from last week</span>
                </div>
            </div>

            {/* Urgent Tasks */}
            <div className="urgent-tasks">
                <h2>Urgent Tasks</h2>
                {urgentTasks.map(task => (
                    <div key={task.id} className="urgent-task-card">
                        <div className="task-info">
                            <div className="task-title">
                                <h3>{task.title}</h3>
                                <span className={`priority ${task.priority}`}>{task.priority}</span>
                            </div>
                            <div className="task-meta">
                                <span>{task.subject}</span>
                                <span>{formatTimeRemaining(task.dueDate)}</span>
                                <span>{task.estimatedTime}h estimated</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${task.progress}%` }}
                                ></div>
                            </div>
                            <span className="progress-label">{task.progress}%</span>
                        </div>
                        <div className="task-action">
                            <button
                                onClick={() => {
                                    beginTask(task.id)
                                    navigate("/timer")
                                }}
                            >
                                {task.status === "pending" ? "Start" : "Continue"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
