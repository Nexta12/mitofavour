import HomeClient from './HomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mitofavour | Premium Power Tools & Disinfection Sprayers',
  description: 'Shop premium industrial Pulsed Power Thermal Fogging Machines, high-torque cordless drills, impact driver kits, and demolition jack hammers. Pay strictly on delivery.',
  keywords: 'thermal fogger, thermal fogging machine, cordless drill driver, tools box, demolition jack hammer, circular saw, green laser level, angle grinder, Nigeria tool store, cash on delivery tools',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mitofavour | Premium Power Tools & Disinfection Sprayers',
    description: 'Shop premium industrial Pulsed Power Thermal Fogging Machines, high-torque cordless drills, impact driver kits, and demolition jack hammers. Pay strictly on delivery.',
    url: 'https://mitofavour.com',
    siteName: 'Mitofavour',
    images: [
      {
        url: '/thermal_fogging_machine.jpg',
        width: 800,
        height: 600,
        alt: 'Mitofavour Thermal Fogging Machine',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
