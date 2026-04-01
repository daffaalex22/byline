import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Byline',
  description: 'AI-native reporting built to publish serious journalism on a real cadence.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
