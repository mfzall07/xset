"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function SalesChart() {
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
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Sales Revenue",
            data: [1250, 1850, 1350, 2100, 1750, 3490],
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: "Number of Transactions",
            data: [12, 18, 14, 22, 16, 28],
            borderColor: "rgba(236, 72, 153, 1)",
            backgroundColor: "rgba(236, 72, 153, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
            title: {
              display: true,
              text: "Revenue ($)",
            },
          },
          y1: {
            beginAtZero: true,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: "Transactions",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  if (context.dataset.label === "Sales Revenue") {
                    label += new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(context.parsed.y)
                  } else {
                    label += context.parsed.y
                  }
                }
                return label
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
