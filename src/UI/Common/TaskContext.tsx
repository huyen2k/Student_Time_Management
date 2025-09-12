import React, { createContext, useContext, useEffect, useState } from "react"
import { ref, onValue, set, remove, update, runTransaction } from "firebase/database"
import { db } from "../../Infrastructure/firebase"
import type { Task } from "../../Data/Types"

type TaskContextType = {
    tasks: Task[]
    activeTaskId: string | null
    isRunning: boolean
    addTask: (task: Omit<Task, "id">) => void
    editTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
    beginTask: (id: string) => void
    completeTask: (id: string) => void
    stopTask: () => void
    updateProgress: (id: string, progress: number, completed?: boolean) => void
    tickMinute: (id: string) => Promise<void>
    stopTimer: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTasks = () => {
    const ctx = useContext(TaskContext)
    if (!ctx) throw new Error("useTasks must be used within TaskProvider")
    return ctx
}

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
    const [isRunning, setIsRunning] = useState(false)

    // Load Database
    useEffect(() => {
        const tasksRef = ref(db, "tasks")
        const unsubscribe = onValue(tasksRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const loadedTasks: Task[] = Object.entries(data).map(([id, t]: any) => ({
                    id,
                    title: t.title,
                    description: t.description || "",
                    subject: t.subject || "General",
                    priority: t.priority || "low",
                    dueDate: t.dueDate,
                    estimatedTime: t.estimatedTime || 0,
                    actualTime: t.actualTime || 0,
                    progress: t.progress || 0,
                    status: t.status || "pending",
                }))
                setTasks(loadedTasks)
            } else {
                setTasks([])
            }
        })
        return () => unsubscribe()
    }, [])

    // Add task
    const addTask = (task: Omit<Task, "id">) => {
        const id = Date.now().toString()
        const newTask: Task = { id, ...task }
        set(ref(db, `tasks/${id}`), newTask)
    }

    // Edit task
    const editTask = (id: string, updates: Partial<Task>) => {
        update(ref(db, `tasks/${id}`), updates)
    }

    // Delete task
    const deleteTask = (id: string) => {
        remove(ref(db, `tasks/${id}`))
    }

    // Begin / Continue task
    const beginTask = (id: string) => {
        setActiveTaskId(id)
        setIsRunning(true)
        editTask(id, { status: "in-progress" })
    }
    // Stop task
    const stopTask = () => {
        setIsRunning(false)
    }

    // Complete task
    const completeTask = (id: string) => {
        const target = id ?? activeTaskId
        if (!target) return
        editTask(id, { status: "completed", progress: 100 })
        if (target === activeTaskId) {
            setIsRunning(false)
            setActiveTaskId(null)
        }
    }

    // Update progress
    const updateProgress = (id: string, progress: number, completed = false) => {
        editTask(id, {
            progress,
            status: completed ? "completed" : progress > 0 ? "in-progress" : "pending",
        })
    }

    const stopTimer = () => {
        setIsRunning(false)
    }

    const tickMinute = async (id: string) => {
        try {
            const actualRef = ref(db, `tasks/${id}/actualTime`)
            await runTransaction(actualRef, (current) => {
                return (current || 0) + 1
            })
            const taskRef = ref(db, `tasks/${id}`)
            const local = tasks.find((t) => t.id === id)
            if (local) {
                const newActual = (local.actualTime || 0) + 1
                const est = local.estimatedTime || 1
                const newProgress = Math.min(100, Math.round((newActual / est) * 100))
                await update(taskRef, {
                    actualTime: newActual,
                    progress: newProgress,
                    status: newProgress >= 100 ? "completed" : "in-progress",
                })
                if (newProgress >= 100) {
                    if (id === activeTaskId) {
                        setIsRunning(false)
                        setActiveTaskId(null)
                    }
                }
            } else {
                // If not in local state (rare), still increment actualTime already done; optionally update progress later
            }
        } catch (err) {
            console.error("tickMinute error:", err)
        }
    }

    return (
        <TaskContext.Provider
            value={{
                tasks,
                activeTaskId,
                isRunning,
                addTask,
                editTask,
                deleteTask,
                beginTask,
                completeTask,
                stopTask,
                updateProgress,
                tickMinute,
                stopTimer,
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}


/*
interface TaskContextType {
    tasks: Task[]
    activeTaskId: string | null
    isRunning: boolean
    addTask: (task: Omit<Task, "id" | "progress" | "status" | "actualTime">) => void
    editTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
    updateProgress: (id: string, progress: number, completed?: boolean) => void
    beginTask: (id: string) => void
    stopTask: () => void
    completeTask: () => void
    tickTime: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
    const [isRunning, setIsRunning] = useState(false)

    // Load từ Firebase
    useEffect(() => {
        const tasksRef = ref(db, "tasks")
        const unsubscribe = onValue(tasksRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const loadedTasks: Task[] = Object.entries(data).map(([id, t]: any) => ({
                    id,
                    title: t.title,
                    description: t.description || "",
                    subject: t.subject || "General",
                    priority: t.priority || "low",
                    dueDate: t.dueDate,
                    estimatedTime: t.estimatedTime || 0,
                    actualTime: t.actualTime || 0,
                    progress: t.progress || 0,
                    status: t.status || "pending",
                }))
                setTasks(loadedTasks)
            } else {
                setTasks([])
            }
        })
        return () => unsubscribe()
    }, [])

    // CRUD
    const addTask = (task: Omit<Task, "id" | "progress" | "status" | "actualTime">) => {
        const tasksRef = ref(db, "tasks")
        const newTaskRef = push(tasksRef)
        set(newTaskRef, {
            ...task,
            progress: 0,
            status: "pending",
            actualTime: 0,
        })
    }

    const editTask = (id: string, updates: Partial<Task>) => {
        update(ref(db, `tasks/${id}`), updates)
    }

    const deleteTask = (id: string) => {
        remove(ref(db, `tasks/${id}`))
    }

    const updateProgress = (id: string, progress: number, completed = false) => {
        update(ref(db, `tasks/${id}`), {
            progress,
            status: completed ? "completed" : progress > 0 ? "in-progress" : "pending",
        })
    }

    // Timer actions
    const beginTask = (id: string) => {
        setActiveTaskId(id)
        setIsRunning(true)
        update(ref(db, `tasks/${id}`), { status: "in-progress" })
    }

    const stopTask = () => {
        setIsRunning(false)
    }

    const completeTask = () => {
        if (activeTaskId) {
            updateProgress(activeTaskId, 100, true)
            setIsRunning(false)
            setActiveTaskId(null)
        }
    }

    // Tick actual time (ví dụ gọi mỗi 60s trong TimerView)
    const tickTime = () => {
        if (activeTaskId) {
            const task = tasks.find((t) => t.id === activeTaskId)
            if (task) {
                update(ref(db, `tasks/${task.id}`), {
                    actualTime: task.actualTime + 1, // +1 phút học
                })
            }
        }
    }

    return (
        <TaskContext.Provider
            value={{
                tasks,
                activeTaskId,
                isRunning,
                addTask,
                editTask,
                deleteTask,
                updateProgress,
                beginTask,
                stopTask,
                completeTask,
                tickTime,
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TaskContext)
    if (!context) throw new Error("useTasks must be used within TaskProvider")
    return context
}
*/