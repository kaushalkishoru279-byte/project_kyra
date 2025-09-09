"use client"

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Line, LineChart, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip, ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Activity } from "lucide-react"

type HrPoint = { date: string; heartRate: number }
type BpPoint = { date: string; systolic: number; diastolic: number }

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
  const [bpData, setBpData] = useState<BpPoint[]>([])
  const [hrData, setHrData] = useState<HrPoint[]>([])

  useEffect(() => {
    const load = async () => {
      const headers = { 'X-User-Id': 'demo-user' }
      const [bpRes, hrRes] = await Promise.all([
        fetch('/api/health/readings?metric=blood_pressure&limit=50', { headers }),
        fetch('/api/health/readings?metric=heart_rate&limit=50', { headers })
      ])
      const [bpJson, hrJson] = await Promise.all([bpRes.json(), hrRes.json()])
      const bp = (bpJson as any[]).map(r => ({
        date: new Date(r.taken_at).toLocaleString(),
        systolic: r.value_json?.systolic ?? 0,
        diastolic: r.value_json?.diastolic ?? 0,
      })).reverse()
      const hr = (hrJson as any[]).map(r => ({
        date: new Date(r.taken_at).toLocaleString(),
        heartRate: r.value_num ?? 0,
      })).reverse()
      setBpData(bp)
      setHrData(hr)
    }
    void load()
  }, [])

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
