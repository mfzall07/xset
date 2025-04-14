"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function AssetCategoryChart() {
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
      type: "pie",
      data: {
        labels: ["Computers", "Furniture", "Electronics", "Vehicles", "Mobile Devices", "Other"],
        datasets: [
          {
            data: [420, 280, 180, 50, 150, 204],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // blue
              "rgba(168, 85, 247, 0.7)", // purple
              "rgba(236, 72, 153, 0.7)", // pink
              "rgba(34, 197, 94, 0.7)", // green
              "rgba(245, 158, 11, 0.7)", // amber
              "rgba(156, 163, 175, 0.7)", // gray
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(168, 85, 247, 1)",
              "rgba(236, 72, 153, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(156, 163, 175, 1)",
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
