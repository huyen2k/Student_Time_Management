import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import "./UserInfo.css"

export default function UserInfo() {
    const navigate = useNavigate()

    async function logout() {
        try {
            await signOut(auth)
            navigate("/") // quay về trang Login sau khi logout
        } catch (err: any) {
            console.error("Logout error:", err)
        }
    }

    return (
        <div className="user-info">
            <span>Xin chào, {auth.currentUser?.email}</span>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
