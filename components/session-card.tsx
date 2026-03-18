import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SessionPayload {
  session_id: string
  recorded_at: string
  duration_seconds: number
  file_size_bytes: number
  mime_type: string
}

interface SessionCardProps {
  payload: SessionPayload
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SessionCard({ payload }: SessionCardProps) {
  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Sesion de grabacion
          </h3>
          <Badge variant="secondary" className="bg-accent/20 text-accent border-0">
            En cola
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ID de sesion</p>
            <p className="text-sm font-mono text-foreground">{payload.session_id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Timestamp</p>
            <p className="text-sm text-foreground">{formatDate(payload.recorded_at)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Duracion</p>
            <p className="text-sm font-mono text-foreground">{formatDuration(payload.duration_seconds)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Tamano</p>
            <p className="text-sm text-foreground">{formatBytes(payload.file_size_bytes)}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Formato</p>
            <p className="text-sm font-mono text-foreground">{payload.mime_type}</p>
          </div>
        </div>
        <div className="pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Pendiente de envio al servidor
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
