import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate cache every 60 seconds

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata dynamically based on the product
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Mitofavour',
    };
  }

  return {
    title: `${product.name} | Mitofavour`,
    description: product.description || `Buy the high-quality ${product.name}. Pay strictly on delivery. Fast shipping nationwide.`,
    openGraph: {
      title: `${product.name} | Mitofavour`,
      description: product.description || `Buy the high-quality ${product.name}. Pay strictly on delivery.`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage(props: PageProps) {
  const params = await props.params;
  
  // Fetch the product from Supabase using the ID
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    notFound();
  }

  return <ProductClient product={product} />;
}
