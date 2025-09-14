"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Task, TaskPriority, TaskStatus } from "../../Data/Types"
import "../../Styles/modern.css"

type Props = {
    task?: Task
    onSubmit: (task: Omit<Task, "id">) => void
    onCancel: () => void
}

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Other",
]

export default function TaskForm({ task, onSubmit, onCancel }: Props) {
    const [formData, setFormData] = useState<Omit<Task, "id">>({
        title: "",
        description: "",
        subject: "",
        priority: "low",
        dueDate: new Date().toISOString(),
        estimatedTime: 1,
        actualTime: 0,
        progress: 0,
        status: "pending",
    })

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || "",
                subject: task.subject,
                priority: task.priority,
                dueDate: task.dueDate,
                estimatedTime: task.estimatedTime,
                actualTime: task.actualTime,
                progress: task.progress,
                status: task.status,
            })
        }
    }, [task])

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.subject) return
        onSubmit(formData)
    }

    return (
        <div className="task-form-container">
            <h2>{task ? "Edit Task" : "Create New Task"}</h2>
            <form onSubmit={handleSubmit} className="task-form">
                {/* Title */}
                <div className="form-group">
                    <label>Task Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </div>

                {/* Subject + Priority */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Subject *</label>
                        <select value={formData.subject} onChange={(e) => handleChange("subject", e.target.value)} required>
                            <option value="">-- Select subject --</option>
                            {subjects.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => handleChange("priority", e.target.value as TaskPriority)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* Due Date + Estimated Time */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Due Date *</label>
                        <input
                            type="date"
                            value={formData.dueDate.slice(0, 10)}
                            onChange={(e) => {
                                const date = new Date(e.target.value)
                                handleChange("dueDate", date.toISOString())
                            }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Estimated Time (minutes)</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={formData.estimatedTime}
                            onChange={(e) => handleChange("estimatedTime", Number(e.target.value) || 1)}
                        />
                    </div>
                </div>

                {/* Progress + Status (only when editing) */}
                {task && (
                    <div className="form-row">
                        <div className="form-group">
                            <label>Progress (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={(e) => handleChange("progress", Number(e.target.value) || 0)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select value={formData.status} onChange={(e) => handleChange("status", e.target.value as TaskStatus)}>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="form-buttons">
                    <button type="button" className="btn cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn submit">
                        {task ? "Update Task" : "Create Task"}
                    </button>
                </div>
            </form>
        </div>
    )
}
