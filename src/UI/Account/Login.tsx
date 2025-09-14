"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../Core/authService"
import "../../Styles/modern.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen } from "@fortawesome/free-solid-svg-icons"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "" }>({
        text: "",
        type: "",
    })

    async function handleLogin() {
        try {
            await login(email, password)
            setMessage({ text: "Login successful!", type: "success" })
            navigate("/app")
        } catch (err: any) {
            setMessage({ text: "Login failed: Email or password incorrect", type: "error" })
        }
    }

    return (
        <div className="login-container">
            <div className="card login-card">
                <div className="card-header text-center">
                    <div className="login-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <h1 className="card-title">Student Time Management</h1>
                    <p className="card-description">Sign in to manage your tasks and schedule</p>
                </div>

                <div className="card-content">
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                type="email"
                                autoComplete="username"
                                placeholder="student@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <circle cx="12" cy="16" r="1" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>{message.text}</div>
                    )}

                    <div className="space-y-4">
                        <button onClick={handleLogin} className="btn btn-primary btn-lg w-full">
                            Sign In
                        </button>

                        <button onClick={() => navigate("/register")} className="btn btn-secondary btn-lg w-full">
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
