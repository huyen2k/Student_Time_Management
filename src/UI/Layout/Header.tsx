import { auth } from "../../Infrastructure/firebase"
import { logout } from "../../Core/authService"
import { useNavigate } from "react-router-dom"
import "../../Styles/Layout.css"

export default function Header() {
    const navigate = useNavigate()
    async function handleLogout() {
        await logout()
        navigate("/")
    }
    return (
        <header className="app-header">
            <div className="header-content">
                <h1>Student Time Management</h1>
            </div>
            <div className="user-info">
                <span>{auth.currentUser?.email}</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    )
}
