import { supabase } from '@/lib/supabase';
import ProductClient from './product/[id]/ProductClient';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const { data: products } = await supabase.from('products').select('*');
  let product = null;
  
  if (products && products.length > 0) {
    product = products.find(p => p.details?._is_homepage === 'true') || products[0];
  }

  if (!product) {
    return {
      title: 'Mitofavour | Premium Power Tools & Disinfection Sprayers',
    };
  }

  return {
    title: `${product.details?._catchphrase || product.name} | Mitofavour`,
    description: product.description || `Buy the high-quality ${product.name}. Pay strictly on delivery. Fast shipping nationwide.`,
    openGraph: {
      title: `${product.details?._catchphrase || product.name} | Mitofavour`,
      description: product.description || `Buy the high-quality ${product.name}. Pay strictly on delivery.`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function HomePage() {
  const { data: products, error } = await supabase.from('products').select('*');

  if (error || !products || products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 mb-2">No Products Found</h1>
          <p className="text-slate-600 mb-6">Your store is currently empty. Please add a product from the admin dashboard.</p>
          <a href="/admin/dashboard" className="bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors inline-block">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Find the product marked as homepage
  let product = products.find(p => p.details?._is_homepage === 'true');
  
  // Fallback to the first product if none is selected
  if (!product) {
    product = products[0];
  }

  return <ProductClient product={product} />;
}
