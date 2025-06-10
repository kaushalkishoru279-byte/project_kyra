"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Line, LineChart, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip, ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Activity } from "lucide-react"

const bpData = [
  { date: "Mon", systolic: 120, diastolic: 80 },
  { date: "Tue", systolic: 125, diastolic: 82 },
  { date: "Wed", systolic: 118, diastolic: 78 },
  { date: "Thu", systolic: 130, diastolic: 85 },
  { date: "Fri", systolic: 122, diastolic: 80 },
  { date: "Sat", systolic: 128, diastolic: 84 },
  { date: "Sun", systolic: 123, diastolic: 79 },
]

const hrData = [
  { date: "Mon", heartRate: 70 },
  { date: "Tue", heartRate: 75 },
  { date: "Wed", heartRate: 68 },
  { date: "Thu", heartRate: 72 },
  { date: "Fri", heartRate: 78 },
  { date: "Sat", heartRate: 73 },
  { date: "Sun", heartRate: 69 },
]

const bpChartConfig = {
  systolic: {
    label: "Systolic (mmHg)",
    color: "hsl(var(--chart-1))",
  },
  diastolic: {
    label: "Diastolic (mmHg)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const hrChartConfig = {
  heartRate: {
    label: "Heart Rate (BPM)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function HealthTrendsChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Health Trends</CardTitle>
        </div>
        <CardDescription>Visual overview of key health metrics over the past week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground/80">Blood Pressure (Last 7 Days)</h3>
          <ChartContainer config={bpChartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={bpData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} />
              <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground/80">Heart Rate (Last 7 Days)</h3>
          <ChartContainer config={hrChartConfig} className="h-[300px] w-full">
            <LineChart accessibilityLayer data={hrData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Legend />
              <Line
                dataKey="heartRate"
                type="monotone"
                stroke="var(--color-heartRate)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-heartRate)",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
