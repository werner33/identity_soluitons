import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Investor Information Management System',
  description:
    'Professional investor information and document management platform',
  keywords: ['investor', 'management', 'documents', 'information'],
  authors: [{ name: 'Your Company' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-border bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-primary">
                Investor Information System
              </h1>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-border bg-gray-50 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-secondary">
              &copy; {new Date().getFullYear()} Investor Information Management
              System. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
