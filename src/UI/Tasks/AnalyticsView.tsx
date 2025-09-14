import { useState, useMemo } from "react"
import { useTasks } from "../Common/TaskContext"
import "../../Styles/modern.css"
import { differenceInCalendarDays, format } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnalyticsView() {
    const { tasks } = useTasks()
    const [timeRange, setTimeRange] = useState("week")

    const analytics = useMemo(() => {
        if (!tasks || tasks.length === 0) return null

        const totalTasks = tasks.length
        const completedTasks = tasks.filter((t) => t.status === "completed").length
        const totalStudyHours = tasks.reduce((sum, t) => sum + (t.actualTime || 0) / 60, 0)

        const estimationAccuracies: number[] = []
        tasks.forEach((t) => {
            if (t.estimatedTime && t.actualTime) {
                const estMinutes = t.estimatedTime * 60
                const diff = Math.abs(t.actualTime - estMinutes)
                const acc = Math.max(0, 100 - Math.round((diff / estMinutes) * 100))
                estimationAccuracies.push(acc)
            }
        })
        const timeEstimationAccuracy =
            estimationAccuracies.length > 0
                ? Math.round(estimationAccuracies.reduce((a, b) => a + b, 0) / estimationAccuracies.length)
                : 0

        const averageSessionLength = completedTasks > 0 ? Math.round((totalStudyHours * 60) / completedTasks) : 0

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        const subjectMap: Record<string, { hours: number; tasks: number }> = {}
        tasks.forEach((t) => {
            const subject = t.subject || "Other"
            if (!subjectMap[subject]) {
                subjectMap[subject] = { hours: 0, tasks: 0 }
            }
            subjectMap[subject].hours += (t.actualTime || 0) / 60
            subjectMap[subject].tasks += 1
        })
        const subjectBreakdown = Object.entries(subjectMap).map(([subject, { hours, tasks }]) => ({
            subject,
            hours,
            tasks,
        }))

        const today = new Date()
        const weeklyProgress: { day: string; hours: number; tasks: number }[] = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const hours = tasks
                .filter((t) => differenceInCalendarDays(new Date(t.dueDate), d) === 0)
                .reduce((sum, t) => sum + (t.actualTime || 0) / 60, 0)
            const taskCount = tasks.filter((t) => differenceInCalendarDays(new Date(t.dueDate), d) === 0).length
            weeklyProgress.push({
                day: format(d, "EEE"),
                hours,
                tasks: taskCount,
            })
        }

        const mostProductiveHour =
            Object.entries(
                tasks.reduce((map: Record<number, number>, t) => {
                    const h = new Date(t.dueDate).getHours()
                    map[h] = (map[h] || 0) + 1
                    return map
                }, {}),
            ).sort((a, b) => b[1] - a[1])[0]?.[0] || 0

        let streak = 0
        const current = new Date()
        while (true) {
            const doneToday = tasks.some(
                (t) => t.status === "completed" && differenceInCalendarDays(new Date(t.dueDate), current) === 0,
            )
            if (doneToday) {
                streak++
                current.setDate(current.getDate() - 1)
            } else break
        }

        return {
            totalTasks,
            completedTasks,
            totalStudyHours: Number(totalStudyHours.toFixed(1)),
            averageSessionLength,
            completionRate,
            subjectBreakdown,
            weeklyProgress,
            timeEstimationAccuracy,
            mostProductiveHour: Number(mostProductiveHour),
            currentStreak: streak,
        }
    }, [tasks, timeRange])

    if (!analytics) return <div>Don't have analytics data</div>

    const maxWeeklyHours = Math.max(...analytics.weeklyProgress.map((d) => d.hours))

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <div>
                    <h1>Analytics</h1>
                    <p>Track your study patterns and productivity</p>
                </div>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>Completion Rate</h3>
                    <p className="value">{analytics.completionRate}%</p>
                    <div className="progress">
                        <div style={{ width: `${analytics.completionRate}%` }}></div>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Study Hours</h3>
                    <p className="value">{analytics.totalStudyHours}h</p>
                    <p className="small">Avg: {Math.round(analytics.totalStudyHours / 7)}h/day</p>
                </div>

                <div className="metric-card">
                    <h3>Current Streak</h3>
                    <p className="value">{analytics.currentStreak} days</p>
                </div>

                <div className="metric-card">
                    <h3>Time Accuracy</h3>
                    <p className="value">{analytics.timeEstimationAccuracy}%</p>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Weekly Progress Chart */}
                <div className="analytics-card">
                    <h2>Weekly Study Hours</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="hours" fill="#15803d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Subject Breakdown list */}
                <div className="analytics-card">
                    <h2>Subject Distribution</h2>
                    {analytics.subjectBreakdown.map((s) => (
                        <div key={s.subject} className="progress-row">
                            <span>{s.subject}</span>
                            <span>
                                {s.hours.toFixed(1)}h ({s.tasks} tasks)
                            </span>
                            <div className="progress">
                                <div
                                    style={{
                                        width: `${analytics.totalStudyHours > 0 ? (s.hours / analytics.totalStudyHours) * 100 : 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Insights */}
                <div className="analytics-card">
                    <h2>Productivity Insights</h2>
                    <div className="insight blue">Most productive at {analytics.mostProductiveHour}:00</div>
                    <div className="insight green">
                        Strength: {analytics.subjectBreakdown[0].subject} ({analytics.subjectBreakdown[0].hours.toFixed(1)}h)
                    </div>
                    <div className="insight yellow">Time estimation accuracy: {analytics.timeEstimationAccuracy}%</div>
                    <div className="insight purple">Avg session length: {analytics.averageSessionLength} min</div>
                </div>
            </div>
        </div>
    )
}
