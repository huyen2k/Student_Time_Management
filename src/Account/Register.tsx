import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import "./Auth.css"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "" }>({
        text: "",
        type: "",
    })
    const navigate = useNavigate()

    async function register() {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            setMessage({ text: "Register success! Please login.", type: "success" })
            navigate("/") // quay lại login
        } catch (err: any) {
            setMessage({ text: "Register failed: " + err.message, type: "error" })
        }
    }

    return (
        <div className="auth-container">
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
                <button onClick={register}>Register</button>
                <button onClick={() => navigate("/")}>Back to Login</button>
            </div>
        </div>
    )
}
