"use client"

import { auth } from "../../Infrastructure/firebase"
import { logout } from "../../Core/authService"
import { useNavigate } from "react-router-dom"
import "../../Styles/modern.css"

export default function Header() {
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate("/")
    }

    const userEmail = auth.currentUser?.email || ""
    const userInitials = userEmail.split("@")[0].toLowerCase()

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    <div className="header-logo">
                        <div className="header-logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                        </div>
                        <div className="header-brand">
                            <h1>StudyFlow</h1>
                            <p>Time Management</p>
                        </div>
                    </div>

                    <div className="header-user">
                        <div className="header-user-info">
                            <div className="user-avatar">{userInitials}</div>
                            <div className="user-details">
                                <p>{userEmail}</p>
                                <p>Student</p>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="btn-logout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
