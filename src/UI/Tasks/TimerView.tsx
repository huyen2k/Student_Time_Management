import { useState, useEffect } from "react"
import "../../Styles/App.css"

export default function TimerView() {
    const [seconds, setSeconds] = useState(25 * 60)
    const [running, setRunning] = useState(false)

    useEffect(() => {
        let timer: any
        if (running && seconds > 0) {
            timer = setInterval(() => setSeconds(s => s - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [running, seconds])

    function toggle() {
        setRunning(!running)
    }

    function reset() {
        setRunning(false)
        setSeconds(25 * 60)
    }

    const m = Math.floor(seconds / 60)
    const s = seconds % 60

    return (
        <div className="view active">
            <h2>⏱ Pomodoro Timer</h2>
            <div className="timer-display">{`${m}:${s < 10 ? "0" : ""}${s}`}</div>
            <div className="btn-group">
                <button onClick={toggle}>{running ? "Pause" : "Start"}</button>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    )
}
