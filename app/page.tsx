import { Header } from '@/components/header'
import { Dashboard } from '@/components/dashboard'

export default function BackOfficePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground text-balance">
            Panel de Grabaciones
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualiza las sesiones de grabacion y las habilidades detectadas de cada usuario
          </p>
        </div>
        <Dashboard />
      </main>
    </div>
  )
}
