// src/ui/TimerView.tsx
import { useState, useEffect, useRef } from "react"
import { useTasks } from "../Common/TaskContext"
import "../../Styles/TimerView.css"

interface StudySession {
    id: string
    taskTitle: string
    subject: string
    duration: number // minutes
    startTime: Date
    endTime: Date
    completed: boolean
}

export default function TimerView() {
    const {
        tasks,
        activeTaskId,
        isRunning,
        beginTask,
        stopTimer,
        completeTask,
        tickMinute,
    } = useTasks()

    const activeTask = tasks.find((t) => t.id === activeTaskId)

    const [pomodoroTime] = useState(25 * 60) // seconds
    const [customTime, setCustomTime] = useState(0) // seconds
    const [currentTime, setCurrentTime] = useState(25 * 60)
    const [timerType, setTimerType] = useState<"pomodoro" | "custom">("pomodoro")
    const [customMinutes, setCustomMinutes] = useState(25)
    const [customSeconds, setCustomSeconds] = useState(0)
    const [sessions, setSessions] = useState<StudySession[]>([])

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
                        if (activeTaskId) {
                            tickMinute(activeTaskId).catch((e) => console.error(e))
                        }
                    }

                    if (next <= 0) {
                        if (activeTaskId) completeTask(activeTaskId)
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
    }

    const handleStart = () => {
        if (timerType === "custom" && customTime === 0) {
            const totalSeconds = customMinutes * 60 + customSeconds
            setCustomTime(totalSeconds)
            setCurrentTime(totalSeconds)
        }
        if (activeTaskId) {
            beginTask(activeTaskId)
        } else {
            console.warn("No active task selected to start.")
        }
    }

    const handlePause = () => {
        stopTimer()
    }

    const handleComplete = () => {
        if (activeTaskId) {
            completeTask(activeTaskId)
            stopTimer()
            setCurrentTime(0)
        }
    }

    const switchTimerType = (type: "pomodoro" | "custom") => {
        setTimerType(type)
        setCurrentTime(type === "pomodoro" ? pomodoroTime : 0)
    }

    const todaySessions = sessions.filter(
        (s) => new Date(s.startTime).toDateString() === new Date().toDateString()
    )
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
                        <button
                            className={timerType === "pomodoro" ? "active" : ""}
                            onClick={() => switchTimerType("pomodoro")}
                        >
                            Pomodoro (25min)
                        </button>
                        <button
                            className={timerType === "custom" ? "active" : ""}
                            onClick={() => switchTimerType("custom")}
                        >
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
                                    onChange={(e) =>
                                        setCustomMinutes(Number(e.target.value) || 0)
                                    }
                                />
                            </label>
                            <label>
                                Seconds
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={customSeconds}
                                    onChange={(e) =>
                                        setCustomSeconds(Number(e.target.value) || 0)
                                    }
                                />
                            </label>
                        </div>
                    )}

                    <div className="task-select">
                        <label>
                            Currently studying:
                            <input
                                type="text"
                                value={activeTask ? activeTask.title : ""}
                                readOnly
                            />
                        </label>
                    </div>

                    <div className="timer-controls">
                        {!isRunning ? (
                            <button onClick={handleStart}>Start</button>
                        ) : (
                            <button onClick={handlePause}>Pause</button>
                        )}
                        <button onClick={handleComplete}>Complete</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-box">
                    <h2>Today's Progress</h2>
                    <p>Total Study Time: {totalStudyTime}m</p>
                    <p>Sessions Completed: {todaySessions.length}</p>
                    <p>
                        Avg. Session:{" "}
                        {todaySessions.length > 0
                            ? Math.round(totalStudyTime / todaySessions.length)
                            : 0}
                        m
                    </p>

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