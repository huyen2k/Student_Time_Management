import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../../Core/authService"

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
            setMessage({ text: "Register success! Please login.", type: "success" })
            navigate("/") // quay lại login
        } catch (err: any) {
            setMessage({ text: "Register failed: " + err.message, type: "error" })
        }
    }

    return (
        <div className="auth-container">

            <div className="login-header">
                <h1>Student Time Management</h1>
            </div>

            <h2>📝 Register</h2>
            <input
                placeholder="Abc@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {message.text && (
                <p className={`auth-message ${message.type}`}>{message.text}</p>
            )}

            <div className="btn-group">
                <button onClick={handleRegister}>Register</button>
                <button onClick={() => navigate("/")}>Back to Login</button>
            </div>
        </div>
    )
}
