export type TaskStatus = "pending" | "in-progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"

export type Task = {
    id: string
    title: string
    description?: string
    subject: string
    priority: TaskPriority
    dueDate: string
    estimatedTime: number
    actualTime: number
    progress: number
    status: TaskStatus
}


export interface User {
    id: string
    email: string
    name: string
    createdAt: Date
}

export interface DashboardStats {
    totalTasks: number
    completedTasks: number
    todayTasks: number
    weeklyStudyHours: number
    completionRate: number
}

export interface StudySession {
    id: string
    taskId: string
    startTime: Date
    endTime?: Date
    duration: number
    type: "pomodoro" | "custom"
    completed: boolean
}

export interface Analytics {
    dailyStudyHours: { date: string; hours: number }[]
    subjectDistribution: { subject: string; percentage: number }[]
    completionTrends: { week: string; rate: number }[]
    productivityHours: { hour: number; efficiency: number }[]
}
