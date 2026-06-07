-- ==========================================
-- SUPABASE DATABASE SETUP SCHEMA
-- Copy and run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on products table
alter table public.products enable row level security;

-- 3. Create policies for public.products table
-- Policy A: Allow anyone (unauthenticated) to view products
create policy "Allow public read access"
  on public.products
  for select
  using (true);

-- Policy B: Allow only authenticated users (admin) to insert, update, and delete
create policy "Allow authenticated admin full access"
  on public.products
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ==========================================
-- SUPABASE STORAGE BUCKET SETUP
-- ==========================================
-- Follow these steps in the Supabase Dashboard:
-- 1. Navigate to "Storage" in the left sidebar.
-- 2. Click "New bucket".
-- 3. Name the bucket "product-images".
-- 4. Toggle "Public bucket" to ON (this allows public URLs to display the images).
-- 5. Click "Save".
--
-- After creating the bucket, run the SQL policies below to allow uploads:

-- Allow public read access to storage objects
create policy "Allow public read storage"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated users to upload and manage storage files
create policy "Allow admin to upload storage"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Allow admin to update storage"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Allow admin to delete storage"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');


-- ==========================================
-- INITIALIZE ADMIN USER (Udeze Ernest)
-- ==========================================
-- Run this block to create the admin user if it does not already exist.
-- It will insert the user into auth.users and auth.identities, bypassing email verification.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ 
DECLARE 
  v_user_id UUID := gen_random_uuid();
  v_encrypted_pw TEXT;
BEGIN 
  -- Generate bcrypt hash for password (replace 'your_password' with your desired password)
  v_encrypted_pw := crypt('your_password', gen_salt('bf'));

  -- 1. Check if user already exists (replace 'admin@example.com' with your email)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    
    -- 2. Insert into auth.users
    INSERT INTO auth.users (
      id, 
      instance_id,
      email, 
      encrypted_password, 
      email_confirmed_at, 
      raw_app_meta_data, 
      raw_user_meta_data, 
      aud, 
      role,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id, 
      '00000000-0000-0000-0000-000000000000',
      'admin@example.com', 
      v_encrypted_pw, 
      NOW(), 
      '{"provider":"email","providers":["email"]}', 
      '{"name":"Super Admin"}', 
      'authenticated', 
      'authenticated',
      NOW(),
      NOW()
    );

    -- 3. Insert into auth.identities
    INSERT INTO auth.identities (
      id, 
      user_id, 
      provider_id, 
      provider, 
      identity_data,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(), 
      v_user_id, 
      v_user_id::text, 
      'email', 
      format('{"sub":"%s","email":"%s"}', v_user_id, 'admin@example.com')::jsonb,
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Admin user created successfully.';
  ELSE
    RAISE NOTICE 'User with that email already exists.';
  END IF;
END $$;


-- ==========================================
-- SEED INITIAL PRODUCTS (Mitofavour Catalog)
-- ==========================================
-- Seed the 6 Mitofavour products

INSERT INTO public.products (name, price, description, image_url, details)
SELECT 
  'Pulsed Power Sprayer Thermal Fogging Machine',
  185000,
  'Specialized pulsed power sprayer thermal fogging machine designed for efficient pest control, vector management, and professional disinfection. Engineered with high-strength stainless steel barrel & body and durable chemical tanks. Lightweight, easy to start, and delivers uniform micro-fog distribution.',
  '/thermal_fogging_machine.jpg',
  '{"Tanks": "Dual Chemical & Fuel & Solution Tanks", "Barrel & Body": "High-Grade Stainless Steel", "Application": "Pest Control, Disinfection & Sanitization", "Structure": "Compact Ergonomic Carrying Frame"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = 'Pulsed Power Sprayer Thermal Fogging Machine'
);

INSERT INTO public.products (name, price, description, image_url, details)
SELECT 
  'Cordless Drill & Impact Driver Toolset Box',
  95000,
  'Heavy-duty cordless drill/driver and angle grinder combo set. Features brushless high-torque motors, dual 18V rechargeable battery packs, and a fast-charging adapter. Comes complete with a comprehensive premium hand tools box including hammer, impact wrenches, pliers, saws & knives, screwdrivers, tape measure, electrical tape, and drill bits.',
  '/cordless_drill_set.jpg',
  '{"Battery": "18V XR 4.0Ah Lithium-Ion (2 included)", "Included Tools": "Hammer, Pliers, Wrench, Saws & Screwdrivers", "Drill Bits": "Masonry, Wood, & Steel Assortment", "Charger": "Fast Charge Power Cord", "Box Carrying": "Heavy-duty Orange Case"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = 'Cordless Drill & Impact Driver Toolset Box'
);

INSERT INTO public.products (name, price, description, image_url, details)
SELECT 
  'Professional Demolition Jack Hammer',
  145000,
  'Industrial grade demolition jack hammer designed for heavy concrete crushing, brick removal, and chipping. Features a high-power motor with speed controls and comfortable anti-vibration shock absorbers.',
  '/demolition_jack_hammer.png',
  '{"Power Source": "Corded Electric", "Impact Energy": "45 Joules", "Safety features": "Anti-Vibration System", "Chisels": "Flat & Pointed Chisels Included"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = 'Professional Demolition Jack Hammer'
);

INSERT INTO public.products (name, price, description, image_url, details)
SELECT 
  'Cordless Circular Saw Kit',
  78000,
  'High-performance cordless circular saw with premium safety guards and rip-cut fence. Powered by high-capacity batteries allowing easy, clean wood and composite board cuts for all construction projects.',
  '/cordless_circular_saw.png',
  '{"Battery": "18V Brushless Battery Pack", "Blade Diameter": "165mm Premium Steel", "Bevel Capacity": "0 - 50 Degrees Bevel Control", "Safety features": "Electric Brake & Safe Guards"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = 'Cordless Circular Saw Kit'
);

INSERT INTO public.products (name, price, description, image_url, details)
SELECT 
  '3D Green Laser Level & Tripod',
  52500,
  'High-accuracy 3D green beam self-leveling laser level. Projects full horizontal and vertical lines for leveling and alignment. Includes standard adjustable steel mounting tripod and carrying pouch.',
  '/laser_level_tripod.png',
  '{"Laser Color": "Bright Green 3D Lines", "Tripod Height": "Adjustable (Up to 1.2m)", "Self-Leveling": "Automatic Self-Leveling \u00b13\u00b0", "Accuracy": "\u00b11mm at 5m Range"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = '3D Green Laser Level & Tripod'
);

INSERT INTO public.products (name, price, description, image_url, details)
SELECT 
  'Professional Cordless Angle Grinder Kit',
  68000,
  'High-performance cordless angle grinder kit with brushless motor and safety guard. Ideal for metal cutting, grinding, and polishing. Includes two 18V rechargeable battery packs and a premium storage box.',
  '/cordless_angle_grinder.png',
  '{"Battery": "18V Lithium-Ion (2 included)", "Disc Diameter": "115mm (4.5 inches)", "Speed": "No-Load Speed 8500 RPM", "Safety": "Two-Stage Paddle Switch & Guard"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = 'Professional Cordless Angle Grinder Kit'
);


-- ==========================================
-- SUPABASE BANNERS TABLE SETUP
-- ==========================================

create table if not exists public.banners (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.banners enable row level security;

-- Policies
create policy "Allow public read banners"
  on public.banners for select
  using (true);

create policy "Allow authenticated admin insert banners"
  on public.banners for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated admin update banners"
  on public.banners for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated admin delete banners"
  on public.banners for delete
  using (auth.role() = 'authenticated');


-- Seed initial banner
INSERT INTO public.banners (message, is_active)
VALUES ('🔥 Limited Stock Available — Order Now & Pay on Delivery!', true);




