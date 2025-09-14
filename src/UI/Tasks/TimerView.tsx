// src/ui/TimerView.tsx
import { useState, useEffect, useRef } from "react"
import { useTasks } from "../Common/TaskContext"
import "../../Styles/modern.css"

interface StudySession {
    id: string
    taskTitle: string
    subject: string
    duration: number
    startTime: Date
    endTime: Date
    completed: boolean
}

export default function TimerView() {
    const { tasks, activeTaskId, isRunning, beginTask, stopTimer, endTask, tickMinute } = useTasks()

    const activeTask = tasks.find((t) => t.id === activeTaskId)
    const incompleteTasks = tasks.filter((t) => t.status !== "completed")

    const [pomodoroTime] = useState(45 * 60)
    const [customTime, setCustomTime] = useState(0)
    const [currentTime, setCurrentTime] = useState(45 * 60)
    const [timerType, setTimerType] = useState<"pomodoro" | "custom">("pomodoro")
    const [customMinutes, setCustomMinutes] = useState(30)
    const [customSeconds, setCustomSeconds] = useState(0)
    const [sessions, setSessions] = useState<StudySession[]>([])
    const [selectedTaskId, setSelectedTaskId] = useState<string | "">("")
    const [showWarning, setShowWarning] = useState(false)
    const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(null)
    const pendingTickRef = useRef(false)

    const secondsSinceLastTickRef = useRef<number>(0)

    useEffect(() => {
        if (activeTask) {
            setCurrentTime(pomodoroTime)
            secondsSinceLastTickRef.current = 0
        }
    }, [activeTaskId])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (isRunning && currentTime > 0) {
            interval = setInterval(() => {
                setCurrentTime((time) => {
                    const next = time - 1
                    secondsSinceLastTickRef.current += 1

                    if (secondsSinceLastTickRef.current >= 60) {
                        secondsSinceLastTickRef.current = 0
                        pendingTickRef.current = true
                    }

                    if (next <= 0) {
                        if (activeTaskId) {
                            setPendingCompleteId(activeTaskId)
                        }
                        return 0
                    }
                    return next
                })
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, currentTime, activeTaskId])

    useEffect(() => {
        if (!pendingTickRef.current) return
        pendingTickRef.current = false
        if (activeTaskId) {
            tickMinute(activeTaskId).catch(console.error)
        }
    }, [activeTaskId, tickMinute, currentTime])

    useEffect(() => {
        if (!pendingCompleteId) return
        const id = pendingCompleteId
        setPendingCompleteId(null) // clear cờ sớm để tránh lặp
        // an toàn: gọi ngoài render
        endTask(id)
    }, [pendingCompleteId, endTask])


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleStart = () => {
        if (timerType === "custom" && !selectedTaskId) {
            setShowWarning(true)
            return
        }

        if (timerType === "pomodoro" && !selectedTaskId && !activeTaskId) {
            setShowWarning(true)
            return
        }

        setShowWarning(false)

        if (timerType === "custom" && customTime === 0) {
            const totalSeconds = customMinutes * 60 + customSeconds
            setCustomTime(totalSeconds)
            setCurrentTime(totalSeconds)
        }
        if (activeTaskId) {
            beginTask(activeTaskId)

        } else {
            beginTask(selectedTaskId)
        }
    }

    const handlePause = () => {
        stopTimer()
    }

    const handleComplete = () => {
        if (activeTaskId || selectedTaskId) {
            const taskId = (activeTaskId || selectedTaskId) as string
            endTask(taskId)
            stopTimer()
            setSessions((prev) => {
                const taskId = (activeTaskId || selectedTaskId || "") as string;
                const task = tasks.find((t) => t.id === taskId);
                const time = timerType === "pomodoro" ? pomodoroTime : customTime;
                const duration = Math.round((time - currentTime) / 60);
                if (duration <= 0) return prev; // Ignore sessions with 0 duration
                return [
                    ...prev,
                    {
                        id: taskId,
                        taskTitle: task?.title ?? "Untitled Task",
                        subject: task?.subject ?? "Unknown Subject",
                        duration: duration,
                        startTime: new Date(Date.now() - duration * 60 * 1000),
                        endTime: new Date(Date.now()),
                        completed: false
                    }
                ];
            })
            setCurrentTime(0)
            setCustomTime(0)
            setCustomMinutes(30)
            setCustomSeconds(0)
        }

        handleTaskSelect("")

    }

    const handleTaskSelect = (taskId: string) => {
        setSelectedTaskId(taskId)
        setShowWarning(false)
    }

    const switchTimerType = (type: "pomodoro" | "custom") => {
        setTimerType(type)
        setCurrentTime(type === "pomodoro" ? pomodoroTime : 0)
        setShowWarning(false)
    }

    const todaySessions = sessions.filter((s) => new Date(s.startTime).toDateString() === new Date().toDateString())
    const totalStudyTime = todaySessions.reduce((total, s) => total + s.duration, 0)

    return (
        <div className="timer-container">
            <div className="timer-header">
                <h1>Study Timer</h1>
                <p>Focus on your studies with Pomodoro technique</p>
            </div>

            <div className="timer-grid">
                {/* Timer */}
                <div className="timer-box">
                    <div className="timer-type">
                        <button className={timerType === "pomodoro" ? "active" : ""} onClick={() => switchTimerType("pomodoro")}>
                            Pomodoro (45min)
                        </button>
                        <button className={timerType === "custom" ? "active" : ""} onClick={() => switchTimerType("custom")}>
                            Custom Timer
                        </button>
                    </div>

                    <div className="timer-display">{formatTime(currentTime)}</div>

                    {timerType === "custom" && !isRunning && (
                        <div className="custom-time">
                            <label>
                                Minutes
                                <input
                                    type="number"
                                    min="0"
                                    max="120"
                                    value={customMinutes}
                                    onChange={(e) => setCustomMinutes(Number(e.target.value) || 0)}
                                />
                            </label>
                            <label>
                                Seconds
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={customSeconds}
                                    onChange={(e) => setCustomSeconds(Number(e.target.value) || 0)}
                                />
                            </label>
                        </div>
                    )}

                    <div className="task-select">
                        <label>
                            Select Task to Study:
                            <select
                                value={selectedTaskId || activeTaskId || ""}
                                onChange={(e) => handleTaskSelect(e.target.value)} disabled={isRunning}>
                                <option value="">Choose a task...</option>
                                {incompleteTasks.map((task) => (
                                    <option key={task.id} value={task.id}>
                                        {task.title} ({task.subject})
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {showWarning && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            Please select a task before starting the custom timer.
                        </div>
                    )}

                    <div className="timer-controls">
                        {!isRunning ? <button onClick={handleStart}>Start</button> : <button onClick={handlePause}>Pause</button>}
                        <button onClick={handleComplete}>End</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-box">
                    <h2>Today's Progress</h2>
                    <p>Total Study Time: {totalStudyTime}m</p>
                    <p>Sessions Completed: {todaySessions.length}</p>
                    <p>Avg. Session: {todaySessions.length > 0 ? Math.round(totalStudyTime / todaySessions.length) : 0}m</p>

                    <h3>Recent Sessions</h3>
                    <ul>
                        {todaySessions.length > 0 ? (
                            todaySessions.slice(0, 5).map((s) => (
                                <li key={s.id}>
                                    <div>
                                        <strong>{s.taskTitle}</strong> ({s.duration}m) -{" "}
                                        {s.startTime.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No sessions today. Start your first one!</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
