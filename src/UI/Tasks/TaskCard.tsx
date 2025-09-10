import type { Task } from "../../Core/types"

type Props = {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task["status"]) => void
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const due = task.due ? new Date(task.due) : null
  const isOverdue = due ? due < new Date() && !task.completed : false

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <div className="task-actions">
          <button onClick={() => onEdit(task)}>✏️</button>
          <button onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
      </div>

      <p className="task-desc">{task.description}</p>
      {due && (
        <p className={`task-due ${isOverdue ? "overdue" : ""}`}>
          Hạn: {due.toLocaleDateString()} {due.toLocaleTimeString()}
        </p>
      )}

      <div className="task-footer">
        {task.status !== "completed" ? (
          <button
            onClick={() =>
              onStatusChange(task.id, task.status === "todo" ? "in-progress" : "completed")
            }
          >
            {task.status === "todo" ? "Bắt đầu" : "Hoàn thành"}
          </button>
        ) : (
          <button onClick={() => onStatusChange(task.id, "in-progress")}>Mở lại</button>
        )}
      </div>
    </div>
  )
}
