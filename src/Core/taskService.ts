import { db, auth } from "../Infrastructure/firebase"
import { ref, push, update, remove, onValue } from "firebase/database"
import type { Task } from "./types"

export function listenTasks(callback: (tasks: Task[]) => void) {
    if (!auth.currentUser) return () => { }
    const path = `users/${auth.currentUser.uid}/tasks`
    const tasksRef = ref(db, path)
    const unsubscribe = onValue(tasksRef, (snap) => {
        const data = snap.val() || {}
        const arr: Task[] = Object.entries(data).map(([id, v]: any) => ({
            id,
            ...(v as Omit<Task, "id">)
        }))
        callback(arr)
    })
    // onValue returns an unsubscribe function that accepts no args; to be safe return a removal closure
    return unsubscribe
}

export async function addTask(task: Omit<Task, "id">) {
    if (!auth.currentUser) throw new Error("Not authenticated")
    const tasksRef = ref(db, `users/${auth.currentUser.uid}/tasks`)
    await push(tasksRef, task)
}

export async function updateTask(id: string, patch: Partial<Task>) {
    if (!auth.currentUser) throw new Error("Not authenticated")
    const taskRef = ref(db, `users/${auth.currentUser.uid}/tasks/${id}`)
    await update(taskRef, patch)
}

export async function deleteTask(id: string) {
    if (!auth.currentUser) throw new Error("Not authenticated")
    const taskRef = ref(db, `users/${auth.currentUser.uid}/tasks/${id}`)
    await remove(taskRef)
}
