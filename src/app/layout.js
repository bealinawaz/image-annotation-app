// app/layout.js
import { Providers } from './providers';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProviderWrapper } from './theme-provider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import './globals.css';

export const metadata = {
  title: 'Image Annotation App',
  description: 'An application for image annotation and management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProviderWrapper>
            <Providers>
              <ErrorBoundary>
                <Navbar />
                {children}
                <Footer />
              </ErrorBoundary>
            </Providers>
          </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
