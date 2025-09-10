import { useEffect, useState } from "react"
import { listenTasks } from "../../Core/taskService"
import type { Task } from "../../Core/types"
import "../../Styles/App.css"

export default function DashboardView() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [studyTime, setStudyTime] = useState<number>(0) // phút

    useEffect(() => {
        const unsub = listenTasks(setTasks)
        return () => unsub()
    }, [])

    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const overdue = tasks.filter(t => !t.completed && t.due && new Date(t.due) < new Date()).length

    return (
        <div className="view active">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-tasks"></i></div>
                    <div className="stat-info">
                        <h3>{total}</h3>
                        <p>Tổng nhiệm vụ</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                    <div className="stat-info">
                        <h3>{completed}</h3>
                        <p>Đã hoàn thành</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
                    <div className="stat-info">
                        <h3>{overdue}</h3>
                        <p>Quá hạn</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-clock"></i></div>
                    <div className="stat-info">
                        <h3>{studyTime} phút</h3>
                        <p>Thời gian học</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
