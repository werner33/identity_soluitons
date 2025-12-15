import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { Business } from '@mui/icons-material';
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
      <body className="antialiased min-h-screen">
        <Box
          sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          <AppBar position="static" elevation={1} sx={{ bgcolor: '#1e40af' }}>
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                <Business sx={{ mr: 2 }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, fontWeight: 600 }}
                >
                  Investor Information System
                </Typography>
              </Toolbar>
            </Container>
          </AppBar>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f8fafc' }}>
            {children}
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              bgcolor: '#f1f5f9',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                &copy; {new Date().getFullYear()} Investor Information
                Management System. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </Box>
      </body>
    </html>
  );
}
