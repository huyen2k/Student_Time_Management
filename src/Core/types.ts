// src/core/types.ts
export type TaskStatus = "todo" | "in-progress" | "completed"

export type Task = {
    id: string
    title: string
    description?: string
    due: string
    completed: boolean
    status: TaskStatus
}
