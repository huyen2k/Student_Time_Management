import type { Task } from "../../Data/Types"

type Props = {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  onStart: (id: string) => void
  onComplete: (id: string) => void
  onStatusChange: (id: string, status: Task["status"]) => void
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStart,
  onComplete,
  onStatusChange,
}: Props) {
  const due = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = due ? due < new Date() && task.status !== "completed" : false

  return (
    <div className="task-card">
      {/* Header */}
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <div className="task-actions">
          <button onClick={() => onEdit(task)}>✏️</button>
          <button onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
      </div>

      {/* Description */}
      {task.description && <p className="task-desc">{task.description}</p>}

      {/* Due Date */}
      {due && (
        <p className={`task-due ${isOverdue ? "overdue" : ""}`}>
          Due: {due.toLocaleDateString()} {due.toLocaleTimeString()}
        </p>
      )}

      {/* Footer */}
      <div className="task-footer">
        {task.status !== "completed" ? (
          <>
            <button onClick={() => onStart(task.id)}>
              {task.status === "pending" ? "Start" : "Continue"}
            </button>
            <button onClick={() => onComplete(task.id)}>Complete</button>
          </>
        ) : (
          <button onClick={() => onStatusChange(task.id, "in-progress")}>Reopen</button>
        )}
      </div>
    </div>
  )
}
