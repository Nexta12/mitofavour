'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Loader2,
  ArrowLeft,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings as SettingsIcon,
  LogOut,
  TrendingUp,
  CheckCircle,
  Database,
  Phone,
  MessageSquare,
  DollarSign,
  User,
  Users,
  ExternalLink,
  ChevronRight,
  Megaphone,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  // Active Tab state (Simulating pages)
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'users' | 'settings' | 'banners'>('overview');

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search filter for products table
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Stats States
  const [totalCount, setTotalCount] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [premiumItem, setPremiumItem] = useState<Product | null>(null);

  // Banner CRUD States
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  
  // Banner Form Fields
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Custom Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: 'product' | 'user' | 'banner';
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [tagline, setTagline] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [isHomepage, setIsHomepage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  // Dynamic Specs
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  // Auth Protection
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUserEmail(session.user?.email || 'admin@mitostore.com');
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  // Auto-close mobile sidebar when activeTab changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  // Lock scroll on mobile when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!authChecking) {
      fetchProducts();
    }
  }, [currentPage, searchQuery, authChecking]);

  async function fetchStats() {
    try {
      const { count, error: countErr } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (countErr) throw countErr;
      setTotalCount(count || 0);

      const { data, error: dataErr } = await supabase
        .from('products')
        .select('name, price')
        .order('price', { ascending: false });

      if (dataErr) throw dataErr;

      if (data && data.length > 0) {
        const total = data.length;
        const sum = data.reduce((acc, p) => acc + p.price, 0);
        setAvgPrice(sum / total);
        setPremiumItem(data[0] as Product);
      } else {
        setAvgPrice(0);
        setPremiumItem(null);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      setError('');
      
      // Fetch stats in parallel
      fetchStats();

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (searchQuery.trim()) {
        const searchVal = `%${searchQuery.trim()}%`;
        query = query.or(`name.ilike.${searchVal},description.ilike.${searchVal}`);
      }

      query = query.order('created_at', { ascending: false });

      // Range/Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, count, error: dbError } = await query;

      if (dbError) throw dbError;
      setProducts(data || []);
      setTotalItems(count || 0);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch products. Check console or verify Supabase schema.');
    } finally {
      setLoading(false);
    }
  }

  // Admin User Management States
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [serviceRoleKeyMissing, setServiceRoleKeyMissing] = useState(false);

  // User Form fields
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmailField, setUserEmailField] = useState('');
  const [userPasswordField, setUserPasswordField] = useState('');
  const [userCurrentPasswordField, setUserCurrentPasswordField] = useState('');

  // Fetch users from API route
  async function fetchUsers() {
    try {
      setUsersLoading(true);
      setUserError('');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (res.status === 501) {
        setServiceRoleKeyMissing(true);
        setAdminUsers([]);
        return;
      }
      
      setServiceRoleKeyMissing(false);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch users.');
      }
      setAdminUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      setUserError(err.message || 'Failed to load admin users.');
    } finally {
      setUsersLoading(false);
    }
  }

  // Fetch users when switching to 'users' tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch banners
  async function fetchBanners() {
    try {
      setBannersLoading(true);
      setBannerError('');
      const { data, error: dbError } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setBanners(data || []);
    } catch (err: any) {
      console.error('Error fetching banners:', err.message || err);
      setBannerError('Failed to fetch banners. Ensure the "banners" table is created in Supabase.');
    } finally {
      setBannersLoading(false);
    }
  }

  // Fetch banners when switching to 'banners' tab
  useEffect(() => {
    if (activeTab === 'banners') {
      fetchBanners();
    }
  }, [activeTab]);

  // Handle click to add new banner
  const handleAddBannerClick = () => {
    setEditingBanner(null);
    setBannerMessage('');
    setBannerIsActive(true);
    setBannerError('');
    setIsBannerFormOpen(true);
  };

  // Handle click to edit banner
  const handleEditBannerClick = (bannerObj: any) => {
    setEditingBanner(bannerObj);
    setBannerMessage(bannerObj.message);
    setBannerIsActive(bannerObj.is_active);
    setBannerError('');
    setIsBannerFormOpen(true);
  };

  // Save banner (Create or Update)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerError('');

    if (!bannerMessage.trim()) {
      setBannerError('Banner message cannot be empty.');
      return;
    }

    setBannersLoading(true);
    try {
      // If setting this banner as active, deactivate all other banners first
      if (bannerIsActive) {
        await supabase
          .from('banners')
          .update({ is_active: false })
          .neq('id', editingBanner?.id || '00000000-0000-0000-0000-000000000000');
      }

      const payload = {
        message: bannerMessage.trim(),
        is_active: bannerIsActive,
      };

      if (editingBanner) {
        const { error: updateError } = await supabase
          .from('banners')
          .update(payload)
          .eq('id', editingBanner.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('banners')
          .insert([payload]);
        if (insertError) throw insertError;
      }

      setIsBannerFormOpen(false);
      fetchBanners();
    } catch (err: any) {
      console.error(err);
      setBannerError(err.message || 'Failed to save banner.');
    } finally {
      setBannersLoading(false);
    }
  };

  // Delete banner
  const handleDeleteBanner = async (id: string) => {
    setBannersLoading(true);
    setIsDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      fetchBanners();
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete banner.');
    } finally {
      setBannersLoading(false);
      setIsDeleting(false);
    }
  };

  // Toggle active banner status
  const handleToggleActiveBanner = async (bannerObj: any) => {
    setBannersLoading(true);
    try {
      const newActiveState = !bannerObj.is_active;

      // If activating, deactivate all other banners
      if (newActiveState) {
        await supabase
          .from('banners')
          .update({ is_active: false })
          .neq('id', bannerObj.id);
      }

      const { error: updateError } = await supabase
        .from('banners')
        .update({ is_active: newActiveState })
        .eq('id', bannerObj.id);

      if (updateError) throw updateError;
      fetchBanners();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to toggle banner status.');
    } finally {
      setBannersLoading(false);
    }
  };

  // Handle click to add new user
  const handleAddUserClick = () => {
    setEditingUser(null);
    setUserDisplayName('');
    setUserEmailField('');
    setUserPasswordField('');
    setUserCurrentPasswordField('');
    setIsUserFormOpen(true);
  };

  // Handle click to edit user
  const handleEditUserClick = (userObj: any) => {
    setEditingUser(userObj);
    setUserDisplayName(userObj.user_metadata?.name || '');
    setUserEmailField(userObj.email || '');
    setUserPasswordField('');
    setUserCurrentPasswordField('');
    setIsUserFormOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id === userId) {
      alert('You cannot delete your own logged-in admin account.');
      return;
    }

    try {
      setUsersLoading(true);
      setIsDeleting(true);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user.');
      }

      setAdminUsers(adminUsers.filter((u) => u.id !== userId));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete user.');
    } finally {
      setUsersLoading(false);
      setIsDeleting(false);
    }
  };

  // Handle save user (Create or Update)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');

    if (!userEmailField.trim()) {
      setUserError('Email is required.');
      return;
    }

    if (!editingUser && !userPasswordField) {
      setUserError('Password is required for new accounts.');
      return;
    }

    setUsersLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload: any = {
        email: userEmailField.trim(),
        name: userDisplayName.trim(),
      };

      if (userPasswordField) {
        payload.password = userPasswordField;
        if (editingUser && editingUser.email === userEmail) {
          if (!userCurrentPasswordField) {
            setUserError('Current password is required to change your password.');
            setUsersLoading(false);
            return;
          }
          payload.currentPassword = userCurrentPasswordField;
        }
      }

      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save admin user.');
      }

      setIsUserFormOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setUserError(err.message || 'Failed to save user.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Open form to add new product
  const handleAddClick = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setImageUrl2('');
    setImageUrl3('');
    setOriginalPrice('');
    setTagline('');
    setCatchphrase('');
    setIsHomepage(false);
    setSpecs([{ key: '', value: '' }]);
    setIsFormOpen(true);
  };

  // Open form to edit existing product
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setImageUrl(product.image_url || '');
    setImageUrl2(product.details?._image2 || '');
    setImageUrl3(product.details?._image3 || '');
    setOriginalPrice(product.details?._original_price || '');
    setTagline(product.details?._tagline || '');
    setCatchphrase(product.details?._catchphrase || '');
    setIsHomepage(product.details?._is_homepage === 'true');

    // Load specs from details JSONB, ignoring internal keys starting with _
    if (product.details && Object.keys(product.details).length > 0) {
      const loadedSpecs = Object.entries(product.details)
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, v]) => ({
          key: k,
          value: v as string,
        }));
      setSpecs(loadedSpecs.length > 0 ? loadedSpecs : [{ key: '', value: '' }]);
    } else {
      setSpecs([{ key: '', value: '' }]);
    }

    setIsFormOpen(true);
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(imageIndex);
    setError('');

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to product-images bucket
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(fileName);

      if (imageIndex === 1) setImageUrl(publicUrl);
      else if (imageIndex === 2) setImageUrl2(publicUrl);
      else if (imageIndex === 3) setImageUrl3(publicUrl);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Image upload failed. Make sure a public bucket named "product-images" is created in Supabase.');
    } finally {
      setUploadingImage(null);
    }
  };

  // Specs helper functions
  const addSpecField = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  // Delete product handler
  const handleDeleteProduct = async (productId: string) => {
    setIsDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) throw deleteError;

      setProducts(products.filter((p) => p.id !== productId));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Deletion failed:', err);
      alert(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Save product (Insert or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Construct specifications object
    const detailsJson: Record<string, string> = {};
    specs.forEach((s) => {
      const trimmedKey = s.key.trim();
      const trimmedVal = s.value.trim();
      if (trimmedKey && !trimmedKey.startsWith('_') && trimmedVal) {
        detailsJson[trimmedKey] = trimmedVal;
      }
    });
    
    if (imageUrl2) detailsJson['_image2'] = imageUrl2;
    if (imageUrl3) detailsJson['_image3'] = imageUrl3;
    if (originalPrice) detailsJson['_original_price'] = originalPrice;
    if (tagline) detailsJson['_tagline'] = tagline;
    if (catchphrase) detailsJson['_catchphrase'] = catchphrase;
    if (isHomepage) detailsJson['_is_homepage'] = 'true';

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a valid positive number.');
      return;
    }

    const productPayload = {
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      image_url: imageUrl || null,
      details: detailsJson,
    };

    setLoading(true);

    try {
      if (isHomepage) {
        // Remove homepage flag from other products
        const existingHomepageProducts = products.filter(p => p.details?._is_homepage === 'true' && p.id !== editingProduct?.id);
        for (const p of existingHomepageProducts) {
          const newDetails = { ...p.details };
          delete newDetails['_is_homepage'];
          await supabase.from('products').update({ details: newDetails }).eq('id', p.id);
        }
      }

      if (editingProduct) {
        // Update product
        const { error: updateError } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        if (updateError) throw updateError;
      } else {
        // Insert product
        const { error: insertError } = await supabase
          .from('products')
          .insert([productPayload]);

        if (insertError) throw insertError;
      }

      setIsFormOpen(false);
      if (!editingProduct && currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchProducts();
      }
    } catch (err: any) {
      console.error('Saving product failed:', err);
      setError(err.message || 'Failed to save product details.');
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out of the Admin panel?')) {
      await supabase.auth.signOut();
      router.push('/admin/login');
    }
  };

  // Since search and pagination are done on the DB, products is already filtered and paginated.
  const filteredProducts = products;

  // Stats Calculations
  const totalProducts = totalCount;
  const averagePrice = avgPrice;
  const premiumProduct = premiumItem;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (authChecking) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 min-h-screen">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Verifying admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow min-h-screen md:h-screen md:overflow-hidden bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:transform-none h-full ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-100">
                M
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">MITOFAVOUR</span>
                <span className="text-[10px] block font-bold text-indigo-600 uppercase tracking-widest -mt-1">Admin Portal</span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden focus:outline-none transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-4 my-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
              <User className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-950 truncate">{userEmail.split('@')[0]}</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Package className="h-4.5 w-4.5" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Admin Users</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Megaphone className="h-4.5 w-4.5" />
              <span>Flash Banner</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <SettingsIcon className="h-4.5 w-4.5" />
              <span>Store Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Store
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 md:h-screen md:overflow-hidden">
        
        {/* Sticky Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden focus:outline-none transition-colors duration-200"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Admin</span>
              <span>/</span>
              <span className="text-slate-800">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Database indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Db Connected</span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <div className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 mb-6 flex gap-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-bold">Error Encountered</p>
                <p className="text-slate-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 1: OVERVIEW TAB
             ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              

              {/* Stats Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat 1: Total Products */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inventory</span>
                    <h3 className="text-2xl font-black text-slate-950 mt-1">{totalProducts}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Listed products in shop</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <Package className="h-6 w-6" />
                  </div>
                </div>

                {/* Stat 2: Avg Price */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Price</span>
                    <h3 className="text-2xl font-black text-slate-950 mt-1">
                      {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'}
                      {new Intl.NumberFormat().format(averagePrice)}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Average value of items</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>

                {/* Stat 3: Premium Item */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premium Product</span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1 truncate">
                      {premiumProduct ? premiumProduct.name : 'None'}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">
                      {premiumProduct ? `${process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'}${new Intl.NumberFormat().format(premiumProduct.price)}` : 'N/A'}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                {/* Stat 4: Database Health */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Status</span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      Active
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Supabase API online</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <Database className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Store Setup Checklist</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="mt-0.5 h-4.5 w-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">✓</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Configure Database & API Keys</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your Next.js environment is connected to Supabase and API requests are working.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="mt-0.5 h-4.5 w-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">✓</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Admin User Created</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your secure admin identity has been successfully registered and validated in auth schema.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="mt-0.5 h-4.5 w-4.5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">3</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Set Up Storage Bucket Policies</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Ensure a public storage bucket named <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-[9px]">product-images</code> is created in Storage settings to enable product image uploads.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              PAGE 2: INVENTORY TAB
             ======================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              
              {/* Header toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Inventory Catalog</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Add, search, edit, and remove products from your storefront.</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <div className="relative w-64 group">
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="block w-full pl-3.5 pr-8 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleAddClick}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Products Table Card */}
              {loading && products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200/80 rounded-3xl gap-3 shadow-sm">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading Catalog...</span>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th scope="col" className="px-6 py-4">Product</th>
                          <th scope="col" className="px-6 py-4">Price</th>
                          <th scope="col" className="px-6 py-4">Specs & Attributes</th>
                          <th scope="col" className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-4">
                              {/* Thumbnail preview */}
                              <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                {product.image_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <HelpCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col max-w-[300px]">
                                <span className="font-bold text-slate-900 truncate">{product.name}</span>
                                <span className="text-xs text-slate-500 line-clamp-1">{product.description || 'No description provided.'}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-extrabold text-slate-900">
                              {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'}
                              {new Intl.NumberFormat().format(product.price)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[280px]">
                                {product.details && Object.keys(product.details).filter(k => !k.startsWith('_')).length > 0 ? (
                                  Object.entries(product.details)
                                    .filter(([k]) => !k.startsWith('_'))
                                    .map(([k, v]) => (
                                      <span
                                        key={k}
                                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 font-semibold"
                                      >
                                        <strong>{k}:</strong> {v}
                                      </span>
                                    ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic">None</span>
                                )}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(product)}
                                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/35 transition-all duration-200 shadow-sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ id: product.id, type: 'product', name: product.name })}
                                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/35 transition-all duration-200 shadow-sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card-List View */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {product.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <HelpCircle className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow flex flex-col overflow-hidden">
                            <span className="font-bold text-slate-900 text-sm truncate">{product.name}</span>
                            <span className="text-xs font-black text-indigo-600 mt-0.5">
                              {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'}
                              {new Intl.NumberFormat().format(product.price)}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: product.id, type: 'product', name: product.name })}
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-500 transition-all shadow-sm"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                        )}
                        {product.details && Object.keys(product.details).filter(k => !k.startsWith('_')).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(product.details)
                              .filter(([k]) => !k.startsWith('_'))
                              .map(([k, v]) => (
                                <span
                                  key={k}
                                  className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] text-slate-600 font-semibold"
                                >
                                  <strong>{k}:</strong> {v}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalItems > itemsPerPage && (
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 gap-4">
                      <span className="text-xs text-slate-500 font-semibold">
                        Showing <span className="text-slate-900">{startIndex + 1}</span> to{' '}
                        <span className="text-slate-900">
                          {Math.min(startIndex + itemsPerPage, totalItems)}
                        </span>{' '}
                        of <span className="text-slate-900">{totalItems}</span> products
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          disabled={currentPage === 1}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-650 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                        >
                          Prev
                        </button>
                        
                        {[...Array(totalPages)].map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              type="button"
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                                currentPage === pageNum
                                  ? 'bg-indigo-600 text-white border border-indigo-600 shadow-md shadow-indigo-600/10'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-650 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Catalog Empty State */
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-4 text-slate-400">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No products found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mb-5 leading-relaxed">
                    {searchQuery ? 'Adjust your search parameters to find matching listed items.' : "You haven't uploaded any products to your storefront yet."}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleAddClick}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Product
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              PAGE 3: SETTINGS TAB
             ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Store Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review your local shop configurations. Values are configured securely via environment variables.</p>
              </div>

              {/* Configurations Display */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
                
                {/* Section A: Contact Configurations */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-4">Contact & Support Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Contact Phone Number</span>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{process.env.NEXT_PUBLIC_CONTACT_PHONE || 'Not Configured'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">WhatsApp Orders Number</span>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                        <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{process.env.NEXT_PUBLIC_WHATSAPP_PHONE || 'Not Configured'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section B: Checkout & Currency */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-4">Pricing & Checkout Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Currency Symbol</span>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-950">
                        <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Order Email Forwarder (Web3Forms Key)</span>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>
                          {process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY && !process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.includes('placeholder')
                            ? 'Active Key Set'
                            : 'Placeholder Configured'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section C: Project Database Details */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-4">Supabase Database API</h3>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Supabase Endpoint URL</span>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                      <Database className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Configured'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Instructions banner */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex gap-3 text-xs text-blue-800">
                <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold">Updating Store Settings</p>
                  <p className="text-slate-650 mt-0.5">
                    To change any support phone numbers, email handlers, or currency symbols, please edit the [.env.local](file:///c:/Users/ss/Desktop/mito/.env.local) file in your codebase and restart your local Next.js server.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              PAGE 4: USERS TAB
             ======================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Admin Accounts</h2>
                  <p className="text-xs text-slate-505 mt-0.5 font-medium">Create, edit, or remove administrator logins for this platform.</p>
                </div>
                <button
                  onClick={handleAddUserClick}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 self-start cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Admin User
                </button>
              </div>

              {userError && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex gap-3 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-bold">Error Encountered</p>
                    <p className="text-slate-650 mt-0.5">{userError}</p>
                  </div>
                </div>
              )}

              {/* Users table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {usersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading administrative users...</span>
                  </div>
                ) : serviceRoleKeyMissing ? (
                  /* Warning state (E.g. service role key not configured) */
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 mb-4 text-amber-600 shadow-sm animate-pulse">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">User Management Restricted</h3>
                    <p className="text-xs text-slate-505 mt-1.5 max-w-sm leading-relaxed">
                      Make sure that `SUPABASE_SERVICE_ROLE_KEY` is correctly set in your [`.env.local`](file:///c:/Users/ss/Desktop/mito/.env.local) file and restart the Next.js server.
                    </p>
                  </div>
                ) : adminUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Email Address</th>
                          <th className="px-6 py-4">Created Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {adminUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                  {u.user_metadata?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900">{u.user_metadata?.name || 'Admin User'}</span>
                                  <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">Administrator</span>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-700">
                              {u.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                              {new Date(u.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleEditUserClick(u)}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
                                title="Edit Admin"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ id: u.id, type: 'user', name: u.user_metadata?.name || u.email || 'Admin User' })}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                title="Delete Admin"
                                disabled={u.email === userEmail} // Cannot delete self
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Empty State (Loaded, no other users) */
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-4 text-slate-400">
                      <User className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No other admin accounts</h3>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
                      Use the "Add Admin User" button above to register additional administrators.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE 5: BANNERS TAB
             ======================================================== */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Announcement Banners</h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Create and manage flash announcement bands shown at the very top of the storefront.</p>
                </div>
                <button
                  onClick={handleAddBannerClick}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 self-start cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New Banner
                </button>
              </div>

              {bannerError && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex gap-3 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-bold">Error Encountered</p>
                    <p className="text-slate-600 mt-0.5">{bannerError}</p>
                  </div>
                </div>
              )}

              {/* Banners table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {bannersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading banners...</span>
                  </div>
                ) : banners.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="px-6 py-4">Announcement Message</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Created Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {banners.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-800 break-words max-w-md">
                              {b.message}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.is_active 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-200'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${b.is_active ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                {b.is_active ? 'Active' : 'Draft / Inactive'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                              {new Date(b.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleToggleActiveBanner(b)}
                                className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                                  b.is_active
                                    ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    : 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600 shadow-amber-100'
                                }`}
                                title={b.is_active ? 'Deactivate Banner' : 'Activate Banner'}
                              >
                                {b.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleEditBannerClick(b)}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-indigo-600 transition-all shadow-sm cursor-pointer inline-flex items-center"
                                title="Edit Banner"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ id: b.id, type: 'banner', name: b.message })}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-500 transition-all shadow-sm cursor-pointer inline-flex items-center"
                                title="Delete Banner"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-4 text-slate-400">
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No announcement banners</h3>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
                      Use the "Add New Banner" button above to create a custom flash notification for the top of the storefront.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Store Item'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Product Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Leather Chelsea Boots"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Product Price */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Price ({process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 150.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Product Original Price */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Original Price / Compare At ({process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 250.00"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tagline (Small Bubble Text)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🦠 For Pest Control Professionals"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Catchphrase */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Catchphrase / Main Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eradicate Pests and Pathogens Fast."
                  value={catchphrase}
                  onChange={(e) => setCatchphrase(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Set as Homepage */}
              <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4">
                <input
                  type="checkbox"
                  id="isHomepage"
                  checked={isHomepage}
                  onChange={(e) => setIsHomepage(e.target.checked)}
                  className="w-5 h-5 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="isHomepage" className="text-sm font-bold text-amber-900 cursor-pointer">
                  Set as Featured Homepage Product
                  <span className="block text-xs font-normal text-amber-700 mt-0.5">
                    This will replace the current product displayed on the main landing page.
                  </span>
                </label>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell customers about the product materials, sizing, or aesthetic details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300 resize-none"
                />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Product Images (Up to 3)
                </label>
                <div className="flex flex-col gap-4">
                  {[
                    { val: imageUrl, set: setImageUrl, num: 1 },
                    { val: imageUrl2, set: setImageUrl2, num: 2 },
                    { val: imageUrl3, set: setImageUrl3, num: 3 }
                  ].map((imgData) => (
                    <div key={imgData.num} className="flex flex-col gap-3">
                      <span className="text-[10px] font-semibold text-slate-400">Image {imgData.num} {imgData.num === 1 ? '(Main)' : ''}</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste Image URL or upload one"
                          value={imgData.val}
                          onChange={(e) => imgData.set(e.target.value)}
                          className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                        />
                        <label className="cursor-pointer flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all shrink-0">
                          {uploadingImage === imgData.num ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, imgData.num)}
                            disabled={uploadingImage !== null}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {imgData.val && (
                        <div className="relative h-24 w-24 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgData.val} alt={`Preview ${imgData.num}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => imgData.set('')}
                            className="absolute top-1 right-1 h-5 w-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-900 text-white flex items-center justify-center rounded-full text-[10px] shadow"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications / Attributes */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Additional Attributes (Specifications)
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:underline uppercase"
                  >
                    + Add Attribute
                  </button>
                </div>
                
                <div className="space-y-2">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-2 items-center animate-fade-in">
                      <input
                        type="text"
                        placeholder="Label (e.g. Size)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                        className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. XL, L or 42, 43)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                        className="flex-grow px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                      />
                      {specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecField(i)}
                          className="text-slate-400 hover:text-red-500 p-1 hover:bg-slate-50 rounded-lg"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    Tip: Separate multiple options with commas (e.g. "M, L, XL") to let customers select them in the order form.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage !== null}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-md shadow-indigo-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Admin User Modal */}
      {isUserFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingUser ? `Edit: ${editingUser.email}` : 'Add New Administrator'}
              </h3>
              <button
                onClick={() => setIsUserFormOpen(false)}
                className="text-slate-400 hover:text-slate-650 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              {userError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 flex gap-2 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{userError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Name / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Udeze Ernest"
                  value={userDisplayName}
                  onChange={(e) => setUserDisplayName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@mitostore.com"
                  value={userEmailField}
                  onChange={(e) => setUserEmailField(e.target.value)}
                  disabled={!!editingUser}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 transition-colors duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password {editingUser ? '(Leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : 'Minimum 6 characters'}
                  value={userPasswordField}
                  onChange={(e) => setUserPasswordField(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Current Password - only shown if editing own account and new password has been input */}
              {editingUser && editingUser.email === userEmail && userPasswordField && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your current password"
                    value={userCurrentPasswordField}
                    onChange={(e) => setUserCurrentPasswordField(e.target.value)}
                    className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
              )}

              {/* Modal Footer / Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsUserFormOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-505 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={usersLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-md shadow-indigo-100 cursor-pointer"
                >
                  {usersLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isBannerFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingBanner ? 'Edit Announcement Banner' : 'Create New Announcement Banner'}
              </h3>
              <button
                onClick={() => setIsBannerFormOpen(false)}
                className="text-slate-400 hover:text-slate-650 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveBanner} className="p-6 space-y-4">
              {bannerError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 flex gap-2 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{bannerError}</span>
                </div>
              )}

              {/* Banner Message */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Announcement Message *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. 🔥 Limited Stock Available — Order Now & Pay on Delivery!"
                  value={bannerMessage}
                  onChange={(e) => setBannerMessage(e.target.value)}
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors duration-300 resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Keep it short and punchy for the top message strip.</p>
              </div>

              {/* Is Active Switch */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Set Active
                  </span>
                  <span className="text-[10px] text-slate-505">
                    If active, this banner will show up on the storefront and deactivate any other active banners.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBannerFormOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-505 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bannersLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-md shadow-indigo-100 cursor-pointer"
                >
                  {bannersLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300">
            {/* Close button */}
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
              disabled={isDeleting}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Alert icon */}
              <div className="h-12 w-12 rounded-full bg-red-50 border border-red-100 text-red-500 flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {deleteTarget.type === 'product' && 'Delete Store Product?'}
                  {deleteTarget.type === 'user' && 'Delete Admin Account?'}
                  {deleteTarget.type === 'banner' && 'Delete Announcement Banner?'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  {deleteTarget.type === 'product' && (
                    <>
                      Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong> from the store catalog? This action cannot be undone.
                    </>
                  )}
                  {deleteTarget.type === 'user' && (
                    <>
                      Are you sure you want to delete the administrator account for <strong>{deleteTarget.name}</strong>? They will immediately lose dashboard access.
                    </>
                  )}
                  {deleteTarget.type === 'banner' && (
                    <>
                      Are you sure you want to delete this announcement banner? It will be permanently removed from the system.
                    </>
                  )}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 w-full pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (deleteTarget.type === 'product') {
                      await handleDeleteProduct(deleteTarget.id);
                    } else if (deleteTarget.type === 'user') {
                      await handleDeleteUser(deleteTarget.id);
                    } else if (deleteTarget.type === 'banner') {
                      await handleDeleteBanner(deleteTarget.id);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-650 py-2.5 text-xs font-black text-white hover:bg-red-700 transition-colors shadow-md shadow-red-500/10 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
