import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Account/Login"
import Register from "./Account/Register"
import UserInfo from "./Account/UserInfo"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userinfo" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
