"use client"

import { useState } from "react"
import "../../Styles/modern.css"
import TaskForm from "./TaskForm"
import TaskCard from "./TaskCard"
import { useTasks } from "../Common/TaskContext"
import { useNavigate } from "react-router-dom"

export default function TasksView() {
    const { tasks, addTask, editTask, deleteTask, beginTask, endTask } = useTasks()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("")
    const [subjectFilter, setSubjectFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState<any>(undefined)

    // Lọc task
    const filteredTasks = tasks.filter((task) => {
        let ok = true
        if (searchTerm) {
            ok =
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.subject.toLowerCase().includes(searchTerm.toLowerCase())
        }
        if (ok && subjectFilter !== "all") ok = task.subject === subjectFilter
        if (ok && statusFilter !== "all") ok = task.status === statusFilter
        if (ok && priorityFilter !== "all") ok = task.priority === priorityFilter
        return ok
    })

    const subjects = [...new Set(tasks.map((t) => t.subject))]

    return (
        <div className="tasks-container">
            {/* Header */}
            <div className="tasks-header">
                <div>
                    <h1>Tasks</h1>
                    <p>Manage your assignments and study tasks</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingTask(undefined)
                        setShowForm(true)
                    }}
                >
                    + Add Task
                </button>
            </div>

            {/* Search + Filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Task list */}
            <div className="tasks-grid">
                {filteredTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => {
                            setEditingTask(t)
                            setShowForm(true)
                        }}
                        onDelete={(id) => deleteTask(id)}
                        onStart={(id) => {
                            beginTask(id)
                            navigate("/app/timer")
                        }}
                        onStatusChange={(id, status) => editTask(id, { status })}
                    />
                ))}
            </div>

            {filteredTasks.length === 0 && <div className="no-tasks">No tasks found matching your criteria.</div>}

            {/* Popup form */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <TaskForm
                            task={editingTask}
                            onSubmit={(data) => {
                                if (editingTask) {
                                    editTask(editingTask.id, data)
                                } else {
                                    addTask(data)
                                }
                                setShowForm(false)
                                setEditingTask(undefined)
                            }}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingTask(undefined)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
