"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../../Core/authService"
import "../../Styles/modern.css"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "" }>({
        text: "",
        type: "",
    })
    const navigate = useNavigate()

    async function handleRegister() {
        try {
            await register(email, password)
            setMessage({ text: "Registration successful! Please sign in.", type: "success" })
            setTimeout(() => navigate("/"), 2000)
        } catch (err: any) {
            setMessage({ text: "Registration failed: " + err.message, type: "error" })
        }
    }

    return (
        <div className="register-container">
            <div className="card register-card">
                <div className="card-header text-center">
                    <div className="login-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <h1 className="card-title">Create Your Account</h1>
                    <p className="card-description">Join StudyFlow to start managing your time effectively</p>
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
                                placeholder="Create a strong password"
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
                        <button onClick={handleRegister} className="btn btn-primary btn-lg w-full btn-with-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                            Create Account
                        </button>

                        <button onClick={() => navigate("/")} className="btn btn-secondary btn-lg w-full">
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
