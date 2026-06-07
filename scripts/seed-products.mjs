import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

// Use createRequire to resolve dependencies from the project root
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to get credentials if available
const envPath = path.resolve('.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
let adminEmail = process.env.ADMIN_EMAIL || '';
let adminPassword = process.env.ADMIN_PASSWORD || '';

if (fs.existsSync(envPath)) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
        if (key === 'ADMIN_EMAIL') adminEmail = val;
        if (key === 'ADMIN_PASSWORD') adminPassword = val;
      }
    }
  } catch (e) {
    console.error('Error reading .env.local:', e.message);
  }
}

if (!supabaseUrl || !supabaseAnonKey || !adminEmail || !adminPassword) {
  console.log('⚠️ Required environment variables (SUPABASE_URL, ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD) not configured.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
  {
    name: 'Pulsed Power Sprayer Thermal Fogging Machine',
    price: 185000,
    description: 'Specialized pulsed power sprayer thermal fogging machine designed for efficient pest control, vector management, and professional disinfection. Engineered with high-strength stainless steel barrel & body and durable chemical tanks. Lightweight, easy to start, and delivers uniform micro-fog distribution.',
    image_url: '/thermal_fogging_machine.jpg',
    details: {
      "Tanks": "Dual Chemical & Fuel & Solution Tanks",
      "Barrel & Body": "High-Grade Stainless Steel",
      "Application": "Pest Control, Disinfection & Sanitization",
      "Structure": "Compact Ergonomic Carrying Frame"
    }
  },
  {
    name: 'Cordless Drill & Impact Driver Toolset Box',
    price: 95000,
    description: 'Heavy-duty cordless drill/driver and angle grinder combo set. Features brushless high-torque motors, dual 18V rechargeable battery packs, and a fast-charging adapter. Comes complete with a comprehensive premium hand tools box including hammer, impact wrenches, pliers, saws & knives, screwdrivers, tape measure, electrical tape, and drill bits.',
    image_url: '/cordless_drill_set.jpg',
    details: {
      "Battery": "18V XR 4.0Ah Lithium-Ion (2 included)",
      "Included Tools": "Hammer, Pliers, Wrench, Saws & Screwdrivers",
      "Drill Bits": "Masonry, Wood, & Steel Assortment",
      "Charger": "Fast Charge Power Cord",
      "Box Carrying": "Heavy-duty Orange Case"
    }
  },
  {
    name: 'Professional Demolition Jack Hammer',
    price: 145000,
    description: 'Industrial grade demolition jack hammer designed for heavy concrete crushing, brick removal, and chipping. Features a high-power motor with speed controls and comfortable anti-vibration shock absorbers.',
    image_url: '/demolition_jack_hammer.png',
    details: {
      "Power Source": "Corded Electric",
      "Impact Energy": "45 Joules",
      "Safety features": "Anti-Vibration System",
      "Chisels": "Flat & Pointed Chisels Included"
    }
  },
  {
    name: 'Cordless Circular Saw Kit',
    price: 78000,
    description: 'High-performance cordless circular saw with premium safety guards and rip-cut fence. Powered by high-capacity batteries allowing easy, clean wood and composite board cuts for all construction projects.',
    image_url: '/cordless_circular_saw.png',
    details: {
      "Battery": "18V Brushless Battery Pack",
      "Blade Diameter": "165mm Premium Steel",
      "Bevel Capacity": "0 - 50 Degrees Bevel Control",
      "Safety features": "Electric Brake & Safe Guards"
    }
  },
  {
    name: '3D Green Laser Level & Tripod',
    price: 52500,
    description: 'High-accuracy 3D green beam self-leveling laser level. Projects full horizontal and vertical lines for leveling and alignment. Includes standard adjustable steel mounting tripod and carrying pouch.',
    image_url: '/laser_level_tripod.png',
    details: {
      "Laser Color": "Bright Green 3D Lines",
      "Tripod Height": "Adjustable (Up to 1.2m)",
      "Self-Leveling": "Automatic Self-Leveling ±3°",
      "Accuracy": "±1mm at 5m Range"
    }
  },
  {
    name: 'Professional Cordless Angle Grinder Kit',
    price: 68000,
    description: 'High-performance cordless angle grinder kit with brushless motor and safety guard. Ideal for metal cutting, grinding, and polishing. Includes two 18V rechargeable battery packs and a premium storage box.',
    image_url: '/cordless_angle_grinder.png',
    details: {
      "Battery": "18V Lithium-Ion (2 included)",
      "Disc Diameter": "115mm (4.5 inches)",
      "Speed": "No-Load Speed 8500 RPM",
      "Safety": "Two-Stage Paddle Switch & Guard"
    }
  }
];

async function seedProducts() {
  try {
    console.log(`🔐 Authenticating as admin (${adminEmail})...`);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      console.error('👉 Make sure the admin user exists in your Supabase auth table.');
      process.exit(1);
    }

    console.log('✅ Authentication successful! Clearing products catalog...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('❌ Failed to clear products:', deleteError.message);
      process.exit(1);
    }

    console.log('🌱 Seeding 6 Mitofavour catalog products...');
    const { error: insertError } = await supabase
      .from('products')
      .insert(products);

    if (insertError) {
      console.error('❌ Failed to insert products:', insertError.message);
      process.exit(1);
    }

    console.log('🚀 Successfully seeded 6 products into database!');
  } catch (err) {
    console.error('❌ Unexpected error seeding database:', err.message);
  }
}

seedProducts();
