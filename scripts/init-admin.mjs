import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

// Use createRequire to resolve dependencies from the project root
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to get credentials if available
const envPath = path.resolve('.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
let adminEmail = process.env.ADMIN_EMAIL || '';
let adminPassword = process.env.ADMIN_PASSWORD || '';
let adminName = process.env.ADMIN_NAME || '';

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
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceRoleKey = val;
        if (key === 'ADMIN_EMAIL') adminEmail = val;
        if (key === 'ADMIN_PASSWORD') adminPassword = val;
        if (key === 'ADMIN_NAME') adminName = val;
      }
    }
  } catch (e) {
    console.error('Error reading .env.local:', e.message);
  }
}

if (!supabaseUrl) {
  console.log('⚠️ NEXT_PUBLIC_SUPABASE_URL is not set. Skipping admin user initialization.');
  process.exit(0);
}

if (!serviceRoleKey || serviceRoleKey.includes('your_service_role_key') || serviceRoleKey.includes('placeholder')) {
  console.log('⚠️ SUPABASE_SERVICE_ROLE_KEY is a placeholder or not defined in .env.local. Skipping admin user initialization.');
  console.log('👉 To enable automatic admin initialization, please add a valid SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME to your .env.local.');
  process.exit(0);
}

if (!adminEmail || !adminPassword) {
  console.log('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD is not defined in .env.local. Skipping admin user initialization.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function initializeAdmin() {
  try {
    console.log(`Checking if admin user (${adminEmail}) exists...`);
    
    // List users to check if our admin email already exists
    const { data, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      process.exit(1);
    }

    const users = data?.users || [];
    const adminExists = users.some(u => u.email?.toLowerCase() === adminEmail.toLowerCase());

    if (adminExists) {
      console.log(`✅ Admin user (${adminEmail}) already exists. No action taken.`);
    } else {
      console.log(`Creating admin user (${adminEmail})...`);
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: adminName || 'Admin'
        }
      });

      if (createError) {
        console.error('❌ Failed to create admin user:', createError.message);
        process.exit(1);
      }

      console.log(`🚀 Super Admin user "${adminName || 'Admin'}" initialized successfully!`);
    }
  } catch (err) {
    console.error('❌ Unexpected error initializing admin:', err.message);
  }
}

async function initializeStorage() {
  try {
    console.log('Checking "product-images" storage bucket configuration...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Failed to list storage buckets:', listError.message);
      return;
    }

    const bucketName = 'product-images';
    const bucket = buckets.find(b => b.name === bucketName);

    if (!bucket) {
      console.log(`Creating "${bucketName}" storage bucket...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });

      if (createError) {
        console.error(`❌ Failed to create "${bucketName}" storage bucket:`, createError.message);
      } else {
        console.log(`🚀 Created public storage bucket "${bucketName}" successfully!`);
      }
    } else if (!bucket.public) {
      console.log(`Updating "${bucketName}" storage bucket to be public...`);
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true
      });

      if (updateError) {
        console.error(`❌ Failed to update "${bucketName}" storage bucket to public:`, updateError.message);
      } else {
        console.log(`✅ Successfully configured "${bucketName}" storage bucket as public.`);
      }
    } else {
      console.log(`✅ Storage bucket "${bucketName}" is already configured and public.`);
    }
  } catch (err) {
    console.error('❌ Unexpected error initializing storage:', err.message);
  }
}

async function run() {
  await initializeAdmin();
  await initializeStorage();
}

run();
