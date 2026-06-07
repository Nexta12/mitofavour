import ContactClient from './ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Mitofavour | Support & Sales Inquiry Hotline',
  description: 'Get in touch with Mitofavour support specialists. Speak directly with us for inquiries, product specifications, pricing, or order confirmations.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
