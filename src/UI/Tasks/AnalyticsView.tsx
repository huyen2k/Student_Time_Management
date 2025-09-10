import { useEffect, useState } from "react"
import { listenTasks } from "../../Core/taskService"
import type { Task } from "../../Core/types"
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import "../../Styles/App.css"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsView() {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        const unsub = listenTasks(setTasks)
        return () => unsub()
    }, [])

    const completed = tasks.filter(t => t.completed).length
    const pending = tasks.length - completed

    const pieData = [
        { name: "Hoàn thành", value: completed },
        { name: "Chưa hoàn thành", value: pending }
    ]

    const barData = [
        { name: "Tasks", Hoàn_thành: completed, Chưa_hoàn_thành: pending }
    ]

    return (
        <div className="view active">
            <h2>📊 Phân tích</h2>
            <div style={{ display: "flex", gap: "2rem" }}>
                <PieChart width={300} height={300}>
                    <Pie data={pieData} cx="50%" cy="50%" label outerRadius={100} dataKey="value">
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>

                <BarChart width={400} height={300} data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Hoàn_thành" stackId="a" fill="#00C49F" />
                    <Bar dataKey="Chưa_hoàn_thành" stackId="a" fill="#FF8042" />
                </BarChart>
            </div>
        </div>
    )
}
