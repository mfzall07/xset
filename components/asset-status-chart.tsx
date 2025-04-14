"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function AssetStatusChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Available", "In Use", "Maintenance", "Retired", "Lost/Stolen"],
        datasets: [
          {
            data: [650, 350, 120, 100, 64],
            backgroundColor: [
              "rgba(34, 197, 94, 0.7)", // green
              "rgba(59, 130, 246, 0.7)", // blue
              "rgba(250, 204, 21, 0.7)", // yellow
              "rgba(156, 163, 175, 0.7)", // gray
              "rgba(239, 68, 68, 0.7)", // red
            ],
            borderColor: [
              "rgba(34, 197, 94, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(250, 204, 21, 1)",
              "rgba(156, 163, 175, 1)",
              "rgba(239, 68, 68, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw as number
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
