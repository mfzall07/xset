"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function AssetActivityChart() {
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

    // Generate dates for the last 6 months
    const labels = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - 5 + i)
      return date.toLocaleDateString("en-US", { month: "short" })
    })

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Loans",
            data: [45, 52, 38, 60, 56, 45],
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
          {
            label: "Transfers",
            data: [25, 30, 22, 35, 28, 32],
            backgroundColor: "rgba(168, 85, 247, 0.7)",
            borderColor: "rgba(168, 85, 247, 1)",
            borderWidth: 1,
          },
          {
            label: "Returns",
            data: [40, 48, 35, 55, 50, 40],
            backgroundColor: "rgba(34, 197, 94, 0.7)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
          legend: {
            position: "top",
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
