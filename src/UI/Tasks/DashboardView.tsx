import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../Common/TaskContext"
import "../../Styles/modern.css"
import { CheckCircle2, Clock, Target, TrendingUp, Play, Pause, Calendar, BookOpen } from "lucide-react"

interface DashboardStats {
    totalTasks: number
    completedTasks: number
    todayTasks: number
    weeklyStudyMinutes: number
    completionRate: number
}

export default function DashboardView() {
    const navigate = useNavigate()
    const { tasks, beginTask } = useTasks()

    const [stats, setStats] = useState<DashboardStats>({
        totalTasks: 0,
        completedTasks: 0,
        todayTasks: 0,
        weeklyStudyMinutes: 0,
        completionRate: 0,
    })

    useEffect(() => {
        const completedTasks = tasks.filter((t) => t.status === "completed").length
        const todayTasks = tasks.filter((t) => {
            const today = new Date().toDateString()
            return new Date(t.dueDate).toDateString() === today
        }).length

        setStats({
            totalTasks: tasks.length,
            completedTasks,
            todayTasks,
            weeklyStudyMinutes: tasks.reduce((sum, t) => sum + t.actualTime, 0),
            completionRate: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        })
    }, [tasks])

    const urgentTasks = [...tasks].sort((a, b) => {
        const statusOrder = { "in-progress": 1, pending: 1, completed: 2 }
        const statusDiff = statusOrder[a.status] - statusOrder[b.status]
        if (statusDiff !== 0) return statusDiff

        const dateDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        if (dateDiff !== 0) return dateDiff

        const priorityOrder = { high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    const formatTimeRemaining = (dueDate: string) => {
        const now = new Date()
        const diff = new Date(dueDate).getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        if (hours < 24) return `${hours}h remaining`
        const days = Math.floor(hours / 24)
        return `${days}d remaining`
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "priority-high"
            case "medium":
                return "priority-medium"
            case "low":
                return "priority-low"
            default:
                return "priority-default"
        }
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Track your study progress and upcoming tasks</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Tasks</span>
                        <Target className="stat-icon" />
                    </div>
                    <div className="stat-card-content">
                        <div className="stat-value">{stats.totalTasks}</div>
                        <p className="stat-description">{stats.completedTasks} completed</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Today's Tasks</span>
                        <Calendar className="stat-icon" />
                    </div>
                    <div className="stat-card-content">
                        <div className="stat-value">{stats.todayTasks}</div>
                        <p className="stat-description">Due today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Study Minutes</span>
                        <Clock className="stat-icon" />
                    </div>
                    <div className="stat-card-content">
                        <div className="stat-value">{(stats.weeklyStudyMinutes / 60).toFixed(1)}h</div>
                        <p className="stat-description">This week</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Completion Rate</span>
                        <TrendingUp className="stat-icon" />
                    </div>
                    <div className="stat-card-content">
                        <div className="stat-value">{stats.completionRate}%</div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${stats.completionRate}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        <BookOpen className="title-icon" />
                        Urgent Tasks
                    </h2>
                </div>
                <div className="card-content">
                    {urgentTasks.length === 0 ? (
                        <div className="empty-state">
                            <CheckCircle2 className="empty-icon" />
                            <p className="empty-text">No urgent tasks! Great job!</p>
                        </div>
                    ) : (
                        <div className="urgent-tasks-list">
                            {urgentTasks.slice(0, 10).map((task) => (
                                <div key={task.id} className="task-card urgent-task">
                                    <div className="task-content">
                                        <div className="task-header">
                                            <h3 className="task-title">{task.title}</h3>
                                            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                        </div>

                                        <div className="task-meta">
                                            <span>{task.subject}</span>
                                            <span>{formatTimeRemaining(task.dueDate)}</span>
                                            <span>{task.estimatedTime - task.actualTime}m estimated</span>
                                        </div>

                                        <div className="task-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                                            </div>
                                            <span className="progress-text">{task.progress}% complete</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            beginTask(task.id)
                                            navigate("/app/timer")
                                        }}
                                        disabled={task.status === "completed"}
                                        className={`btn ${task.status === "in-progress" ? "btn-primary" : "btn-secondary"}`}
                                    >
                                        {task.status === "pending" && <Play className="btn-icon" />}
                                        {task.status === "in-progress" && <Pause className="btn-icon" />}
                                        {task.status === "completed" && <CheckCircle2 className="btn-icon" />}

                                        {task.status === "pending" ? "Start" : task.status === "in-progress" ? "Continue" : "Completed"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
