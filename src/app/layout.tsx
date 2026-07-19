import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import WhatsAppButton from '@/components/WhatsAppButton';
import Banner from '@/components/Banner';
import FacebookPixel from '@/components/FacebookPixel';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mitofavour.com'),
  title: {
    default: 'Mitofavour | Premium Power Tools & Disinfection Sprayers',
    template: '%s | Mitofavour'
  },
  description: 'Specialized pulsed power thermal fogging machines, high-torque cordless drills, power tool kits, and hardware accessories. Secure cash on delivery orders.',
  keywords: [
    'thermal fogger',
    'pulsed power sprayer',
    'thermal fogging machine',
    'cordless drill combo kit',
    'impact driver tools',
    'demolition jack hammer',
    'circular saw kit',
    '3D green laser level',
    'angle grinder kit',
    'cash on delivery tools Nigeria'
  ],
  authors: [{ name: 'Mitofavour Co.' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Mitofavour | Premium Power Tools & Disinfection Sprayers',
    description: 'Specialized pulsed power thermal fogging machines, high-torque cordless drills, power tool kits, and hardware accessories. Secure cash on delivery orders.',
    url: 'https://mitofavour.com',
    siteName: 'Mitofavour',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitofavour | Premium Power Tools & Disinfection Sprayers',
    description: 'Specialized pulsed power thermal fogging machines, high-torque cordless drills, power tool kits, and hardware accessories. Secure cash on delivery orders.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SEO Structured Data (JSON-LD) for LocalBusiness, Organization, and Website
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://mitofavour.com/#website',
        'url': 'https://mitofavour.com',
        'name': 'Mitofavour',
        'description': 'Premium Industrial Equipment & Power Tools',
        'publisher': {
          '@id': 'https://mitofavour.com/#organization'
        },
        'potentialAction': [
          {
            '@type': 'SearchAction',
            'target': 'https://mitofavour.com/products?search={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        ]
      },
      {
        '@type': 'Store',
        '@id': 'https://mitofavour.com/#organization',
        'name': 'Mitofavour',
        'url': 'https://mitofavour.com',
        'logo': 'https://mitofavour.com/thermal_fogging_machine.jpg',
        'image': 'https://mitofavour.com/thermal_fogging_machine.jpg',
        'description': 'Specialized pulsed power thermal fogging machines, high-torque cordless drills, power tool kits, and hardware accessories. Secure cash on delivery orders.',
        'telephone': '+234 810 680 0185',
        'priceRange': '₦₦-₦₦₦₦₦₦',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Order Hotline Address',
          'addressLocality': 'Lagos',
          'addressRegion': 'Lagos State',
          'addressCountry': 'NG'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '6.5244',
          'longitude': '3.3792'
        },
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          'opens': '08:00',
          'closes': '18:00'
        }
      }
    ]
  };

  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
        <NextTopLoader color="#eab308" height={3} showSpinner={false} />
        <FacebookPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Banner />
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
