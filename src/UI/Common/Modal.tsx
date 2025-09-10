import type { ReactNode } from "react"
import "../../Styles/App.css"

type Props = {
    open: boolean
    title?: string
    children: ReactNode
    onClose: () => void
}

export default function Modal({ open, title, children, onClose }: Props) {
    if (!open) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose}>✖</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}
