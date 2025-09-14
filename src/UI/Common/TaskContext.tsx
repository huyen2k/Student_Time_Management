import React, { createContext, useContext, useEffect, useState } from "react"
import { ref, onValue, set, remove, update, runTransaction, push } from "firebase/database"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../Infrastructure/firebase"
import type { Task } from "../../Data/Types"

type TaskContextType = {
    tasks: Task[]
    activeTaskId: string | null
    isRunning: boolean
    addTask: (task: Omit<Task, "id">) => void
    editTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
    beginTask: (id: string) => void
    endTask: (id: string) => void
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
    const [userId, setUserId] = useState<string | null>(null)

    // Load Database
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
                const tasksRef = ref(db, `users/${user.uid}/tasks`)
                onValue(tasksRef, (snapshot) => {
                    const data = snapshot.val()
                    if (data) {
                        const loaded: Task[] = Object.entries(data).map(([id, t]: any) => ({
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
                        setTasks(loaded)
                    } else {
                        setTasks([])
                    }
                })
            } else {
                setUserId(null)
                setTasks([])
            }
        })
        return () => unsubAuth()
    }, [])

    // Add task
    const addTask = (task: Omit<Task, "id">) => {
        if (!userId) return
        const tasksRef = ref(db, `users/${userId}/tasks`)
        const newTaskRef = push(tasksRef)
        const newTask: Task = { id: newTaskRef.key!, ...task }
        set(newTaskRef, newTask)
    }

    // Edit task
    const editTask = (id: string, updates: Partial<Task>) => {
        if (!userId) return
        update(ref(db, `users/${userId}/tasks/${id}`), updates)
    }

    // Delete task
    const deleteTask = (id: string) => {
        if (!userId) return
        remove(ref(db, `users/${userId}/tasks/${id}`))
    }

    // Begin / Continue task
    const beginTask = (id: string) => {
        const task = tasks.find((t) => t.id === id)
        if (!task) return
        setActiveTaskId(task.id)
        setIsRunning(true)
        editTask(task.id, { status: "in-progress" })
    }
    // Stop task
    const stopTask = () => {
        setIsRunning(false)
    }

    // Complete task
    const endTask = (id: string) => {
        const target = id ?? activeTaskId
        if (!target || !userId) return
        if (target === activeTaskId) {
            setIsRunning(false)
            setActiveTaskId(null)
        }
    }

    // Update progress
    const updateProgress = (id: string, progress: number, completed = false) => {
        if (!userId) return
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
            if (!userId) return
            const actualRef = ref(db, `users/${userId}/tasks/${id}/actualTime`)
            await runTransaction(actualRef, (current) => {
                return (current || 0) + 1
            })
            const taskRef = ref(db, `users/${userId}/tasks/${id}`)
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
                endTask,
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
