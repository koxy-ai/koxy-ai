import '@radix-ui/themes/styles.css';
import "./global.css";
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Theme } from '@radix-ui/themes';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Koxy AI',
  description: 'Serverless AI-powered platform',
}

type Children = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className={inter.className}>
        <Theme appearance="dark" accentColor="jade" scaling="95%">
          {children}
        </Theme>
      </body>
    </html>
  )
}
