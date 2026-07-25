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
  description: "Portfolio of Mohamed Munsif, undergraduate Electrical and Electronics Engineering student at South Eastern University of Sri Lanka.",
  keywords: ["Mohamed Munsif", "Electrical Engineering", "Electronics Engineering", "AI", "Machine Learning", "Portfolio", "South Eastern University", "Sri Lanka"],
  authors: [{ name: "Mohamed Munsif" }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Mohamed Munsif - Portfolio",
    description: "Portfolio of Mohamed Munsif, undergraduate Electrical and Electronics Engineering student at South Eastern University of Sri Lanka.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Munsif - Portfolio",
    description: "Portfolio of Mohamed Munsif, undergraduate Electrical and Electronics Engineering student at South Eastern University of Sri Lanka.",
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
        <link rel="preload" href="/profile.png" as="image" />
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