import type { Metadata, Viewport } from 'next'
import { Roboto, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ServiceWorkerRegister } from '@/components/sw-register'
import './globals.css'

const _roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Humand Ascend',
  description: 'Registra tu día y potencia tu crecimiento profesional',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Humand Ascend',
  },
  icons: {
    icon: '/humand.ico',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#e0e5ec',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-[#e0e5ec]">
        {children}
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  )
}
