import '@/globals.css'
import { draftMode } from 'next/headers'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { EyeIcon } from 'lucide-react'

import { TailwindIndicator } from '@/components/tailwind-indicator'
import { SideMenu } from '@/components/side-menu'
import { MenuContent } from '@/components/menu-content'
import { preloadGetAllPosts } from '@/lib/contentful'
import { PROFILES } from '@/lib/constants'
import { sharedMetadata } from '@/app/shared-metadata'

export default async function RootLayout({ children }) {
  const { isEnabled } = draftMode()
  preloadGetAllPosts(isEnabled)

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <main vaul-drawer-wrapper="" className="min-h-screen bg-white">
          {isEnabled && (
            <div className="absolute inset-x-0 bottom-0 z-50 flex h-12 w-full items-center justify-center bg-green-500 text-center text-sm font-medium text-white">
              <div className="flex items-center gap-2">
                <EyeIcon size={16} />
                <span>Draft mode is enabled</span>
              </div>
            </div>
          )}
          <div className="lg:flex">
            <SideMenu className="relative hidden lg:flex">
              <MenuContent />
            </SideMenu>
            <div className="flex flex-1">{children}</div>
          </div>
        </main>
        <TailwindIndicator />
        <SpeedInsights />
        <Script
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.tinybird.co"
          data-token="p.eyJ1IjogIjM4MDViNWUyLTk4ZDAtNGVhMy1hZGE0LTBmNWJlODc4OGY1MyIsICJpZCI6ICIxYWMxMDQ0Yi1lY2YyLTQ3ZjgtOTViMC00ZmUwM2QzNzM1YTIiLCAiaG9zdCI6ICJ1c19lYXN0In0.pan7TgY1ndDuN7YNAcUuLrKIg2JG0SkNqmnu9p4Q2Js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL('https://valerie.wiki'),
  robots: {
    index: true,
    follow: true
  },
  title: {
    default: sharedMetadata.title,
    template: `%s — ${sharedMetadata.title}`
  },
  description: sharedMetadata.description,
  keywords: ['Valerie Stoica', 'valerie dev', 'valerie.wiki'],
  openGraph: {
    title: {
      default: sharedMetadata.title,
      template: `%s — ${sharedMetadata.title}`
    },
    description: sharedMetadata.description,
    alt: sharedMetadata.title,
    type: 'website',
    url: 'https://valerie.wiki',
    siteName: sharedMetadata.title,
    locale: 'en_IE'
  },
  alternates: {
    canonical: '/'
  },
  other: {
    pinterest: 'nopin'
  }
}

export const viewport = {
  themeColor: 'white',
  colorScheme: 'only light',
  width: 'device-width',
  initialScale: 1
}
