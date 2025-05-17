import type { Metadata } from 'next'
import './globals.css'
import { geistMono, geistSans } from '../config/fonts'

export const metadata: Metadata = {
  title: 'Patrik | Shop',
  description: 'Las prendas mas chidas..',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
