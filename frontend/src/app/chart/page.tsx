'use client'

import React, {useState} from "react"
import {ChartContainer} from "@/components/ui/chart"
import {Card, CardHeader, CardContent} from "@/components/ui/card"
import {BarChart, Bar, XAxis, Tooltip} from "recharts"

const modes = ["weekly", "monthly", "yearly"]

export default function Chart() {
    const [mode, setMode] = useState("weekly")
    const [offset, setOffset] = useState(0)

    const handlePrev = () => setOffset((prev) => prev - 1)
    const handleNext = () => setOffset((prev) => prev + 1)
    const handleModeChange = (newMode: string) => {
        setMode(newMode)
        setOffset(0)
    }

    // Added mock data
    const data = [
        {name: "Jan", value: 400},
        {name: "Feb", value: 300},
        {name: "Mar", value: 500},
        {name: "Apr", value: 200}
    ]

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Chart Page</h1>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <button onClick={handlePrev}>&lt;</button>
                        <div className="flex gap-4">
                            {modes.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleModeChange(m)}
                                    className={m === mode ? "font-bold underline" : ""}
                                >
                                    {m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNext}>&gt;</button>
                    </div>
                    <div className="mt-2 text-center font-medium">
                        {mode.charAt(0).toUpperCase() + mode.slice(1)} View (Offset: {offset})
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{data1: {label: "Sales", color: "#8884d8"}}}>
                        <BarChart data={data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                            <XAxis dataKey="name" stroke="#8884d8"/>
                            <Tooltip/>
                            <Bar dataKey="value" fill="#8884d8"/>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
