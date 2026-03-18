'use client'

import useSWR from 'swr'
import { supabase, SessionWithUser } from '@/lib/supabase'
import { StatsCards } from '@/components/stats-cards'
import { SessionsTable } from '@/components/sessions-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

async function fetchSessions(): Promise<SessionWithUser[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      users (*)
    `)
    .order('recorded_at', { ascending: false })

  if (error) throw error
  return data || []
}

async function fetchUserCount(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function Dashboard() {
  const { data: sessions, error: sessionsError, isLoading: sessionsLoading } = useSWR(
    'sessions',
    fetchSessions,
    { refreshInterval: 30000 }
  )

  const { data: userCount, error: userError, isLoading: userLoading } = useSWR(
    'userCount',
    fetchUserCount,
    { refreshInterval: 30000 }
  )

  const isLoading = sessionsLoading || userLoading
  const hasError = sessionsError || userError

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (hasError) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error al cargar los datos. Por favor, intenta de nuevo.</p>
        </CardContent>
      </Card>
    )
  }

  const totalSessions = sessions?.length || 0
  const completedSessions = sessions?.filter((s) => s.status === 'completed').length || 0
  const pendingSessions = sessions?.filter((s) => s.status === 'pending' || s.status === 'processing').length || 0

  return (
    <div className="space-y-6">
      <StatsCards
        totalUsers={userCount || 0}
        totalSessions={totalSessions}
        completedSessions={completedSessions}
        pendingSessions={pendingSessions}
      />
      <SessionsTable sessions={sessions || []} />
    </div>
  )
}
