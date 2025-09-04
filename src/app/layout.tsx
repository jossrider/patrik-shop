import type { Metadata } from 'next'
import './globals.css'
import { geistMono, geistSans } from '../config/fonts'
import { Providers } from '@/components'

export const metadata: Metadata = {
  title: {
    template: '%s - Patrik | Shop',
    default: 'Home - Patrik | Shop',
  },
  description: 'Las prendas mas chidas..',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
