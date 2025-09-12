import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Task } from "../../Data/Types"
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare"

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
          <button className="edit-button" onClick={() => onEdit(task)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className="delete-button" onClick={() => onDelete(task.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && <p className="task-desc">{task.description}</p>}

      {/* Due Date */}
      {due && (
        <p className={`task-due ${isOverdue ? "overdue" : ""}`}>
          Due: {due.toLocaleDateString()}
        </p>
      )}

      {/* Footer */}
      <div className="task-footer">
        <span className={`priority ${task.priority}`}>{task.priority}</span>
        {task.status !== "completed" ? (
          <>
            <button className="task-begin" onClick={() => onStart(task.id)}>
              {task.status === "pending" ? "Start" : "Continue"}
            </button>
            <button className="task-end" onClick={() => onComplete(task.id)}>Complete</button>
          </>
        ) : (
          <button className="task-change" onClick={() => onStatusChange(task.id, "in-progress")}>Reopen</button>
        )}
      </div>
    </div>
  )
}
