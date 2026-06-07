import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Authentication helper
async function verifyUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('verifyUser: Missing or invalid Authorization header');
    return null;
  }
  const token = authHeader.split(' ')[1];

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data: { user }, error } = await userClient.auth.getUser(token);
  if (error) {
    console.error('verifyUser: Supabase getUser error:', error.message);
    return null;
  }
  if (!user) {
    console.warn('verifyUser: No user session found for token');
    return null;
  }
  return user;
}

// Check configuration helper
function getAdminClient() {
  if (
    !serviceRoleKey ||
    serviceRoleKey.includes('your_service_role_key') ||
    serviceRoleKey.includes('placeholder')
  ) {
    console.warn('getAdminClient: SUPABASE_SERVICE_ROLE_KEY is not configured or placeholder.');
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// GET: List all users
export async function GET(request: Request) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Supabase Service Role Key is not configured in .env.local.' },
        { status: 501 }
      );
    }

    const { data, error } = await adminClient.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out super admin (ernestez12@gmail.com) if the logged in user is not the super admin
    const loggedInEmail = user.email?.toLowerCase();
    let returnedUsers = data?.users || [];
    if (loggedInEmail !== 'ernestez12@gmail.com') {
      returnedUsers = returnedUsers.filter(u => u.email?.toLowerCase() !== 'ernestez12@gmail.com');
    }

    // Return the list of users
    return NextResponse.json({ users: returnedUsers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Supabase Service Role Key is not configured in .env.local.' },
        { status: 501 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || 'Admin User',
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
