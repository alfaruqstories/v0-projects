"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const data = [
  { month: "Jan", price: 1200 },
  { month: "Feb", price: 1400 },
  { month: "Mar", price: 1350 },
  { month: "Apr", price: 1500 },
  { month: "May", price: 1800 },
  { month: "Jun", price: 1900 },
]

export function PriceHistory() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-bold text-[#000B20]">6 month price history</h2>
        <p className="text-2xl text-gray-600">
          Here's the price history for Amlodipine Besylate between June and December
        </p>
      </div>

      <Card className="bg-[#F5FAFF] p-12 rounded-[70px]">
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[428px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F2FE" />
              <XAxis dataKey="month" stroke="#495766" fontSize={12} />
              <YAxis stroke="#495766" fontSize={12} />
              <ChartTooltip />
              <Line type="monotone" dataKey="price" stroke="#074285" strokeWidth={2} dot={{ fill: "#074285", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
    </section>
  )
}

