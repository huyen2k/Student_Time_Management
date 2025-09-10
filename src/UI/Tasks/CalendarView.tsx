import { useState } from "react"
import type { Task } from "../../Core/types"

type Props = {
    tasks: Task[]
    onEdit: (t: Task) => void
    onStatusChange: (id: string, status: Task["status"]) => void
}

export default function CalendarView({ tasks, onEdit, onStatusChange }: Props) {
    const [current, setCurrent] = useState(new Date())
    const [selected, setSelected] = useState<Date | null>(null)

    const start = new Date(current.getFullYear(), current.getMonth(), 1)
    const end = new Date(current.getFullYear(), current.getMonth() + 1, 0)

    const days: Date[] = []
    for (let i = 1; i <= end.getDate(); i++) {
        days.push(new Date(current.getFullYear(), current.getMonth(), i))
    }

    function getTasksForDay(day: Date) {
        return tasks.filter(
            (t) => t.due && new Date(t.due).toDateString() === day.toDateString()
        )
    }

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}>
                    ◀
                </button>
                <h3>
                    {current.toLocaleString("default", { month: "long" })} {current.getFullYear()}
                </h3>
                <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}>
                    ▶
                </button>
            </div>

            <div className="calendar-grid">
                {days.map((day) => {
                    const has = getTasksForDay(day)
                    return (
                        <div
                            key={day.toISOString()}
                            className={`calendar-day ${selected?.toDateString() === day.toDateString() ? "selected" : ""}`}
                            onClick={() => setSelected(day)}
                        >
                            <span>{day.getDate()}</span>
                            {has.length > 0 && <span className="dot"></span>}
                        </div>
                    )
                })}
            </div>

            {selected && (
                <div className="calendar-tasks">
                    <h4>Nhiệm vụ ngày {selected.toLocaleDateString()}</h4>
                    <ul>
                        {getTasksForDay(selected).map((t) => (
                            <li key={t.id}>
                                {t.title} - {t.status}
                                <button onClick={() => onEdit(t)}>✏️</button>
                                <button
                                    onClick={() =>
                                        onStatusChange(
                                            t.id,
                                            t.status === "todo"
                                                ? "in-progress"
                                                : t.status === "in-progress"
                                                    ? "completed"
                                                    : "todo"
                                        )
                                    }
                                >
                                    Đổi trạng thái
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
