"use client"

import { useState, useRef, useCallback } from "react"

export interface RecordingPayload {
  session_id: string
  recorded_at: string
  duration_seconds: number
  file_size_bytes: number
  mime_type: string
  audio_blob: Blob
}

interface UseAudioRecorderReturn {
  isRecording: boolean
  elapsedTime: number
  analyser: AnalyserNode | null
  startRecording: () => Promise<void>
  stopRecording: () => Promise<RecordingPayload | null>
  error: string | null
}

function generateSessionId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "TP-"
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      audioChunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(stream)
      const analyserNode = audioContext.createAnalyser()
      analyserNode.fftSize = 256
      source.connect(analyserNode)
      setAnalyser(analyserNode)

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/ogg")
        ? "audio/ogg"
        : "audio/mp4"

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      startTimeRef.current = Date.now()

      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 100)
    } catch (err) {
      setError("No se pudo acceder al microfono. Por favor, permite el acceso.")
      console.error("Error accessing microphone:", err)
    }
  }, [])

  const stopRecording = useCallback(async (): Promise<RecordingPayload | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve(null)
        return
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)

        const payload: RecordingPayload = {
          session_id: generateSessionId(),
          recorded_at: new Date().toISOString(),
          duration_seconds: duration,
          file_size_bytes: blob.size,
          mime_type: mimeType,
          audio_blob: blob,
        }

        if (typeof window !== "undefined") {
          ;(window as Window & { __talentpulse_payload?: RecordingPayload }).__talentpulse_payload = payload
        }

        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }

        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }

        setIsRecording(false)
        setAnalyser(null)
        setElapsedTime(0)

        resolve(payload)
      }

      mediaRecorder.stop()
    })
  }, [])

  return {
    isRecording,
    elapsedTime,
    analyser,
    startRecording,
    stopRecording,
    error,
  }
}
