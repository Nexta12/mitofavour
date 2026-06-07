import ProductsClient from './ProductsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mitofavour Catalog | Industrial Disinfection Foggers & Cordless Drills',
  description: 'Explore the full Mitofavour industrial catalog. Find heavy-duty Pulsed Power Thermal Fogging sprayers, 18V cordless brushless drill sets, circular saws, and demolition jack hammers.',
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
