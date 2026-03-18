import { Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Humand Ascend</h1>
              <p className="text-xs text-muted-foreground">Back Office</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Panel de Administracion</span>
          </nav>
        </div>
      </div>
    </header>
  )
}
