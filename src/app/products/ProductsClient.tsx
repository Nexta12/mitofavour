'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Search, Loader2, AlertCircle, ShoppingBag, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and Sorting States
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination States (Threshold of 12)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError('');
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' });

        // 1. Search Query Filter
        if (searchQuery.trim()) {
          const searchVal = `%${searchQuery.trim()}%`;
          query = query.or(`name.ilike.${searchVal},description.ilike.${searchVal}`);
        }

        // 2. Category Filter
        if (categoryFilter === 'foggers') {
          query = query.or('name.ilike.%fogging%,name.ilike.%sprayer%');
        } else if (categoryFilter === 'powertools') {
          query = query.or('name.ilike.%drill%,name.ilike.%saw%,name.ilike.%hammer%,name.ilike.%grinder%');
        } else if (categoryFilter === 'handtools') {
          query = query
            .not('name', 'ilike', '%fogging%')
            .not('name', 'ilike', '%sprayer%')
            .not('name', 'ilike', '%drill%')
            .not('name', 'ilike', '%saw%')
            .not('name', 'ilike', '%hammer%')
            .not('name', 'ilike', '%grinder%');
        }

        // 3. Price Filter
        if (priceFilter === 'under70') {
          query = query.lt('price', 70000);
        } else if (priceFilter === '70to100') {
          query = query.gte('price', 70000).lte('price', 100000);
        } else if (priceFilter === 'above100') {
          query = query.gt('price', 100000);
        }

        // 4. Sorting
        if (sortBy === 'price-asc') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-desc') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        // 5. Pagination Range
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        query = query.range(from, to);

        const { data, count, error: dbError } = await query;

        if (dbError) throw dbError;
        setProducts(data || []);
        setTotalItems(count || 0);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError('Could not connect to the database. Make sure your database tables are created.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, categoryFilter, priceFilter, sortBy, currentPage]);

  // Check for deep-linked product ID in URL search parameters to auto-open modal (Removed)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handlePriceChange = (val: string) => {
    setPriceFilter(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* Page Header banner */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16 text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6">
          
          <div className="inline-flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-700 px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
            MITOFAVOUR CO.
          </div>
          
          <div>
            <h1 className="text-3xl sm:text-5xl font-black mt-1 tracking-tight">Premium Equipment Catalog</h1>
            <p className="text-[15px] sm:text-base text-slate-600 mt-4 max-w-2xl mx-auto">Discover our collection of specialized tools and high-power disinfection fogging sprayers. Nationwide cash on delivery available.</p>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-xl relative group mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search products by title or specification..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filters Control Bar */}
      <section className="bg-white border-b border-slate-200 py-3.5 shadow-sm relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <SlidersHorizontal className="h-4 w-4 text-amber-600" />
            <span>Filter Catalog</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Type</span>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all cursor-pointer hover:border-slate-300"
              >
                <option value="all">All Equipment</option>
                <option value="foggers">Thermal Foggers</option>
                <option value="powertools">Power Tools</option>
                <option value="handtools">Measuring & Hand Tools</option>
              </select>
            </div>

            {/* Price Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
              <select
                value={priceFilter}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all cursor-pointer hover:border-slate-300"
              >
                <option value="all">All Prices</option>
                <option value="under70">Under ₦70,000</option>
                <option value="70to100">₦70,000 - ₦100,000</option>
                <option value="above100">Above ₦100,000</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all cursor-pointer hover:border-slate-300"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {error && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 mb-8 flex gap-3 text-sm text-amber-600">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Setup Connection Required</p>
              <p className="text-slate-655 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 h-[360px] flex flex-col justify-between shadow-sm">
                <div className="aspect-square w-full rounded-xl bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded mt-4 w-3/4" />
                <div className="h-3 bg-slate-100 rounded mt-2 w-1/2" />
                <div className="h-8 bg-slate-100 rounded mt-4 w-full" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalItems > itemsPerPage && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-4">
                <span className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
                  <span className="font-bold text-slate-900">
                    {Math.min(startIndex + itemsPerPage, totalItems)}
                  </span>{' '}
                  of <span className="font-bold text-slate-900">{totalItems}</span> equipment items
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-yellow-400 hover:text-yellow-600 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </button>
                  
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
                          currentPage === pageNum
                            ? 'bg-slate-900 text-yellow-500 border border-slate-900 shadow-md shadow-slate-900/10'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-yellow-400 hover:text-yellow-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-yellow-400 hover:text-yellow-600 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-4 text-slate-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {searchQuery || categoryFilter !== 'all' || priceFilter !== 'all'
                ? 'Adjust your search terms or filters to find matching active listings.'
                : 'We do not have any items listed in our store yet. Check back soon!'}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
