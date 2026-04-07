import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// ── Font configuration ──────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
  weight:   ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
  weight:   ['300', '400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  weight:   ['400', '500'],
});

// ── Metadata ────────────────────────────────────────────────────────────────
export const metadata = {
  title:       'Library Management System',
  description: 'A production-ready academic library management platform for administrators and students.',
  keywords:    ['library', 'management', 'books', 'catalogue', 'academic'],
  authors:     [{ name: 'Saleena' }],
  themeColor:  '#864c25',
  openGraph: {
    title:       'Library Management System',
    description: 'Library Management System',
    type:        'website',
  },
};

// ── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning={true}
    >
      <body suppressHydrationWarning={true}  className="min-h-screen bg-brand-bg font-body antialiased">
        {children}
      </body>
    </html>
  );
}