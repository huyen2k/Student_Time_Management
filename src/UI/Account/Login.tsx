import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../Core/authService"
import "../../Styles/Account.css"

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
            navigate("/app") // chuyển đến trang thông tin người dùng
        } catch (err: any) {
            setMessage({ text: "Login failed: Email, Password incorrect", type: "error" })
        }
    }

    return (
        <div className="auth-container">

            <div className="login-header">
                <h1>Student Time Management</h1>
            </div>

            <h2> 🔑 Login</h2>
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
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => navigate("/register")}>Go to Register</button>
            </div>
        </div>
    )
}
