import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./Infrastructure/firebase"

import Login from "./UI/Account/Login"
import Register from "./UI/Account/Register"
import TaskManager from "./UI/TaskManager"

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    return () => unsub()
  }, [])

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={user ? <TaskManager /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to={user ? "/app" : "/"} />} />
    </Routes>
  )
}
