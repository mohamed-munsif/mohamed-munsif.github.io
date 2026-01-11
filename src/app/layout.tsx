import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Mohamed Munsif - Portfolio",
  description: "Undergraduate Electrical and Electronics Engineering student at South Eastern University of Sri Lanka. On a mission to master AI/ML, one day at a time. Track my learning journey and progress.",
  keywords: ["Mohamed Munsif", "Electrical Engineering", "Electronics Engineering", "AI", "Machine Learning", "Portfolio", "Study Tracker", "Learning Streak", "South Eastern University", "Sri Lanka"],
  authors: [{ name: "Mohamed Munsif" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Mohamed Munsif - Portfolio",
    description: "Undergraduate Electrical and Electronics Engineering student at South Eastern University of Sri Lanka. On a mission to master AI/ML, one day at a time.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Munsif - Portfolio",
    description: "Undergraduate Electrical and Electronics Engineering student at South Eastern University of Sri Lanka. On a mission to master AI/ML, one day at a time.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preload" href="/profile.png" as="image" />
        <link rel="prefetch" href="/streak" />
        <link rel="prefetch" href="/blogs" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
