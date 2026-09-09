import type { Metadata } from 'next';
import './globals.css';
import SessionAuthProvider from '@/components/providers/SessionAuthProvider';

export const metadata: Metadata = {
  title: 'Rahul Tripathi — Balance by Design',
  description:
    'Cloud Architect, AI Educator, Traveller & Creator. Building in the cloud, exploring the world, and sharing what I learn through blogs, videos, and open-source projects.',
  keywords: [
    'Cloud Architecture',
    'Azure',
    'Terraform',
    'Kubernetes',
    'System Design',
    'AI',
    'LLM',
    'Deep Learning',
    'Travel',
    'Tech Blog',
  ],
  authors: [{ name: 'Rahul Tripathi' }],
  openGraph: {
    title: 'Rahul Tripathi — Balance by Design',
    description:
      'Cloud Architect, AI Educator, Traveller & Creator. Building in the cloud, exploring the world, and sharing what I learn.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Rahul Tripathi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahul Tripathi — Balance by Design',
    description:
      'Cloud Architect, AI Educator, Traveller & Creator.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Stars background */}
        <div className="stars-bg" aria-hidden="true" />

        {/* Main content */}
        <SessionAuthProvider>{children}</SessionAuthProvider>
      </body>
    </html>
  );
}
