import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import { Providers } from '@/app/providers';
import { ThemeProvider } from '@/lib/theme-provider';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Refillr',
    template: '%s · Refillr',
  },
  description: 'Fast local water refills and delivery tracking.',
  applicationName: 'Refillr',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Refillr',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#087f74',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Refillr',
  url: 'https://refillr.vercel.app/',
  description: 'Fast local water refills and delivery tracking.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${jakarta.variable} font-sans`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-svh bg-background text-foreground antialiased font-sans">
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md"
        >
          Skip to main content
        </Link>
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
