import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import "./Auth.css"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "" }>({
        text: "",
        type: "",
    })

    async function login() {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setMessage({ text: "Login successful!", type: "success" })
            navigate("/userinfo") // chuyển đến trang thông tin người dùng
        } catch (err: any) {
            setMessage({ text: "Login failed: Email, Password incorrect", type: "error" })
        }
    }

    return (
        <div className="auth-container">
            <h2>🔑 Login</h2>
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
                <button onClick={login}>Login</button>
                <button onClick={() => navigate("/register")}>Go to Register</button>
            </div>
        </div>
    )
}
