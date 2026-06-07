import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Authentication helper
async function verifyUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('verifyUser ID Route: Missing or invalid Authorization header');
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
    console.error('verifyUser ID Route: Supabase getUser error:', error.message);
    return null;
  }
  if (!user) {
    console.warn('verifyUser ID Route: No user session found for token');
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
    console.warn('getAdminClient ID Route: SUPABASE_SERVICE_ROLE_KEY is not configured or placeholder.');
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// PUT: Update an existing user
export async function PUT(request: Request, context: any) {
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

    // Await params if it is an async parameter (Next.js 16 standard is to await params if it's an async context, or context.params)
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Fetch target user to check if they are the super admin
    const { data: { user: targetUser }, error: getUserError } = await adminClient.auth.admin.getUserById(id);
    if (getUserError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent non-super-admins from editing the super admin
    if (targetUser.email?.toLowerCase() === 'ernestez12@gmail.com' && user.email?.toLowerCase() !== 'ernestez12@gmail.com') {
      return NextResponse.json({ error: 'Forbidden: You cannot modify the Super Admin account.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name } = body;

    const updatePayload: any = {
      user_metadata: {
        name: name || 'Admin User',
      },
    };

    if (email) {
      updatePayload.email = email;
    }

    if (password) {
      updatePayload.password = password;
    }

    const { data, error } = await adminClient.auth.admin.updateUserById(id, updatePayload);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(request: Request, context: any) {
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

    // Await params if it is an async parameter
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Fetch target user to check if they are the super admin
    const { data: { user: targetUser }, error: getUserError } = await adminClient.auth.admin.getUserById(id);
    if (getUserError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent non-super-admins from deleting the super admin
    if (targetUser.email?.toLowerCase() === 'ernestez12@gmail.com' && user.email?.toLowerCase() !== 'ernestez12@gmail.com') {
      return NextResponse.json({ error: 'Forbidden: You cannot delete the Super Admin account.' }, { status: 403 });
    }

    // Check if the user is trying to delete themselves to prevent locked-out situations
    if (user.id === id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
