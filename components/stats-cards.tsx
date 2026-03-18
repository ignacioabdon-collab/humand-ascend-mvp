import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mic, CheckCircle, Clock } from 'lucide-react'

interface StatsCardsProps {
  totalUsers: number
  totalSessions: number
  completedSessions: number
  pendingSessions: number
}

export function StatsCards({
  totalUsers,
  totalSessions,
  completedSessions,
  pendingSessions,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Sesiones',
      value: totalSessions,
      icon: Mic,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Completadas',
      value: completedSessions,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Pendientes',
      value: pendingSessions,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
