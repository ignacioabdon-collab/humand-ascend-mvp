"use client"

import { useEffect, useRef } from "react"

interface AudioWaveformProps {
  isRecording: boolean
  analyser: AnalyserNode | null
}

export function AudioWaveform({ isRecording, analyser }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const centerY = height / 2
    const barCount = 48
    const barWidth = 4
    const gap = (width - barCount * barWidth) / (barCount + 1)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      if (isRecording && analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * dataArray.length)
          const value = dataArray[dataIndex] / 255
          const barHeight = Math.max(4, value * (height * 0.8))
          
          const x = gap + i * (barWidth + gap)
          const y = centerY - barHeight / 2

          ctx.fillStyle = `oklch(0.7 0.15 175 / ${0.4 + value * 0.6})`
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barHeight, 2)
          ctx.fill()
        }
      } else {
        for (let i = 0; i < barCount; i++) {
          const x = gap + i * (barWidth + gap)
          const barHeight = 4
          const y = centerY - barHeight / 2

          ctx.fillStyle = "oklch(0.7 0.15 175 / 0.3)"
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barHeight, 2)
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRecording, analyser])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24"
      style={{ maxWidth: "400px" }}
    />
  )
}
