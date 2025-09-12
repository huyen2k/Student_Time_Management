import { useState, useEffect } from "react"
import "../../Styles/AnalyticsView.css"

interface AnalyticsData {
    totalTasks: number
    completedTasks: number
    totalStudyHours: number
    averageSessionLength: number
    completionRate: number
    subjectBreakdown: { subject: string; hours: number; tasks: number }[]
    weeklyProgress: { day: string; hours: number; tasks: number }[]
    timeEstimationAccuracy: number
    mostProductiveHour: number
    currentStreak: number
}

export default function AnalyticsView() {
    const [timeRange, setTimeRange] = useState("week")
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

    useEffect(() => {
        loadAnalytics()
    }, [timeRange])

    const loadAnalytics = () => {
        const mockAnalytics: AnalyticsData = {
            totalTasks: 45,
            completedTasks: 32,
            totalStudyHours: 67.5,
            averageSessionLength: 42,
            completionRate: 71,
            subjectBreakdown: [
                { subject: "Mathematics", hours: 25.5, tasks: 12 },
                { subject: "Physics", hours: 18.2, tasks: 8 },
                { subject: "English", hours: 15.8, tasks: 10 },
                { subject: "Chemistry", hours: 8.0, tasks: 5 },
            ],
            weeklyProgress: [
                { day: "Mon", hours: 8.5, tasks: 6 },
                { day: "Tue", hours: 12.2, tasks: 8 },
                { day: "Wed", hours: 6.8, tasks: 4 },
                { day: "Thu", hours: 15.5, tasks: 10 },
                { day: "Fri", hours: 11.2, tasks: 7 },
                { day: "Sat", hours: 9.8, tasks: 5 },
                { day: "Sun", hours: 3.5, tasks: 2 },
            ],
            timeEstimationAccuracy: 78,
            mostProductiveHour: 10,
            currentStreak: 7,
        }
        setAnalytics(mockAnalytics)
    }

    if (!analytics) {
        return <div>Loading analytics...</div>
    }

    const maxWeeklyHours = Math.max(...analytics.weeklyProgress.map((d) => d.hours))

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1>Analytics</h1>
                    <p>Track your study patterns and productivity</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="semester">This Semester</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>Completion Rate</h3>
                    <p className="value">{analytics.completionRate}%</p>
                    <span>+5% from last week</span>
                    <div className="progress">
                        <div style={{ width: `${analytics.completionRate}%` }}></div>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Study Hours</h3>
                    <p className="value">{analytics.totalStudyHours}h</p>
                    <span>+12% from last week</span>
                    <p className="small">
                        Avg: {Math.round(analytics.totalStudyHours / 7)}h/day
                    </p>
                </div>

                <div className="metric-card">
                    <h3>Current Streak</h3>
                    <p className="value">{analytics.currentStreak} days</p>
                    <span>Keep it up!</span>
                    <p className="small">Personal best: 14 days</p>
                </div>

                <div className="metric-card">
                    <h3>Time Accuracy</h3>
                    <p className="value">{analytics.timeEstimationAccuracy}%</p>
                    <span>-3% from last week</span>
                    <p className="small">Estimation vs actual</p>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Weekly Progress */}
                <div className="analytics-card">
                    <h2>Weekly Study Hours</h2>
                    {analytics.weeklyProgress.map((day) => (
                        <div key={day.day} className="progress-row">
                            <span>{day.day}</span>
                            <span>
                                {day.hours}h ({day.tasks} tasks)
                            </span>
                            <div className="progress">
                                <div style={{ width: `${(day.hours / maxWeeklyHours) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subject Breakdown */}
                <div className="analytics-card">
                    <h2>Subject Distribution</h2>
                    {analytics.subjectBreakdown.map((s) => (
                        <div key={s.subject} className="progress-row">
                            <span>{s.subject}</span>
                            <span>{s.hours}h ({s.tasks} tasks)</span>
                            <div className="progress">
                                <div style={{ width: `${(s.hours / analytics.totalStudyHours) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Insights */}
                <div className="analytics-card">
                    <h2>Productivity Insights</h2>
                    <div className="insight blue">
                        Most productive at {analytics.mostProductiveHour}:00 → schedule hard tasks here.
                    </div>
                    <div className="insight green">
                        Strength: {analytics.subjectBreakdown[0].subject} ({analytics.subjectBreakdown[0].hours}h)
                    </div>
                    <div className="insight yellow">
                        Time estimation accuracy: {analytics.timeEstimationAccuracy}%. Try smaller tasks.
                    </div>
                    <div className="insight purple">
                        Avg session length: {analytics.averageSessionLength} min → good for Pomodoro.
                    </div>
                </div>

                {/* Goals */}
                <div className="analytics-card">
                    <h2>Weekly Goals</h2>
                    <div className="progress-row">
                        <span>Study 40h</span>
                        <span>{analytics.totalStudyHours}/40h</span>
                        <div className="progress">
                            <div style={{ width: `${(analytics.totalStudyHours / 40) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="progress-row">
                        <span>Complete 35 tasks</span>
                        <span>{analytics.completedTasks}/35</span>
                        <div className="progress">
                            <div style={{ width: `${(analytics.completedTasks / 35) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="progress-row">
                        <span>Maintain 80% rate</span>
                        <span>{analytics.completionRate}/80%</span>
                        <div className="progress">
                            <div style={{ width: `${(analytics.completionRate / 80) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="progress-row">
                        <span>Streak 10 days</span>
                        <span>{analytics.currentStreak}/10</span>
                        <div className="progress">
                            <div style={{ width: `${(analytics.currentStreak / 10) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
