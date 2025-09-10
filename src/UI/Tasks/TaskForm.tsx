import { useState } from "react"
import type { Task } from "../../Core/types"

type Props = {
    task?: Task
    onSave: (t: Omit<Task, "id">) => void
    onCancel: () => void
}

export default function TaskForm({ task, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(task?.title || "")
    const [description, setDescription] = useState(task?.description || "")
    const [due, setDue] = useState(task?.due ? task.due.slice(0, 16) : "")
    const [error, setError] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) {
            setError("Tên nhiệm vụ bắt buộc")
            return
        }
        if (!due) {
            setError("Ngày hạn bắt buộc")
            return
        }
        onSave({
            title,
            description,
            due: new Date(due).toISOString(),
            completed: task?.completed || false,
            status: task?.status || "todo",
        })
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên nhiệm vụ"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả"
            />
            <input
                type="datetime-local"
                value={due}
                onChange={(e) => setDue(e.target.value)}
            />

            {error && <p className="form-error">{error}</p>}

            <div className="form-buttons">
                <button type="submit">{task ? "Cập nhật" : "Thêm"}</button>
                <button type="button" onClick={onCancel}>
                    Huỷ
                </button>
            </div>
        </form>
    )
}
