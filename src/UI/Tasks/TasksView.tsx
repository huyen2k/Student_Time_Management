import { useEffect, useState } from "react"
import { listenTasks, addTask, updateTask, deleteTask } from "../../core/taskService"
import type { Task } from "../../Core/types"
import TaskForm from "./TaskForm"
import TaskCard from "./TaskCard"
import CalendarView from "./CalendarView"
import Modal from "../Common/Modal"

export default function TasksView() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [editing, setEditing] = useState<Task | null>(null)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        const unsub = listenTasks((arr) => {
            const sorted = arr.sort((a, b) => (a.due || "").localeCompare(b.due || ""))
            setTasks(sorted)
        })
        return () => unsub()
    }, [])

    async function handleSave(task: Omit<Task, "id">) {
        if (editing) {
            await updateTask(editing.id, task)
            setEditing(null)
        } else {
            await addTask(task)
        }
        setShowForm(false)
    }

    async function handleDelete(id: string) {
        if (confirm("Bạn có chắc muốn xoá nhiệm vụ này?")) {
            await deleteTask(id)
        }
    }

    async function handleStatusChange(id: string, status: Task["status"]) {
        await updateTask(id, { status })
    }

    return (
        <div className="view active">
            <h2>📋 Nhiệm vụ</h2>

            <button className="btn-primary" onClick={() => setShowForm(true)}>
                ➕ Thêm nhiệm vụ
            </button>

            <div className="task-list-grid">
                {tasks.map((t) => (
                    <TaskCard
                        key={t.id}
                        task={t}
                        onEdit={(t) => {
                            setEditing(t)
                            setShowForm(true)
                        }}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>

            <hr style={{ margin: "2rem 0", borderColor: "#333" }} />

            <h3>📅 Lịch nhiệm vụ</h3>
            <CalendarView
                tasks={tasks}
                onEdit={(t) => {
                    setEditing(t)
                    setShowForm(true)
                }}
                onStatusChange={handleStatusChange}
            />

            {/* Modal cho TaskForm */}
            <Modal
                open={showForm}
                title={editing ? "Chỉnh sửa nhiệm vụ" : "Thêm nhiệm vụ"}
                onClose={() => {
                    setEditing(null)
                    setShowForm(false)
                }}
            >
                <TaskForm
                    task={editing ?? undefined}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditing(null)
                        setShowForm(false)
                    }}
                />
            </Modal>
        </div>
    )
}
